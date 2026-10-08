import { useRef } from 'react'
import { motion, useTransform } from 'framer-motion'

const MANIFESTO_TEXT =
  "I'm a computer science student who builds things that are fast under the hood and feel great on the surface. I love backend systems, interactive 3D web, and turning messy data into answers — like tracing crypto fraud for Smart India Hackathon."

const words = MANIFESTO_TEXT.split(' ')

function getWordStyle(word) {
  const clean = word.toLowerCase().replace(/[^\w]/g, '')
  const isViolet =
    clean === 'backend' || clean === 'systems' || clean === '3d' || clean === 'web'
  const isAmber =
    clean === 'crypto' ||
    clean === 'fraud' ||
    clean === 'smart' ||
    clean === 'india' ||
    clean === 'hackathon'

  if (isViolet) return { isViolet: true, isAmber: false, colorClass: 'text-[#a78bfa]' }
  if (isAmber) return { isViolet: false, isAmber: true, colorClass: 'text-[#f59e0b]' }
  return { isViolet: false, isAmber: false, colorClass: 'text-white' }
}

function BaseWord({ word, index, total, p, shouldReduceMotion }) {
  const { isViolet, isAmber, colorClass } = getWordStyle(word)
  const start = 0.38 + (index / total) * 0.18
  const end = start + 0.018

  const opacity = useTransform(p, [start, end], [0.15, 1])
  const glowProgress = useTransform(p, [start, end], [0, 1])
  const textShadow = useTransform(glowProgress, (v) => {
    if (v <= 0.1) return 'none'
    if (isViolet) return `0 0 22px rgba(167, 139, 250, ${0.65 * v})`
    if (isAmber) return `0 0 22px rgba(245, 158, 11, ${0.65 * v})`
    return 'none'
  })

  const marginClass = index === total - 1 ? 'mr-0' : 'mr-[0.25em]'

  if (shouldReduceMotion) {
    return (
      <span
        className={`inline-block ${marginClass} ${colorClass}`}
        style={
          isViolet
            ? { textShadow: '0 0 20px rgba(167, 139, 250, 0.6)' }
            : isAmber
            ? { textShadow: '0 0 20px rgba(245, 158, 11, 0.6)' }
            : undefined
        }
      >
        {word}
      </span>
    )
  }

  return (
    <motion.span
      style={{
        opacity,
        textShadow: isViolet || isAmber ? textShadow : undefined,
      }}
      className={`inline-block ${marginClass} ${colorClass}`}
    >
      {word}
    </motion.span>
  )
}

function LitWord({ word, index, total }) {
  const { isViolet, isAmber, colorClass } = getWordStyle(word)
  const marginClass = index === total - 1 ? 'mr-0' : 'mr-[0.25em]'

  return (
    <span
      className={`inline-block ${marginClass} ${colorClass}`}
      style={
        isViolet
          ? { textShadow: '0 0 22px rgba(167, 139, 250, 0.65)' }
          : isAmber
          ? { textShadow: '0 0 22px rgba(245, 158, 11, 0.65)' }
          : undefined
      }
    >
      {word}
    </span>
  )
}

export default function SceneManifesto({ p, shouldReduceMotion }) {
  const containerRef = useRef(null)
  const flashlightRef = useRef(null)

  // 0.34→0.38 enter, 0.56→0.60 exit
  const sceneOpacity = useTransform(p, [0.34, 0.38, 0.56, 0.6], [0, 1, 1, 0])
  const sceneY = useTransform(p, [0.34, 0.38, 0.56, 0.6], [40, 0, 0, -60])
  const pointerEvents = useTransform(p, (v) => (v >= 0.34 && v <= 0.6 ? 'auto' : 'none'))

  const handlePointerMove = (e) => {
    if (shouldReduceMotion || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    containerRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    containerRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`)
    if (flashlightRef.current) {
      flashlightRef.current.style.opacity = '1'
    }
  }

  const handlePointerLeave = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--mx', '-1000px')
      containerRef.current.style.setProperty('--my', '-1000px')
    }
    if (flashlightRef.current) {
      flashlightRef.current.style.opacity = '0'
    }
  }

  return (
    <motion.div
      style={{
        opacity: sceneOpacity,
        y: sceneY,
        pointerEvents,
      }}
      className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-12 md:p-16 select-none will-change-[transform,opacity]"
    >
      {/* Top Left Mono Label */}
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
        <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
          // FILE NOTES — PAGE 01
        </span>
      </div>

      {/* Center Paragraph with Word-by-Word Scroll Highlight & Cursor Flashlight */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="grid max-w-4xl mx-auto my-auto text-2xl sm:text-4xl md:text-5xl font-semibold leading-tight text-center px-4"
        style={{
          '--mx': '-1000px',
          '--my': '-1000px',
        }}
      >
        {/* Base Layer (Words brighten as user scrolls) */}
        <p className="[grid-area:1/1] m-0">
          {words.map((w, idx) => (
            <BaseWord
              key={idx}
              word={w}
              index={idx}
              total={words.length}
              p={p}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </p>

        {/* Flashlight Reveal Layer (Shows 100% lit words inside a 220px circle around cursor) */}
        {!shouldReduceMotion && (
          <div
            ref={flashlightRef}
            aria-hidden="true"
            className="[grid-area:1/1] pointer-events-none select-none hidden md:block"
            style={{
              opacity: 0,
              maskImage:
                'radial-gradient(circle 220px at var(--mx, -1000px) var(--my, -1000px), black 0%, black 140px, transparent 220px)',
              WebkitMaskImage:
                'radial-gradient(circle 220px at var(--mx, -1000px) var(--my, -1000px), black 0%, black 140px, transparent 220px)',
            }}
          >
            <p className="[grid-area:1/1] m-0">
              {words.map((w, idx) => (
                <LitWord key={idx} word={w} index={idx} total={words.length} />
              ))}
            </p>
          </div>
        )}
      </div>

      {/* Bottom faint watermark */}
      <div className="flex justify-end text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
        DOSSIER SEC-A
      </div>
    </motion.div>
  )
}
