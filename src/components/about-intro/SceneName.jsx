import { useState } from 'react'
import { motion, useTransform, useMotionValueEvent } from 'framer-motion'
import DecryptText from '../DecryptText'
import ParticleCanvas from './ParticleCanvas'

export default function SceneName({ p, shouldReduceMotion }) {
  const [triggered, setTriggered] = useState(false)

  // Flip boolean state ONE time when progress crosses 0.14
  useMotionValueEvent(p, 'change', (v) => {
    if (v >= 0.14 && !triggered) {
      setTriggered(true)
    }
  })

  // 0.14→0.20: scale from 0.85 → 1 and fades in
  const scale = useTransform(p, [0.12, 0.14, 0.2], [0.85, 0.85, 1])

  // Fade in 0.14→0.20, hold, then fade out 0.28→0.31 for dot dissolve
  const textOpacity = useTransform(
    p,
    [0.12, 0.14, 0.2, 0.28, 0.31],
    [0, 0, 1, 1, 0]
  )

  // 0.20→0.30: subtle RGB-split glitch
  const glitchRedX = useTransform(p, [0.2, 0.25, 0.3], [0, -6, 0])
  const glitchCyanX = useTransform(p, [0.2, 0.25, 0.3], [0, 6, 0])
  const glitchOpacity = useTransform(p, [0.2, 0.24, 0.26, 0.3], [0, 0.6, 0.6, 0])

  const pointerEvents = useTransform(p, (v) => (v >= 0.12 && v <= 0.38 ? 'auto' : 'none'))

  return (
    <>
      {/* Particle Canvas layer covering the stage */}
      <ParticleCanvas p={p} shouldReduceMotion={shouldReduceMotion} />

      {/* DOM Text layer */}
      <motion.div
        style={{
          opacity: textOpacity,
          scale,
          pointerEvents,
        }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 select-none will-change-[transform,opacity]"
      >
        {/* Line 1: Hey, I'm */}
        <p className="text-3xl sm:text-5xl text-zinc-400 font-medium tracking-tight mb-2 sm:mb-4">
          Hey, I&apos;m
        </p>

        {/* Line 2: DEVANSH. with RGB-split glitch layers */}
        <div className="relative inline-block">
          {/* Cyan glitch copy */}
          <motion.span
            aria-hidden="true"
            style={{
              x: glitchCyanX,
              opacity: glitchOpacity,
            }}
            className="absolute inset-0 text-[22vw] sm:text-[18vw] md:text-[14vw] font-black text-[#22d3ee] tracking-tighter leading-none select-none pointer-events-none mix-blend-screen !font-sans"
          >
            DEVANSH.
          </motion.span>

          {/* Red/Pink glitch copy */}
          <motion.span
            aria-hidden="true"
            style={{
              x: glitchRedX,
              opacity: glitchOpacity,
            }}
            className="absolute inset-0 text-[22vw] sm:text-[18vw] md:text-[14vw] font-black text-[#ff375f] tracking-tighter leading-none select-none pointer-events-none mix-blend-screen !font-sans"
          >
            DEVANSH.
          </motion.span>

          {/* Main White Text with Decrypt scramble */}
          <h1 className="relative z-10 text-[22vw] sm:text-[18vw] md:text-[14vw] font-black text-white tracking-tighter leading-none !font-sans">
            {shouldReduceMotion ? (
              'DEVANSH.'
            ) : (
              <DecryptText
                text="DEVANSH."
                trigger={triggered}
                className="!font-sans font-black tracking-tighter text-white"
              />
            )}
          </h1>
        </div>
      </motion.div>
    </>
  )
}
