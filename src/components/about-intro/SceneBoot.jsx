import { motion, useTransform } from 'framer-motion'
import { useTypewriter } from './useTypewriter'

const BOOT_LINES = [
  '> establishing secure connection...',
  '> accessing file: CASE-000',
  '> subject: [REDACTED]',
  '> clearance: granted',
  '> decrypting identity...',
]

function renderLineContent(text, lineIdx) {
  // Line 2: > subject: [REDACTED]
  if (lineIdx === 2 && text.startsWith('> subject: ')) {
    const prefix = '> subject: '
    const rest = text.slice(prefix.length)
    return (
      <>
        <span>{prefix}</span>
        {rest.length > 0 && (
          <span className="bg-zinc-200 text-transparent px-1 py-0.5 rounded-xs select-none inline-block leading-none">
            {rest}
          </span>
        )}
      </>
    )
  }

  // Line 3: > clearance: granted
  if (lineIdx === 3 && text.startsWith('> clearance: ')) {
    const prefix = '> clearance: '
    const rest = text.slice(prefix.length)
    return (
      <>
        <span>{prefix}</span>
        <span className="text-emerald-400 font-semibold">{rest}</span>
      </>
    )
  }

  return <span>{text}</span>
}

export default function SceneBoot({ p, shouldReduceMotion }) {
  const { displayedLines, currentLineIndex } = useTypewriter(
    BOOT_LINES,
    28,
    250,
    shouldReduceMotion
  )

  // Scroll-linked exit (0.10 → 0.16)
  const opacity = useTransform(p, [0.0, 0.10, 0.16], [1, 1, 0])
  const y = useTransform(p, [0.0, 0.10, 0.16], [0, 0, -40])
  const blurVal = useTransform(p, [0.0, 0.10, 0.16], [0, 0, 8])
  const filter = useTransform(blurVal, (v) => `blur(${v}px)`)
  const pointerEvents = useTransform(p, (v) => (v >= 0.16 ? 'none' : 'auto'))

  return (
    <motion.div
      style={{
        opacity,
        y,
        filter,
        pointerEvents,
      }}
      className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-12 md:p-20 select-none will-change-[transform,opacity,filter]"
    >
      {/* Top subtle badge */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
          SECURE TERMINAL // V1.04
        </span>
      </div>

      {/* Center/Left Terminal output */}
      <div className="w-full max-w-xl mx-auto md:mx-0 md:ml-[10vw] font-mono text-sm sm:text-base text-zinc-400 space-y-2.5">
        {displayedLines.map((line, idx) => (
          <div key={idx} className="flex items-center gap-1 min-h-[1.5rem]">
            {renderLineContent(line, idx)}
            {idx === currentLineIndex && (
              <span className="inline-block text-zinc-200 animate-[pulse_1s_steps(1)_infinite] font-mono">
                █
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Center Scroll Prompt */}
      <div className="flex flex-col items-center justify-center gap-2 pb-6">
        <span className="text-[11px] font-mono tracking-[0.3em] text-zinc-500 uppercase">
          SCROLL TO DECRYPT ↓
        </span>
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-zinc-600/60 flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 rounded-full bg-zinc-400 animate-pulse" />
        </motion.div>
      </div>
    </motion.div>
  )
}
