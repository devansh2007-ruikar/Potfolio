import { useEffect, useRef } from 'react'

function easeOutQuad(x) {
  return 1 - (1 - x) * (1 - x)
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export default function ParticleCanvas({ p, shouldReduceMotion }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (shouldReduceMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let particles = []
    let isVisible = true
    let width = 0
    let height = 0
    let dpr = 1
    let resizeTimer = null
    let wasCleared = false

    function computeParticles() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const isMobile = width < 768
      const fontSize = isMobile ? Math.min(width * 0.2, 110) : Math.min(width * 0.14, 190)

      const off = document.createElement('canvas')
      off.width = width
      off.height = height
      const octx = off.getContext('2d', { willReadFrequently: true })
      if (!octx) return

      octx.font = `900 ${fontSize}px Inter, sans-serif`
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      octx.fillStyle = '#ffffff'
      octx.letterSpacing = '-0.05em'

      const textY = height / 2 + (isMobile ? 24 : 36)
      octx.fillText('DEVANSH.', width / 2, textY)

      const imgData = octx.getImageData(0, 0, width, height).data
      const step = isMobile ? 8 : 6
      const newParticles = []

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4
          const alpha = imgData[idx + 3]
          if (alpha > 128) {
            const angle = Math.random() * Math.PI * 2
            const dist = 30 + Math.random() * 70
            newParticles.push({
              originX: x,
              originY: y,
              driftAngle: angle,
              driftDist: dist,
              noisePhase: Math.random() * 10,
              gridX: Math.round(x / 24) * 24,
              gridY: Math.round(y / 24) * 24,
            })
          }
        }
      }

      particles = newParticles
      wasCleared = false
    }

    computeParticles()

    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(computeParticles, 150)
    }
    window.addEventListener('resize', handleResize)

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    function renderLoop() {
      if (isVisible) {
        const progress = p.get()

        // Only active in range [0.27, 0.42]
        if (progress >= 0.27 && progress <= 0.42 && particles.length > 0) {
          wasCleared = false
          ctx.clearRect(0, 0, width, height)

          // Normalized t from 0 (at 0.28) to 1 (at 0.38)
          const rawT = Math.max(0, Math.min(1, (progress - 0.28) / 0.1))

          // Color calculation: rgba(255,255,255,0.8) -> #e5e7eb at 30% opacity
          const r = Math.round(255 + (229 - 255) * rawT)
          const g = Math.round(255 + (231 - 255) * rawT)
          const b = Math.round(255 + (235 - 255) * rawT)

          let alpha = 0.8 - rawT * 0.5
          if (progress > 0.38) {
            // Fade out completely after 0.38
            alpha = Math.max(0, 0.3 * (1 - (progress - 0.38) / 0.04))
          }

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`

          for (let i = 0; i < particles.length; i++) {
            const pt = particles[i]
            let curX = pt.originX
            let curY = pt.originY

            if (rawT > 0 && rawT < 0.5) {
              // Drift phase
              const driftT = easeOutQuad(rawT / 0.5)
              curX =
                pt.originX +
                Math.cos(pt.driftAngle) * pt.driftDist * driftT +
                Math.sin(driftT * 4 + pt.noisePhase) * 4
              curY =
                pt.originY +
                Math.sin(pt.driftAngle) * pt.driftDist * driftT +
                Math.cos(driftT * 4 + pt.noisePhase) * 4
            } else if (rawT >= 0.5) {
              // Settle phase to 24px grid
              const settleT = easeInOutCubic((rawT - 0.5) / 0.5)
              const midX = pt.originX + Math.cos(pt.driftAngle) * pt.driftDist
              const midY = pt.originY + Math.sin(pt.driftAngle) * pt.driftDist
              curX = midX + (pt.gridX - midX) * settleT
              curY = midY + (pt.gridY - midY) * settleT
            }

            ctx.beginPath()
            ctx.arc(curX, curY, 1.5, 0, Math.PI * 2)
            ctx.fill()
          }
        } else if (!wasCleared) {
          ctx.clearRect(0, 0, width, height)
          wasCleared = true
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop)
    }

    animationFrameId = requestAnimationFrame(renderLoop)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
      observer.disconnect()
    }
  }, [p, shouldReduceMotion])

  if (shouldReduceMotion) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-15"
    />
  )
}
