import { useEffect, useRef } from 'react'

const DOT_SPACING = 24
const DOT_RADIUS = 1
const DOT_COLOR = '#e5e7eb'
const BG_COLOR = '#ffffff'
const MAGNETIC_RADIUS = 120
const REPULSION_STRENGTH = 0.55
const SPRING_EASE = 0.1

export default function InteractiveDotGrid() {
  const canvasRef = useRef(null)
  const dotsRef = useRef([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animFrameRef = useRef(null)
  const scrollRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    let pageW = 0
    let pageH = 0

    function createDots() {
      const dots = []
      const cols = Math.ceil(pageW / DOT_SPACING) + 1
      const rows = Math.ceil(pageH / DOT_SPACING) + 1

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const bx = col * DOT_SPACING
          const by = row * DOT_SPACING
          dots.push({ baseX: bx, baseY: by, x: bx, y: by })
        }
      }
      dotsRef.current = dots
    }

    function resize() {
      pageW = window.innerWidth
      pageH = document.documentElement.scrollHeight
      canvas.width = pageW * dpr
      canvas.height = pageH * dpr
      canvas.style.width = pageW + 'px'
      canvas.style.height = pageH + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      createDots()
    }

    function animate() {
      ctx.clearRect(0, 0, pageW, pageH)

      const scrollY = scrollRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y + scrollY // convert to page-space

      const dots = dotsRef.current
      let hasMoving = false

      // Viewport culling — only process/draw dots near the visible area
      const viewTop = scrollY - MAGNETIC_RADIUS
      const viewBottom = scrollY + window.innerHeight + MAGNETIC_RADIUS

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i]

        // Skip dots far outside viewport
        if (dot.baseY < viewTop - 50 || dot.baseY > viewBottom + 50) {
          // Reset off-screen dots to base
          dot.x = dot.baseX
          dot.y = dot.baseY
          continue
        }

        const dx = dot.baseX - mx
        const dy = dot.baseY - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < MAGNETIC_RADIUS && dist > 0) {
          // Repel away from cursor
          const force = (MAGNETIC_RADIUS - dist) / MAGNETIC_RADIUS
          const angle = Math.atan2(dy, dx)
          const targetX = dot.baseX + Math.cos(angle) * force * MAGNETIC_RADIUS * REPULSION_STRENGTH
          const targetY = dot.baseY + Math.sin(angle) * force * MAGNETIC_RADIUS * REPULSION_STRENGTH

          dot.x += (targetX - dot.x) * 0.25
          dot.y += (targetY - dot.y) * 0.25
          hasMoving = true
        } else {
          // Spring back
          dot.x += (dot.baseX - dot.x) * SPRING_EASE
          dot.y += (dot.baseY - dot.y) * SPRING_EASE

          // Snap to base when close enough
          if (Math.abs(dot.x - dot.baseX) < 0.1 && Math.abs(dot.y - dot.baseY) < 0.1) {
            dot.x = dot.baseX
            dot.y = dot.baseY
          } else {
            hasMoving = true
          }
        }
      }

      // Only draw when something is actually displaced
      if (hasMoving || mx > -1000) {
        // Draw a white circle to erase the static CSS dots under the cursor
        ctx.beginPath()
        ctx.arc(mx, my, MAGNETIC_RADIUS + 10, 0, Math.PI * 2)
        ctx.fillStyle = BG_COLOR
        ctx.fill()

        // Draw displaced dots within and around the erased area
        for (let i = 0; i < dots.length; i++) {
          const dot = dots[i]
          if (dot.baseY < viewTop - 50 || dot.baseY > viewBottom + 50) continue

          const distFromMouse = Math.sqrt(
            (dot.baseX - mx) ** 2 + (dot.baseY - my) ** 2
          )

          // Only draw dots that are within the erased region (the canvas handles them now)
          if (distFromMouse < MAGNETIC_RADIUS + 30) {
            ctx.beginPath()
            ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2)
            ctx.fillStyle = DOT_COLOR
            ctx.fill()
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    function onMouseMove(e) {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    function onMouseLeave() {
      mouseRef.current.x = -9999
      mouseRef.current.y = -9999
    }

    function onScroll() {
      scrollRef.current = window.scrollY
    }

    resize()
    scrollRef.current = window.scrollY
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mouseleave', onMouseLeave)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
