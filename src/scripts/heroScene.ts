// TSX Signal Core — single Three.js hero scene with full lifecycle management
const SCENE_REVEAL_DELAY_MS = 500

let registered = false
let cleanup: (() => void) | null = null
let initializing = false

async function init(): Promise<void> {
  const mount = document.getElementById('hero-scene-mount')
  if (!mount || cleanup || initializing) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  initializing = true

  const THREE = await import('three')
  if (!mount.isConnected || cleanup) {
    initializing = false
    return
  }

  const isMobile = window.innerWidth < 768
  const primary = new THREE.Color('#D3734E')

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50)
  camera.position.z = 6.4

  const tilt = new THREE.Group()
  const group = new THREE.Group()
  group.scale.setScalar(0.5)
  tilt.add(group)
  scene.add(tilt)

  // Core: dark faceted sculpture + terracotta wireframe shell
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.1, 0),
    new THREE.MeshStandardMaterial({ color: '#232326', flatShading: true, metalness: 0.4, roughness: 0.38 })
  )
  group.add(core)

  const wireMat = new THREE.MeshBasicMaterial({ color: primary, wireframe: true, transparent: true, opacity: 0 })
  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.48, 1), wireMat)
  group.add(wire)

  // Construction rings
  const ringSpecs = [
    { r: 1.95, o: 0.4, rx: Math.PI / 2.2, rz: 0.25, speed: 0.28 },
    { r: 2.35, o: 0.25, rx: Math.PI / 1.7, rz: -0.5, speed: -0.2 },
    { r: 2.75, o: 0.15, rx: Math.PI / 2.8, rz: 0.9, speed: 0.12 },
  ]
  const rings: { mesh: InstanceType<typeof THREE.Group>; speed: number }[] = []
  const ringMats: { mat: { opacity: number }; target: number }[] = []
  const nodeGeo = new THREE.SphereGeometry(0.035, 8, 8)
  const nodeMat = new THREE.MeshBasicMaterial({ color: primary, transparent: true, opacity: 0 })

  ringSpecs.forEach((spec, i) => {
    const holder = new THREE.Group()
    const ringMat = new THREE.MeshBasicMaterial({ color: primary, transparent: true, opacity: 0 })
    ringMat.userData.target = spec.o
    ringMats.push({ mat: ringMat, target: spec.o })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(spec.r, 0.008, 6, 90), ringMat)
    holder.add(ring)
    const nodeCount = isMobile ? 4 : 6 - i
    for (let n = 0; n < nodeCount; n++) {
      const a = (n / nodeCount) * Math.PI * 2
      const node = new THREE.Mesh(nodeGeo, nodeMat)
      node.position.set(Math.cos(a) * spec.r, Math.sin(a) * spec.r, 0)
      holder.add(node)
    }
    holder.rotation.x = spec.rx
    holder.rotation.z = spec.rz
    group.add(holder)
    rings.push({ mesh: holder, speed: spec.speed })
  })

  // Moderate particle field
  const count = isMobile ? 70 : 150
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = 2.7 + Math.random() * 1.9
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  const particleGeo = new THREE.BufferGeometry()
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particleMat = new THREE.PointsMaterial({ color: '#E8A587', size: 0.028, transparent: true, opacity: 0 })
  const particles = new THREE.Points(particleGeo, particleMat)
  group.add(particles)

  // Warm terracotta lighting on dark material
  scene.add(new THREE.AmbientLight(0xffffff, 0.45))
  const keyLight = new THREE.DirectionalLight('#ffd9c2', 2.2)
  keyLight.position.set(3, 2.5, 4)
  scene.add(keyLight)
  const accentLight = new THREE.DirectionalLight('#D3734E', 1.6)
  accentLight.position.set(-3.5, -1.5, 2.5)
  scene.add(accentLight)

  const setSize = () => {
    const w = mount.clientWidth
    const h = mount.clientHeight
    if (w === 0 || h === 0) return
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  renderer.domElement.setAttribute('aria-hidden', 'true')
  renderer.domElement.classList.add('hero-scene__canvas')
  mount.appendChild(renderer.domElement)
  setSize()

  let raf = 0
  let running = false
  let visible = true
  let targetRX = 0
  let targetRY = 0
  let scrollT = 0
  let elapsed = 0
  let revealed = false
  let revealTimer: number | null = null
  const timer = new THREE.Timer()

  const animate = (timestamp: number): void => {
    if (!running) return

    timer.update(timestamp)

    const dt = Math.min(timer.getDelta(), 0.05)
    elapsed += dt

    // Assembly entrance
    const t = Math.min(elapsed / 1.5, 1)
    const ease = 1 - Math.pow(1 - t, 3)

    group.scale.setScalar(0.5 + 0.3 * ease)
    wireMat.opacity = 0.34 * ease
    nodeMat.opacity = 0.85 * ease
    particleMat.opacity = 0.55 * ease

    ringMats.forEach(({ mat, target }) => {
      mat.opacity = target * ease
    })

    // Ambient motion
    group.rotation.y += dt * 0.16

    rings.forEach(({ mesh, speed }) => {
      mesh.rotation.z += dt * speed
    })

    particles.rotation.y -= dt * 0.02

    // Cursor + scroll response
    tilt.rotation.x +=
      (targetRX + scrollT * 0.35 - tilt.rotation.x) * 0.06

    tilt.rotation.y +=
      (targetRY - tilt.rotation.y) * 0.06

    renderer.render(scene, camera)

    raf = requestAnimationFrame(animate)
  }

  const start = (): void => {
    if (!revealed || running) return

    running = true
    timer.reset()
    raf = requestAnimationFrame(animate)
  }

  const stop = (): void => {
    if (!running) return

    running = false
    cancelAnimationFrame(raf)
    raf = 0
  }

  const onPointer = (e: PointerEvent) => {
    targetRY = ((e.clientX / window.innerWidth) * 2 - 1) * 0.28
    targetRX = ((e.clientY / window.innerHeight) * 2 - 1) * 0.18
  }
  if (!isMobile) window.addEventListener('pointermove', onPointer, { passive: true })

  const onScroll = () => {
    scrollT = Math.min(window.scrollY / 700, 1)
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible && !document.hidden) start()
    else stop()
  })
  io.observe(mount)

  const onVisibility = () => {
    if (document.hidden) stop()
    else if (visible) start()
  }
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('resize', setSize)

  revealTimer = window.setTimeout(() => {
    revealTimer = null

    if (!mount.isConnected) return

    revealed = true
    mount.classList.add('hero-scene--ready')

    if (visible && !document.hidden) {
      start()
    }
  }, SCENE_REVEAL_DELAY_MS)

  initializing = false

  cleanup = () => {
    if (revealTimer !== null) {
      window.clearTimeout(revealTimer)
      revealTimer = null
    }
    revealed = false

    stop()
    io.disconnect()
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', setSize)
    document.removeEventListener('visibilitychange', onVisibility)
    scene.traverse((obj) => {
      const mesh = obj as { geometry?: { dispose: () => void }; material?: { dispose: () => void } | { dispose: () => void }[] }
      mesh.geometry?.dispose()
      if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose())
      else mesh.material?.dispose()
    })
    renderer.dispose()
    timer.dispose()
    renderer.domElement.remove()
    mount.classList.remove('hero-scene--ready')
    cleanup = null
  }
}

export function setupHeroScene(): void {
  if (registered) return
  registered = true
  document.addEventListener('astro:page-load', () => {
    void init()
  })
  document.addEventListener('astro:before-swap', () => {
    cleanup?.()
  })
}
