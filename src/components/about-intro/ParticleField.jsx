import { useEffect, useRef } from 'react'

const MAX_PARTICLES = 2500

/**
 * ParticleField - High-performance 2D Canvas Particle Engine
 * Driven strictly via Float32Arrays and requestAnimationFrame.
 * Reacts to bass, energy, and kicks. Supports idle, vortex, implode, text, portrait, and grid modes.
 */
export default function ParticleField({
  mode = 'idle',
  audioDataRef,
  currentTime = 0,
}) {
  const canvasRef = useRef(null)
  const modeRef = useRef(mode)
  const timeRef = useRef(currentTime)

  // Keep refs in sync for the rAF loop
  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    timeRef.current = currentTime
  }, [currentTime])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let animationFrameId
    let isRunning = true
    let width = window.innerWidth
    let height = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let resizeTimer = null
    let lastTime = performance.now()

    // Typed arrays for 60fps zero-allocation particle simulation
    const posX = new Float32Array(MAX_PARTICLES)
    const posY = new Float32Array(MAX_PARTICLES)
    const vx = new Float32Array(MAX_PARTICLES)
    const vy = new Float32Array(MAX_PARTICLES)
    const targetX = new Float32Array(MAX_PARTICLES)
    const targetY = new Float32Array(MAX_PARTICLES)
    const baseSize = new Float32Array(MAX_PARTICLES)
    const colorType = new Uint8Array(MAX_PARTICLES) // 0: White, 1: Violet, 2: Amber
    const noiseSeed = new Float32Array(MAX_PARTICLES)

    // Vortex parameters
    const vortexRadius = new Float32Array(MAX_PARTICLES)
    const vortexAngle = new Float32Array(MAX_PARTICLES)
    const vortexSpeedMultiplier = new Float32Array(MAX_PARTICLES)

    // Precomputed text targets
    const textTargetX = new Float32Array(MAX_PARTICLES)
    const textTargetY = new Float32Array(MAX_PARTICLES)

    // Precomputed portrait targets
    const portraitTargetX = new Float32Array(MAX_PARTICLES)
    const portraitTargetY = new Float32Array(MAX_PARTICLES)
    const portraitDotSize = new Float32Array(MAX_PARTICLES)

    // Grid snap coordinates
    const gridTargetX = new Float32Array(MAX_PARTICLES)
    const gridTargetY = new Float32Array(MAX_PARTICLES)
    let gridInitialized = false

    let violetGlowTimer = 0
    let lastKickHandled = false

    // Initialize particles initially across canvas
    for (let i = 0; i < MAX_PARTICLES; i++) {
      posX[i] = Math.random() * width
      posY[i] = Math.random() * height
      targetX[i] = posX[i]
      targetY[i] = posY[i]
      vx[i] = (Math.random() - 0.5) * 0.8
      vy[i] = (Math.random() - 0.5) * 0.8
      baseSize[i] = 1.0 + Math.random() * 1.1 // 1 - 2.1px
      noiseSeed[i] = Math.random() * 100

      // Color distribution: ~88% white, ~8% violet, ~4% amber
      const r = Math.random()
      if (r < 0.08) {
        colorType[i] = 1 // Violet
      } else if (r < 0.12) {
        colorType[i] = 2 // Amber
      } else {
        colorType[i] = 0 // White
      }

      // Vortex distribution
      vortexRadius[i] = 20 + Math.pow(Math.random(), 0.65) * (Math.max(width, height) * 0.6)
      vortexAngle[i] = Math.random() * Math.PI * 2
      vortexSpeedMultiplier[i] = 0.7 + Math.random() * 0.6
    }

    /**
     * Precompute text targets ("DEVANSH") using offscreen canvas
     */
    function precomputeText(w, h) {
      const isMobile = w < 768
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const octx = off.getContext('2d', { willReadFrequently: true })
      if (!octx) return

      // Target text width ~80vw
      const targetTextWidth = isMobile ? w * 0.88 : w * 0.78
      let fontSize = isMobile ? Math.min(w * 0.22, 120) : Math.min(w * 0.16, 210)
      octx.font = `900 ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`
      const measured = octx.measureText('DEVANSH').width
      if (measured > 0) {
        fontSize = Math.floor(fontSize * (targetTextWidth / measured))
      }

      octx.font = `900 ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      octx.fillStyle = '#ffffff'
      octx.fillText('DEVANSH', w / 2, h / 2)

      const imgData = octx.getImageData(0, 0, w, h).data
      const step = isMobile ? 6 : 5
      const points = []

      for (let py = 0; py < h; py += step) {
        for (let px = 0; px < w; px += step) {
          const idx = (py * w + px) * 4
          if (imgData[idx + 3] > 128) {
            points.push({ x: px, y: py })
          }
        }
      }

      // Shuffle points so particle assignment looks uniform and fluid
      for (let i = points.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = points[i]
        points[i] = points[j]
        points[j] = temp
      }

      const textCount = points.length
      for (let i = 0; i < MAX_PARTICLES; i++) {
        if (i < textCount) {
          textTargetX[i] = points[i].x
          textTargetY[i] = points[i].y
        } else {
          // Extra particles float softly around the word as dust
          const dustAngle = Math.random() * Math.PI * 2
          const dustDist = targetTextWidth * 0.45 + Math.random() * 90
          textTargetX[i] = w / 2 + Math.cos(dustAngle) * dustDist
          textTargetY[i] = h / 2 + Math.sin(dustAngle) * (fontSize * 0.65 + Math.random() * 60)
        }
      }
    }

    /**
     * Precompute dot-matrix portrait targets from /intro/me.jpg
     */
    function precomputePortrait(w, h) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = '/intro/me.jpg'
      img.onload = () => {
        const isMobile = w < 768
        const maxH = isMobile ? h * 0.52 : h * 0.62
        const aspect = img.naturalWidth / img.naturalHeight || 1
        const pH = maxH
        const pW = pH * aspect
        const pX = (w - pW) / 2
        const pY = (h - pH) / 2

        const off = document.createElement('canvas')
        off.width = Math.floor(pW)
        off.height = Math.floor(pH)
        const octx = off.getContext('2d', { willReadFrequently: true })
        if (!octx) return

        octx.drawImage(img, 0, 0, off.width, off.height)
        const imgData = octx.getImageData(0, 0, off.width, off.height).data
        const step = isMobile ? 5 : 4
        const points = []

        for (let y = 0; y < off.height; y += step) {
          for (let x = 0; x < off.width; x += step) {
            const idx = (y * off.width + x) * 4
            const r = imgData[idx]
            const g = imgData[idx + 1]
            const b = imgData[idx + 2]
            const alpha = imgData[idx + 3]
            if (alpha < 50) continue

            // Perceptual brightness
            const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255
            // Bright pixels get dots; dark pixels get none (threshold ~0.15)
            if (brightness > 0.15) {
              const dotSize = 1.0 + brightness * 2.3
              points.push({
                x: pX + x,
                y: pY + y,
                size: dotSize,
                brightness,
              })
            }
          }
        }

        // Shuffle portrait points
        for (let i = points.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          const temp = points[i]
          points[i] = points[j]
          points[j] = temp
        }

        const pointCount = points.length
        for (let i = 0; i < MAX_PARTICLES; i++) {
          if (i < pointCount) {
            portraitTargetX[i] = points[i].x
            portraitTargetY[i] = points[i].y
            portraitDotSize[i] = points[i].size
          } else {
            // Ambient dust particles around portrait
            const angle = Math.random() * Math.PI * 2
            const dist = Math.max(pW, pH) * 0.55 + Math.random() * 80
            portraitTargetX[i] = w / 2 + Math.cos(angle) * dist
            portraitTargetY[i] = h / 2 + Math.sin(angle) * dist
            portraitDotSize[i] = 1.0
          }
        }
      }
    }

    /**
     * Resize canvas and recalculate sizes & precomputed targets
     */
    function handleResize() {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Recompute targets
      precomputeText(width, height)
      precomputePortrait(width, height)

      // Vortex radius adjust
      for (let i = 0; i < MAX_PARTICLES; i++) {
        vortexRadius[i] = 20 + Math.pow(Math.random(), 0.65) * (Math.max(width, height) * 0.6)
      }

      gridInitialized = false
    }

    handleResize()

    const onResizeDebounced = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(handleResize, 150)
    }
    window.addEventListener('resize', onResizeDebounced)

    /**
     * MAIN 60FPS SIMULATION & RENDER LOOP
     */
    function render() {
      if (!isRunning) return

      const now = performance.now()
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      const currentMode = modeRef.current
      const t = timeRef.current
      const audioData = audioDataRef?.current || { bass: 0, energy: 0, kick: false }
      const bass = audioData.bass || 0
      const energy = audioData.energy || 0
      const kick = audioData.kick || false

      const isMobile = width < 768
      const isIdle = currentMode === 'idle'
      // 2500 desktop, 1000 mobile. In idle gate mode: ~1200 desktop, ~600 mobile
      const activeCount = isIdle
        ? isMobile ? 600 : 1200
        : isMobile ? 1000 : 2500

      const cx = width / 2
      const cy = height / 2

      // Kick reaction shockwave
      if (kick && !lastKickHandled) {
        violetGlowTimer = 0.22 // 220ms violet brightening
        for (let i = 0; i < activeCount; i++) {
          const kdx = posX[i] - cx
          const kdy = posY[i] - cy
          const dist = Math.hypot(kdx, kdy) || 1
          const push = 6 + (noiseSeed[i] % 8) // 6-14px outward push
          posX[i] += (kdx / dist) * push
          posY[i] += (kdy / dist) * push
        }
        lastKickHandled = true
      } else if (!kick) {
        lastKickHandled = false
      }

      if (violetGlowTimer > 0) {
        violetGlowTimer -= dt
      }

      // MODE SPECIFIC TARGET UPDATES
      switch (currentMode) {
        case 'idle': {
          // Slow random drift across the screen
          for (let i = 0; i < activeCount; i++) {
            targetX[i] += Math.cos(noiseSeed[i] + now * 0.001) * 0.8
            targetY[i] += Math.sin(noiseSeed[i] * 1.2 + now * 0.001) * 0.8

            // Wrap gently
            if (targetX[i] < -20) targetX[i] = width + 20
            if (targetX[i] > width + 20) targetX[i] = -20
            if (targetY[i] < -20) targetY[i] = height + 20
            if (targetY[i] > height + 20) targetY[i] = -20
          }
          break
        }

        case 'vortex': {
          // Spiral orbit around center with accelerating angular speed + bass reaction
          let baseSpeed = 1.0 + (t / 5.0) * 1.8
          if (t >= 5.0) {
            // 5.0 - 6.2s: tension accelerates dramatically
            const tensionProgress = Math.min(1, (t - 5.0) / 1.2)
            baseSpeed = 2.8 + tensionProgress * 6.5
          }
          const speed = baseSpeed + bass * 3.5

          for (let i = 0; i < activeCount; i++) {
            vortexAngle[i] += speed * dt * vortexSpeedMultiplier[i]
            targetX[i] = cx + Math.cos(vortexAngle[i]) * vortexRadius[i]
            targetY[i] = cy + Math.sin(vortexAngle[i]) * vortexRadius[i]
          }
          break
        }

        case 'implode': {
          // All targets rush to exact center (tight ball, radius ~20px)
          for (let i = 0; i < activeCount; i++) {
            const rad = Math.random() * 20
            const a = noiseSeed[i] * 12 + now * 0.004
            targetX[i] = cx + Math.cos(a) * rad
            targetY[i] = cy + Math.sin(a) * rad
          }
          break
        }

        case 'text': {
          // Particles snap to precomputed "DEVANSH" positions
          for (let i = 0; i < activeCount; i++) {
            targetX[i] = textTargetX[i]
            targetY[i] = textTargetY[i]
          }
          break
        }

        case 'portrait': {
          // Particles flow into halftone portrait positions
          for (let i = 0; i < activeCount; i++) {
            targetX[i] = portraitTargetX[i]
            targetY[i] = portraitTargetY[i]
          }
          break
        }

        case 'grid': {
          // Snap to 24px grid covering the screen
          if (!gridInitialized) {
            for (let i = 0; i < activeCount; i++) {
              gridTargetX[i] = Math.round(posX[i] / 24) * 24
              gridTargetY[i] = Math.round(posY[i] / 24) * 24
            }
            gridInitialized = true
          }
          for (let i = 0; i < activeCount; i++) {
            targetX[i] = gridTargetX[i]
            targetY[i] = gridTargetY[i]
          }
          break
        }

        default:
          break
      }

      // PHYSICS SIMULATION (Spring toward target + wobble)
      // Stiffness ~0.06, damping ~0.86
      const stiffness = currentMode === 'implode' ? 0.09 : 0.06
      const damping = currentMode === 'implode' ? 0.82 : 0.86
      const wobbleFactor = 1 + energy * 2.0

      for (let i = 0; i < activeCount; i++) {
        const dx = targetX[i] - posX[i]
        const dy = targetY[i] - posY[i]

        vx[i] = (vx[i] + dx * stiffness) * damping
        vy[i] = (vy[i] + dy * stiffness) * damping

        const wobbleX = Math.sin(now * 0.004 + noiseSeed[i]) * 0.45 * wobbleFactor
        const wobbleY = Math.cos(now * 0.004 + noiseSeed[i] * 1.3) * 0.45 * wobbleFactor

        posX[i] += vx[i] + wobbleX
        posY[i] += vy[i] + wobbleY
      }

      // CANVAS BACKGROUND & TRAIL DRAWING
      if (currentMode === 'grid') {
        // Grid mode: canvas background fades from black to white over 1.2s (11.0s to 12.2s)
        const fadeT = Math.max(0, Math.min(1, (t - 11.0) / 1.2))
        const bgVal = Math.round(fadeT * 255)
        const alpha = 0.25 + fadeT * 0.65
        ctx.fillStyle = `rgba(${bgVal}, ${bgVal}, ${bgVal}, ${alpha})`
        ctx.fillRect(0, 0, width, height)
      } else {
        // Standard light trail effect: fill with rgba(0,0,0,0.25)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
        ctx.fillRect(0, 0, width, height)
      }

      // PARTICLE RENDERING BATCHED BY COLOR (No per-particle fillStyle changes)
      const sizeMultiplier = 1 + bass * 1.2
      const isGrid = currentMode === 'grid'
      const gridFadeT = isGrid ? Math.max(0, Math.min(1, (t - 11.0) / 1.2)) : 0

      // Compute batched colors for the current frame
      let whiteFill = 'rgba(255, 255, 255, 0.95)'
      let violetFill = violetGlowTimer > 0 ? '#ddd6fe' : 'rgba(167, 139, 250, 0.95)'
      let amberFill = 'rgba(245, 158, 11, 0.95)'

      if (isGrid && gridFadeT > 0) {
        // Particles transition from white/accents to site's dot-grid color #e5e7eb (229, 231, 235)
        const r = Math.round(255 + (229 - 255) * gridFadeT)
        const g = Math.round(255 + (231 - 255) * gridFadeT)
        const b = Math.round(255 + (235 - 255) * gridFadeT)
        whiteFill = `rgba(${r}, ${g}, ${b}, ${0.9 - gridFadeT * 0.4})`
        violetFill = `rgba(${r}, ${g}, ${b}, ${0.9 - gridFadeT * 0.4})`
        amberFill = `rgba(${r}, ${g}, ${b}, ${0.9 - gridFadeT * 0.4})`
      }

      const isPortrait = currentMode === 'portrait'

      // Pass 1: White particles (~88%)
      ctx.fillStyle = whiteFill
      for (let i = 0; i < activeCount; i++) {
        if (colorType[i] === 0) {
          const s = (isPortrait ? portraitDotSize[i] || 1.2 : baseSize[i]) * sizeMultiplier
          ctx.fillRect(posX[i] - s * 0.5, posY[i] - s * 0.5, s, s)
        }
      }

      // Pass 2: Violet particles (~8%)
      ctx.fillStyle = violetFill
      for (let i = 0; i < activeCount; i++) {
        if (colorType[i] === 1) {
          const s = (isPortrait ? portraitDotSize[i] || 1.2 : baseSize[i]) * sizeMultiplier * (violetGlowTimer > 0 ? 1.4 : 1.1)
          ctx.fillRect(posX[i] - s * 0.5, posY[i] - s * 0.5, s, s)
        }
      }

      // Pass 3: Amber particles (~4%)
      ctx.fillStyle = amberFill
      for (let i = 0; i < activeCount; i++) {
        if (colorType[i] === 2) {
          const s = (isPortrait ? portraitDotSize[i] || 1.2 : baseSize[i]) * sizeMultiplier * 1.05
          ctx.fillRect(posX[i] - s * 0.5, posY[i] - s * 0.5, s, s)
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      isRunning = false
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', onResizeDebounced)
      clearTimeout(resizeTimer)
    }
  }, [audioDataRef])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  )
}
