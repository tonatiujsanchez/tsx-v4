/**
 * Google Analytics 4 con Basic Consent Mode.
 *
 * Reglas invariantes de este módulo:
 * - Nada se descarga ni se envía a Google antes del consentimiento explícito.
 * - `gtag.js` se inyecta una sola vez y `config` se ejecuta una sola vez.
 * - El listener de `astro:page-load` se registra una sola vez, en el nivel
 *   superior del módulo, nunca dentro de una función que corra en page-load.
 * - Como ClientRouter nunca recarga el documento, el estado vive en `window`
 *   y sobrevive a todas las navegaciones sin re-inicializar nada.
 */

export type ConsentStatus = 'granted' | 'denied' | 'undecided'

type ConsentDecision = Exclude<ConsentStatus, 'undecided'>

type ConsentSignal = 'granted' | 'denied'

interface ConsentRecord {
  v: number
  status: ConsentDecision
  ts: number
}

interface ConsentParams {
  analytics_storage: ConsentSignal
  ad_storage: ConsentSignal
  ad_user_data: ConsentSignal
  ad_personalization: ConsentSignal
}

interface ConfigParams {
  send_page_view: boolean
  allow_google_signals: boolean
  allow_ad_personalization_signals: boolean
  debug_mode?: boolean
}

interface PageViewParams {
  page_location: string
  page_title: string
  page_referrer?: string
  debug_mode?: boolean
}

/** Redes soportadas por la sección de compartir del blog. */
export type ShareNetwork = 'linkedin' | 'facebook' | 'x' | 'copy'

/**
 * Solo identificadores del contenido. Nunca el título, la URL completa ni
 * ningún dato que pueda identificar a la persona que comparte.
 */
interface ShareArticleParams {
  article_slug: string
  share_network: ShareNetwork
  debug_mode?: boolean
}

interface GtagFn {
  (command: 'js', value: Date): void
  (command: 'consent', action: 'default' | 'update', params: Partial<ConsentParams>): void
  (command: 'config', measurementId: string, params: ConfigParams): void
  (command: 'event', eventName: 'page_view', params: PageViewParams): void
  (command: 'event', eventName: 'share_article', params: ShareArticleParams): void
}

declare global {
  interface Window {
    dataLayer?: IArguments[]
    gtag?: GtagFn
    /** `config` ya se ejecutó para el Measurement ID. */
    __gaInitialized?: boolean
    /** El tag de googletagmanager.com ya se insertó en el documento. */
    __gaScriptInjected?: boolean
    /** El listener de `astro:page-load` ya está registrado. */
    __gaPageLoadBound?: boolean
    /** URL del último page_view enviado; guardia anti-duplicados. */
    __gaLastPageViewUrl?: string
    /** URL previa, usada como `page_referrer` tras navegar con ClientRouter. */
    __gaPreviousUrl?: string
  }
}

const CONSENT_KEY = 'ga-consent-tsx'
const DEBUG_KEY = 'ga-debug-tsx'
const CONSENT_VERSION = 1

const LOCAL_HOSTNAMES = new Set(['', 'localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'])

/**
 * Vite reemplaza esta expresión en tiempo de compilación. Se lee como `unknown`
 * y se estrecha a string para no arrastrar el `any` del index signature de
 * `ImportMetaEnv`.
 */
const rawMeasurementId: unknown = import.meta.env.PUBLIC_GA_MEASUREMENT_ID

const MEASUREMENT_ID: string = typeof rawMeasurementId === 'string' ? rawMeasurementId.trim() : ''

/** localStorage lanza en Safari privado y con cookies bloqueadas. */
function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* Sin persistencia: la decisión solo vale para esta vista. */
  }
}

function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* Nada que limpiar si el almacenamiento no está disponible. */
  }
}

function isLocalHost(): boolean {
  const hostname = window.location.hostname.toLowerCase()
  return LOCAL_HOSTNAMES.has(hostname) || hostname.endsWith('.local')
}

/** Nombres de cookies presentes que pertenecen a GA4: `_ga` y `_ga_*`. */
function analyticsCookieNames(): string[] {
  const found = new Set<string>()

  try {
    const raw = document.cookie
    if (!raw) return []

    for (const entry of raw.split(';')) {
      const name = entry.split('=')[0]?.trim()
      if (!name) continue
      if (name === '_ga' || name.startsWith('_ga_')) {
        found.add(name)
      }
    }
  } catch {
    return []
  }

  return [...found]
}

/**
 * Ámbitos donde pudo quedar escrita una cookie de GA4: host-only (sin atributo
 * `domain`), el hostname actual y cada dominio padre hasta el registrable, con
 * y sin punto inicial. Se detiene en dos etiquetas, así que nunca intenta un
 * sufijo público suelto; tampoco recorta literales IPv4.
 */
function cookieDomainCandidates(): (string | undefined)[] {
  const candidates: (string | undefined)[] = [undefined]
  const hostname = window.location.hostname.toLowerCase()

  if (!hostname) return candidates

  const isIpv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)
  const labels = hostname.split('.')

  if (isIpv4 || labels.length < 2) {
    candidates.push(hostname)
    return candidates
  }

  for (let i = 0; i + 2 <= labels.length; i += 1) {
    const domain = labels.slice(i).join('.')
    candidates.push(domain, `.${domain}`)
  }

  return candidates
}

function expireCookie(name: string, domain: string | undefined): void {
  const base = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  document.cookie = domain ? `${base}; domain=${domain}` : base
}

/**
 * Expira únicamente las cookies de GA4. No toca ninguna otra cookie ni el
 * `localStorage`. Silenciosa si no hay cookies, si no hay ninguna de Analytics
 * o si el navegador las tiene deshabilitadas.
 */
function clearAnalyticsCookies(): void {
  try {
    const names = analyticsCookieNames()
    if (names.length === 0) return

    const domains = cookieDomainCandidates()

    for (const name of names) {
      for (const domain of domains) {
        expireCookie(name, domain)
      }
    }
  } catch {
    /* Cookies deshabilitadas: no hay nada que limpiar ni que reportar. */
  }
}

/**
 * Modo debug local. Nunca se activa sin Measurement ID, de modo que el flag por
 * sí solo no puede provocar tráfico hacia Google.
 */
export function isDebugMode(): boolean {
  if (!MEASUREMENT_ID) return false
  return readStorage(DEBUG_KEY) === '1'
}

/**
 * Analytics queda completamente inerte si falta el Measurement ID, o si el host
 * es local y no se activó el modo debug.
 */
export function isAnalyticsEnabled(): boolean {
  if (!MEASUREMENT_ID) return false
  if (!isLocalHost()) return true
  return isDebugMode()
}

function isConsentRecord(value: unknown): value is ConsentRecord {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return (
    typeof record.v === 'number' &&
    typeof record.ts === 'number' &&
    (record.status === 'granted' || record.status === 'denied')
  )
}

export function readConsent(): ConsentStatus {
  const raw = readStorage(CONSENT_KEY)
  if (!raw) return 'undecided'

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isConsentRecord(parsed)) return 'undecided'
    if (parsed.v !== CONSENT_VERSION) return 'undecided'
    return parsed.status
  } catch {
    return 'undecided'
  }
}

/** Persiste solo versión, decisión y fecha. Ningún dato personal. */
function writeConsent(status: ConsentDecision): void {
  const record: ConsentRecord = { v: CONSENT_VERSION, status, ts: Date.now() }
  writeStorage(CONSENT_KEY, JSON.stringify(record))
}

/** Crea `dataLayer` y el stub `gtag` sin contactar a Google. */
function ensureGtagStub(): GtagFn | undefined {
  if (!window.dataLayer) {
    window.dataLayer = []
  }

  if (typeof window.gtag !== 'function') {
    // gtag.js espera el objeto `arguments` original, no una copia en array.
    function gtag(): void {
      window.dataLayer?.push(arguments)
    }
    window.gtag = gtag
  }

  return window.gtag
}

function injectGtagScript(): void {
  if (window.__gaScriptInjected) return
  window.__gaScriptInjected = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`
  script.dataset.gaLoader = 'true'
  script.addEventListener(
    'error',
    () => {
      // El sitio sigue funcionando sin medición. Sin reintentos ni errores visibles.
    },
    { once: true }
  )

  document.head.appendChild(script)
}

/**
 * Carga GA4. Idempotente: una sola inyección del tag y un solo `config`.
 * No envía el page_view; de eso se encarga `sendPageView()`.
 */
export function loadGoogleAnalytics(): void {
  if (!isAnalyticsEnabled()) return
  if (readConsent() !== 'granted') return
  if (window.__gaInitialized) return

  const gtag = ensureGtagStub()
  if (!gtag) return

  window.__gaInitialized = true

  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })

  injectGtagScript()

  gtag('js', new Date())
  gtag('consent', 'update', { analytics_storage: 'granted' })

  const config: ConfigParams = {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  }
  if (isDebugMode()) {
    config.debug_mode = true
  }

  gtag('config', MEASUREMENT_ID, config)
}

/**
 * Envía exactamente un `page_view` para la URL actual. La guardia por URL
 * impide duplicados cuando el consentimiento llega después de `astro:page-load`.
 */
export function sendPageView(): void {
  if (!isAnalyticsEnabled()) return
  if (readConsent() !== 'granted') return
  if (!window.__gaInitialized) return

  const gtag = window.gtag
  if (!gtag) return

  const currentUrl = window.location.href
  if (window.__gaLastPageViewUrl === currentUrl) return

  // En la primera carga el referrer es externo; después es la URL interna previa.
  const referrer = window.__gaPreviousUrl ?? document.referrer

  window.__gaLastPageViewUrl = currentUrl
  window.__gaPreviousUrl = currentUrl

  const params: PageViewParams = {
    page_location: currentUrl,
    page_title: document.title,
  }
  if (referrer) {
    params.page_referrer = referrer
  }
  if (isDebugMode()) {
    params.debug_mode = true
  }

  gtag('event', 'page_view', params)
}

/**
 * Registra la intención de compartir un artículo. Comparte las mismas guardias
 * que `sendPageView()`: sin Measurement ID, en local sin modo debug, sin
 * consentimiento `granted` o sin GA inicializado, la función es un no-op y no
 * deja nada encolado en `dataLayer` para enviarse más tarde.
 */
export function trackShareArticle(articleSlug: string, shareNetwork: ShareNetwork): void {
  if (!isAnalyticsEnabled()) return
  if (readConsent() !== 'granted') return
  if (!window.__gaInitialized) return

  const gtag = window.gtag
  if (typeof gtag !== 'function') return

  const params: ShareArticleParams = {
    article_slug: articleSlug,
    share_network: shareNetwork,
  }
  if (isDebugMode()) {
    params.debug_mode = true
  }

  gtag('event', 'share_article', params)
}

/** Acepta: persiste, carga GA4 y envía el page_view de la vista actual. */
export function grantConsent(): void {
  writeConsent('granted')
  loadGoogleAnalytics()
  sendPageView()
}

/** Rechaza: persiste la decisión, limpia cookies de GA4 y nunca carga GA4. */
export function denyConsent(): void {
  writeConsent('denied')
  clearAnalyticsCookies()
}

/**
 * Borra la decisión para que el aviso vuelva a mostrarse. Deja intactas las
 * demás preferencias (tema incluido) y desactiva la medición en curso hasta la
 * recarga.
 */
export function resetConsent(): void {
  if (MEASUREMENT_ID) {
    // Flag oficial de opt-out de GA4 para el resto de esta sesión.
    const optOut = window as unknown as Record<string, boolean>
    optOut[`ga-disable-${MEASUREMENT_ID}`] = true
  }

  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', { analytics_storage: 'denied' })
  }

  clearAnalyticsCookies()

  removeStorage(CONSENT_KEY)

  window.__gaLastPageViewUrl = undefined
  window.__gaPreviousUrl = undefined
}

function handlePageLoad(): void {
  if (!isAnalyticsEnabled()) return
  if (readConsent() !== 'granted') return

  loadGoogleAnalytics()
  sendPageView()
}

// Registro único, en el nivel superior del módulo. Los scripts procesados por
// Astro no se re-ejecutan tras un swap de ClientRouter; el flag en `window` es
// una segunda barrera contra listeners apilados.
if (!window.__gaPageLoadBound) {
  window.__gaPageLoadBound = true
  document.addEventListener('astro:page-load', handlePageLoad)
}
