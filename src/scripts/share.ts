/**
 * Acciones para compartir un artículo del blog.
 *
 * Reglas invariantes de este módulo:
 * - Un único listener delegado en `document`, registrado en el nivel superior
 *   del módulo. Como ClientRouter nunca recarga el documento ni re-ejecuta los
 *   scripts ya evaluados, el flag en `window` es la segunda barrera contra
 *   listeners apilados.
 * - Los enlaces sociales nunca se interceptan: funcionan igual sin JavaScript.
 * - El evento de analítica de `copy` solo se envía cuando la copia tuvo éxito.
 * - Ningún timer pendiente puede tocar un nodo que ya salió del documento.
 */

import { trackShareArticle, type ShareNetwork } from './analytics'

declare global {
  interface Window {
    /** El listener delegado de compartir ya está registrado. */
    __shareArticleBound?: boolean
  }
}

const FEEDBACK_TIMEOUT_MS = 2500

const COPY_SUCCESS = 'Enlace copiado'
const COPY_FAILURE = 'No se pudo copiar. Usa Ctrl+C.'

const NETWORKS: readonly ShareNetwork[] = ['linkedin', 'facebook', 'x', 'copy']

/** Nodo y timer del último feedback mostrado; sobreviven a los swaps. */
let feedbackTimer: number | undefined
let feedbackNode: HTMLElement | undefined

function toNetwork(value: string | undefined): ShareNetwork | undefined {
  return NETWORKS.find(network => network === value)
}

function clearFeedbackTimer(): void {
  if (feedbackTimer !== undefined) {
    window.clearTimeout(feedbackTimer)
    feedbackTimer = undefined
  }
}

/** Vacía la región de estado solo si el nodo sigue conectado al documento. */
function resetFeedback(node: HTMLElement | undefined): void {
  if (!node || !node.isConnected) return
  node.textContent = ''
  delete node.dataset.state
}

/**
 * Escribe el mensaje una sola vez en la región `role="status"`. No altera el
 * `aria-label` del botón: el anuncio vive en la región, no en el control.
 */
function showFeedback(root: HTMLElement, message: string, success: boolean): void {
  const node = root.querySelector<HTMLElement>('[data-share-feedback]')
  if (!node) return

  clearFeedbackTimer()
  resetFeedback(feedbackNode)

  feedbackNode = node
  node.dataset.state = success ? 'success' : 'error'
  node.textContent = message

  feedbackTimer = window.setTimeout(() => {
    feedbackTimer = undefined
    resetFeedback(node)
  }, FEEDBACK_TIMEOUT_MS)
}

/**
 * `document.execCommand` está marcado como deprecado en lib.dom, pero sigue
 * siendo el único fallback disponible. Se tipa aquí para usarlo de forma segura
 * sin arrastrar el aviso de deprecación ni recurrir a `any`.
 */
interface LegacyClipboardDocument {
  execCommand?: (commandId: string) => boolean
}

/** Fallback para navegadores sin Clipboard API o sin contexto seguro. */
function copyWithTextarea(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  textarea.style.left = '-9999px'
  textarea.style.opacity = '0'

  document.body.appendChild(textarea)

  let copied = false
  try {
    textarea.select()
    textarea.setSelectionRange(0, text.length)
    const legacyDocument = document as LegacyClipboardDocument
    copied = legacyDocument.execCommand?.('copy') ?? false
  } catch {
    copied = false
  } finally {
    textarea.remove()
  }

  return copied
}

async function copyUrl(url: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url)
      return true
    }
  } catch {
    /* Permiso denegado o contexto inseguro: queda el fallback. */
  }

  return copyWithTextarea(url)
}

async function handleCopy(root: HTMLElement, url: string, slug: string): Promise<void> {
  const copied = await copyUrl(url)

  if (copied) {
    showFeedback(root, COPY_SUCCESS, true)
    trackShareArticle(slug, 'copy')
    return
  }

  // Sin éxito real no se muestra confirmación ni se registra el evento.
  showFeedback(root, COPY_FAILURE, false)
}

function handleClick(event: MouseEvent): void {
  const target = event.target
  if (!(target instanceof Element)) return

  const control = target.closest<HTMLElement>('[data-share]')
  if (!control) return

  const network = toNetwork(control.dataset.shareNetwork)
  const slug = control.dataset.shareSlug
  const url = control.dataset.shareUrl
  if (!network || !slug || !url) return

  if (network === 'copy') {
    const root = control.closest<HTMLElement>('[data-share-root]')
    if (!root) return
    void handleCopy(root, url, slug)
    return
  }

  // Enlaces sociales: sin preventDefault, el navegador abre la pestaña.
  trackShareArticle(slug, network)
}

if (!window.__shareArticleBound) {
  window.__shareArticleBound = true

  document.addEventListener('click', handleClick)

  // El feedback nunca debe arrastrarse al artículo siguiente.
  document.addEventListener('astro:before-swap', () => {
    clearFeedbackTimer()
    feedbackNode = undefined
  })
}
