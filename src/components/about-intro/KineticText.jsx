import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DecryptText from '../DecryptText'
import { TIMELINE, ROLES } from './timeline'

/**
 * Typewriter text with per-letter animation and bass jitter
 */
function TypewriterLetters({ text, audioDataRef }) {
  const letters = useMemo(() => text.split(''), [text])
  const [bassVal, setBassVal] = useState(0)

  useEffect(() => {
    let frameId
    const checkBass = () => {
      const b = audioDataRef?.current?.bass || 0
      setBassVal(b)
      frameId = requestAnimationFrame(checkBass)
    }
    frameId = requestAnimationFrame(checkBass)
    return () => cancelAnimationFrame(frameId)
  }, [audioDataRef])

  return (
    <span className="inline-block text-2xl sm:text-4xl md:text-5xl font-mono text-zinc-300 font-medium">
      {letters.map((char, i) => {
        const jitter = (Math.sin(i * 3 + Date.now() * 0.01) * (1 + bassVal * 2.5)).toFixed(1)
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{
              opacity: 1,
              y: parseFloat(jitter),
            }}
            transition={{
              duration: 0.08,
              delay: i * 0.038,
            }}
            className="inline-block"
            style={{ willChange: 'transform, opacity' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        )
      })}
    </span>
  )
}

/**
 * KineticText - Accessible DOM kinetic typography layer.
 * Driven strictly by segment state changes so React only renders on timeline steps.
 */
export default function KineticText({
  segment = 'idle',
  audioTime = 0,
  audioDataRef,
  shouldReduceMotion = false,
}) {
  // Words for "you found my file."
  const fileWords = useMemo(
    () => [
      { text: 'you', isViolet: false },
      { text: 'found', isViolet: false },
      { text: 'my', isViolet: false },
      { text: 'file.', isViolet: true },
    ],
    []
  )

  // Countdown computation (03 -> 02 -> 01)
  const countdownNumber = useMemo(() => {
    if (audioTime >= 5.8) return '01'
    if (audioTime >= 5.4) return '02'
    if (audioTime >= 5.0) return '03'
    return '03'
  }, [audioTime])

  // Current role computation
  const currentRole = useMemo(() => {
    if (segment === 'role_1') return ROLES[0]
    if (segment === 'role_2') return ROLES[1]
    if (segment === 'role_3') return ROLES[2]
    return null
  }, [segment])

  // Reduced motion fallback
  if (shouldReduceMotion) {
    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center select-none">
        <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight">
          I&apos;M DEVANSH.
        </h1>
        <div className="mt-4 flex flex-col items-center gap-2 text-zinc-400 font-mono text-sm tracking-widest uppercase">
          <span>{ROLES[0]}</span>
          <span>{ROLES[1]}</span>
          <span>{ROLES[2]}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      aria-live="polite"
      className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {/* SEGMENT 1: "hey." (0.6 - 1.8s) */}
        {segment === 'hey' && (
          <motion.div
            key="hey"
            initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{
              opacity: 0,
              y: -16,
              filter: 'blur(8px)',
              transition: { duration: 0.28 },
            }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl sm:text-8xl md:text-9xl font-semibold text-white tracking-tight"
          >
            hey.
          </motion.div>
        )}

        {/* SEGMENT 2: "you found my file." (1.9 - 3.3s) */}
        {segment === 'file' && (
          <motion.div
            key="file"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.25 } }}
            className="flex items-center gap-2.5 sm:gap-4 flex-wrap justify-center px-4 text-3xl sm:text-6xl font-semibold tracking-tight"
          >
            {fileWords.map((item, idx) => (
              <motion.span
                key={item.text}
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.32,
                  delay: idx * TIMELINE.FILE_STAGGER,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={item.isViolet ? 'text-[#a78bfa] font-bold drop-shadow-[0_0_18px_rgba(167,139,250,0.5)]' : 'text-white'}
              >
                {item.text}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* SEGMENT 3: "let me introduce myself..." (3.4 - 4.9s) */}
        {segment === 'introduce' && (
          <motion.div
            key="introduce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.25 } }}
            className="text-center px-4"
          >
            <TypewriterLetters
              text="let me introduce myself..."
              audioDataRef={audioDataRef}
            />
          </motion.div>
        )}

        {/* SEGMENT 4: Countdown "03 → 02 → 01" (5.0 - 6.2s) */}
        {segment === 'countdown' && (
          <motion.div
            key="countdown-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={countdownNumber}
                initial={{ scale: 1.4, opacity: 0 }}
                animate={{ scale: 1.0, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0, transition: { duration: 0.1 } }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="text-7xl sm:text-9xl md:text-[12rem] font-mono font-black text-white tracking-widest drop-shadow-[0_0_30px_rgba(167,139,250,0.4)]"
              >
                {countdownNumber}
              </motion.div>
            </AnimatePresence>
            <span className="text-[11px] font-mono tracking-[0.35em] text-zinc-500 uppercase mt-2">
              INITIATING SEQUENCE
            </span>
          </motion.div>
        )}

        {/* SEGMENT 5: "I'M DEVANSH." Headline Slam + RGB Glitch (6.5 - 7.4s) */}
        {segment === 'drop_name' && (
          <motion.div
            key="drop_name"
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 22,
            }}
            className="relative flex items-center justify-center text-center px-4"
          >
            {/* Violet RGB-split glitch copy (offset -6px) */}
            <span
              aria-hidden="true"
              className="absolute text-[11vw] font-black text-[#a78bfa] tracking-tight leading-none mix-blend-screen pointer-events-none select-none translate-x-[-6px] translate-y-[-2px] opacity-80"
            >
              I&apos;M DEVANSH.
            </span>

            {/* Amber RGB-split glitch copy (offset +6px) */}
            <span
              aria-hidden="true"
              className="absolute text-[11vw] font-black text-[#f59e0b] tracking-tight leading-none mix-blend-screen pointer-events-none select-none translate-x-[6px] translate-y-[2px] opacity-80"
            >
              I&apos;M DEVANSH.
            </span>

            {/* Main white text */}
            <h1 className="relative z-10 text-[11vw] font-black text-white tracking-tight leading-none">
              I&apos;M DEVANSH.
            </h1>
          </motion.div>
        )}

        {/* SEGMENT 6: Role words flash in under the name (7.5 - 9.6s) */}
        {currentRole && (
          <motion.div
            key="roles-container"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
            className="absolute top-[60%] flex flex-col items-center justify-center gap-1.5"
          >
            <div className="text-sm sm:text-lg md:text-xl font-mono uppercase tracking-[0.35em] text-zinc-100 font-bold px-4 py-1">
              <DecryptText
                key={currentRole}
                text={currentRole}
                trigger={true}
                speed={25}
                className="text-white"
              />
            </div>

            {/* Underline drawn from left to right */}
            <motion.div
              key={`underline-${currentRole}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="h-[2px] w-36 sm:w-48 bg-gradient-to-r from-violet-400 to-amber-400 origin-left rounded-full shadow-[0_0_12px_rgba(167,139,250,0.6)]"
            />
          </motion.div>
        )}

        {/* SEGMENT 7: Portrait label (9.6 - 11.0s) */}
        {segment === 'portrait' && (
          <motion.div
            key="portrait-label"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.45 }}
            className="absolute bottom-16 sm:bottom-20 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 border border-white/15 backdrop-blur-md shadow-2xl"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.3em] text-zinc-300 uppercase">
              SUBJECT IDENTIFIED · CASE-000
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
