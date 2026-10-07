import { useEffect, useRef } from 'react'

const MAX_POINTS = 50
const MAX_LINE_WIDTH = 4
const FADE_SPEED = 0.92 // multiplier per frame — lower = faster fade

export default function InkCursorTrail() {
  const canvasRef = useRef(null)
  const pointsRef = useRef([])
  const animFrameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    function resize() {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function onMouseMove(e) {
      const points = pointsRef.current
      points.unshift({ x: e.clientX, y: e.clientY, opacity: 1 })
      if (points.length > MAX_POINTS) {
        points.length = MAX_POINTS
      }
    }

    function animate() {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)
      ctx.clearRect(0, 0, w, h)

      const points = pointsRef.current

      if (points.length > 1) {
        // Fade all points each frame
        for (let i = 0; i < points.length; i++) {
          points[i].opacity *= FADE_SPEED
        }

        // Remove fully faded points
        while (points.length > 0 && points[points.length - 1].opacity < 0.01) {
          points.pop()
        }

        // Draw smooth bezier trail with tapering width and fading opacity
        for (let i = 0; i < points.length - 1; i++) {
          const p0 = points[i]
          const p1 = points[i + 1]

          // Midpoints for smooth quadratic bezier curves
          const midX = (p0.x + p1.x) / 2
          const midY = (p0.y + p1.y) / 2

          // Progress along the trail: 0 = tip (newest), 1 = tail (oldest)
          const t = i / points.length

          // Taper the line width from thick to thin
          const lineWidth = MAX_LINE_WIDTH * (1 - t * 0.95)

          // Opacity fades along the trail AND per-point fade
          const segmentOpacity = Math.min(p0.opacity, (1 - t))

          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.quadraticCurveTo(p0.x, p0.y, midX, midY)
          ctx.strokeStyle = `rgba(0, 0, 0, ${segmentOpacity})`
          ctx.lineWidth = lineWidth
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.stroke()
        }
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  )
}
