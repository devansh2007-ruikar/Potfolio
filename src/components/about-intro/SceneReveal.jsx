import { motion, useTransform } from 'framer-motion'

export default function SceneReveal({ p, shouldReduceMotion }) {
  // 0.80→0.86: dark card appears in center
  const cardScale = useTransform(p, [0.8, 0.86], [0.6, 1])
  const cardOpacity = useTransform(p, [0.8, 0.84, 0.86, 0.88], [0, 1, 1, 0])

  // 0.86→0.97: expanding layer opens to fill screen
  const expandProgress = useTransform(p, [0.86, 0.97], [0, 1])
  const clipPath = useTransform(expandProgress, (v) => {
    const clampV = Math.max(0, Math.min(1, v))
    const topBottom = 50 - 50 * clampV
    const leftRight = 50 - 50 * clampV
    const offsetH = 100 * (1 - clampV)
    const offsetW = 160 * (1 - clampV)
    const radius = 24 * (1 - clampV)
    return `inset(calc(${topBottom}% - ${offsetH}px) calc(${leftRight}% - ${offsetW}px) round ${radius}px)`
  })

  const expandingLayerOpacity = useTransform(p, [0.859, 0.86], [0, 1])

  // 0.94→1.00: "Now, the full file." text fades in
  const textOpacity = useTransform(p, [0.94, 0.98], [0, 1])
  const textY = useTransform(p, [0.94, 0.98], [24, 0])

  const pointerEvents = useTransform(p, (v) => (v >= 0.8 ? 'auto' : 'none'))

  if (shouldReduceMotion) return null

  return (
    <motion.div
      style={{ pointerEvents }}
      className="absolute inset-0 z-30 flex items-center justify-center select-none"
    >
      {/* 1. Initial 320x200 Preview Card (0.80 -> 0.86) */}
      <motion.div
        style={{
          scale: cardScale,
          opacity: cardOpacity,
        }}
        className="w-[320px] h-[200px] rounded-3xl border border-white/10 bg-black/95 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden will-change-[transform,opacity]"
      >
        {/* Subtle dot-grid pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            CASE-000 // DOSSIER
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
            <span>DECRYPTED</span>
            <span>✓</span>
          </span>
        </div>

        <div className="relative z-10">
          <div className="text-xl font-black text-white tracking-tight">
            DEVANSH RUIKAR
          </div>
          <div className="text-xs font-mono text-zinc-400 mt-0.5">
            Full dossier unlocked
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>CLASSIFIED LEVEL 5</span>
          <span className="text-amber-400">READY</span>
        </div>
      </motion.div>

      {/* 2. Expanding Full-screen Reveal Layer (0.86 -> 0.97) */}
      <motion.div
        style={{
          opacity: expandingLayerOpacity,
          clipPath,
        }}
        className="absolute inset-0 flex flex-col items-center justify-center bg-white shadow-2xl will-change-[clip-path]"
      >
        {/* White dot grid matching the site's default background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: '#ffffff',
            backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Big centered reveal line (0.94 -> 1.00) */}
        <motion.div
          style={{
            opacity: textOpacity,
            y: textY,
          }}
          className="relative z-10 text-center px-6 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-600 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ACCESS GRANTED</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            Now, the full file.
          </h2>

          <div className="mt-6 flex flex-col items-center justify-center gap-1 text-zinc-400">
            <span className="text-xs font-mono tracking-widest uppercase">
              Scroll down to explore
            </span>
            <span className="text-xl animate-bounce">↓</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
