import { useRef, useState, useEffect } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
} from 'framer-motion'
import SceneBoot from './SceneBoot'
import SceneName from './SceneName'
import SceneManifesto from './SceneManifesto'
import SceneStatements from './SceneStatements'
import SceneReveal from './SceneReveal'

export default function AboutIntro({ onIntroActiveChange, onSkip }) {
  const containerRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Core Scroll Tracking & Spring Smoothing
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  })

  // Skip Button Opacity & Visibility
  const skipOpacity = useTransform(p, [0.0, 0.92, 0.95], [1, 1, 0])
  const skipPointerEvents = useTransform(p, (v) => (v < 0.95 ? 'auto' : 'none'))

  // Monitor progress to toggle introActive for parent
  useMotionValueEvent(p, 'change', (v) => {
    if (onIntroActiveChange) {
      if (v < 0.95) {
        onIntroActiveChange(true)
      } else {
        onIntroActiveChange(false)
      }
    }
  })

  // Set active on mount
  useEffect(() => {
    onIntroActiveChange?.(true)
    return () => {
      onIntroActiveChange?.(false)
    }
  }, [onIntroActiveChange])

  const handleSkipClick = () => {
    if (onSkip) {
      onSkip()
      return
    }

    const bentoEl = document.getElementById('about-bento')
    if (bentoEl) {
      bentoEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (containerRef.current) {
      const top = containerRef.current.offsetTop + containerRef.current.offsetHeight
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  // ACCESSIBILITY / REDUCED MOTION STATIC FALLBACK
  if (shouldReduceMotion) {
    return (
      <section className="relative w-full bg-black text-white py-16 px-6 sm:px-12 space-y-16">
        <SceneBoot p={p} shouldReduceMotion={true} />
        <div className="pt-10">
          <SceneName p={p} shouldReduceMotion={true} />
        </div>
        <div className="pt-10">
          <SceneManifesto p={p} shouldReduceMotion={true} />
        </div>
        <div className="pt-10">
          <SceneStatements p={p} shouldReduceMotion={true} />
        </div>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-black"
      style={{ height: isMobile ? '420vh' : '520vh' }}
    >
      {/* ONE STICKY STAGE */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Top Progress Indicator Bar */}
        <motion.div
          style={{
            scaleX: p,
            originX: 0,
            background: 'linear-gradient(90deg, #a78bfa 0%, #f59e0b 100%)',
          }}
          className="absolute top-0 left-0 right-0 h-[2px] z-50 pointer-events-none will-change-transform"
        />

        {/* Scene 1: Boot-up (0.00 - 0.16) */}
        <SceneBoot p={p} shouldReduceMotion={false} />

        {/* Scene 2: Hey, I'm Devansh + Dot Dissolve Canvas (0.12 - 0.38) */}
        <SceneName p={p} shouldReduceMotion={false} />

        {/* Scene 3: Word-by-word Manifesto + Flashlight (0.34 - 0.60) */}
        <SceneManifesto p={p} shouldReduceMotion={false} />

        {/* Scene 4: Three Statements with 3D Flip (0.56 - 0.84) */}
        <SceneStatements p={p} shouldReduceMotion={false} />

        {/* Scene 5: Case-file reveal & transition (0.80 - 1.00) */}
        <SceneReveal p={p} shouldReduceMotion={false} />

        {/* Global Skip Intro Button */}
        <motion.button
          type="button"
          onClick={handleSkipClick}
          aria-label="Skip intro"
          style={{
            opacity: skipOpacity,
            pointerEvents: skipPointerEvents,
          }}
          className="fixed bottom-6 right-6 z-40 px-4 py-2 rounded-full border border-white/15 bg-black/80 backdrop-blur-md text-[11px] font-mono tracking-widest uppercase text-zinc-400 hover:text-white hover:border-white/40 transition-colors cursor-pointer select-none shadow-xl flex items-center gap-1.5"
        >
          <span>SKIP INTRO</span>
          <span>→</span>
        </motion.button>
      </div>
    </section>
  )
}
