import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { projects as defaultProjects } from '../data/projects'
import DecryptText from './DecryptText'

const springTransition = { type: 'spring', stiffness: 300, damping: 34, mass: 0.9 }

const contentContainerVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
}

const blockVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
}

const lineVariants = {
  hidden: {
    scaleX: 0,
    opacity: 0,
  },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
}

const tagsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
}

const tagItemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 340,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.15 },
  },
}

export default function CaseFileOverlay({
  selectedId,
  onClose,
  onExitComplete,
  projects = defaultProjects,
}) {
  const [mounted, setMounted] = useState(false)
  const project = projects.find((p) => p.id === selectedId)

  // Wait for client-side DOM mount for createPortal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll while open and restore on close, preventing layout shift
  useEffect(() => {
    if (!selectedId) return

    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow || ''
      document.body.style.paddingRight = originalPaddingRight || ''
    }
  }, [selectedId])

  // Close on Escape key
  useEffect(() => {
    if (!selectedId) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, onClose])

  if (!mounted || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <AnimatePresence onExitComplete={onExitComplete}>
      {selectedId && project && (
        <div key="case-file-overlay-root">
          {/* Backdrop */}
          <motion.div
            key="case-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            key={`case-modal-${project.id}`}
            layoutId={`case-${project.id}`}
            transition={springTransition}
            onClick={(e) => e.stopPropagation()}
            style={{
              '--accent': project.accent,
              borderRadius: 24,
              width: 'min(1100px, 94vw)',
              height: 'min(88vh, 900px)',
            }}
            className="fixed inset-0 m-auto z-[101] bg-black [background-image:radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:20px_20px] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden"
          >
            {/* Scrollable inner wrapper preventing distortion */}
            <div className="relative h-full w-full overflow-y-auto overscroll-contain p-6 sm:p-8 md:p-10">
              {/* Ambient inner glow blur using CSS variable */}
              <div
                className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
                style={{ backgroundColor: 'var(--accent)' }}
              />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

              {/* Content Animated Container */}
              <motion.div
                variants={contentContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative z-10 flex flex-col gap-6 sm:gap-7"
              >
                {/* 1. Header Strip */}
                <motion.div variants={blockVariants} className="w-full">
                  <div className="flex items-center justify-between gap-4 pb-3">
                    <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap font-mono uppercase text-[11px] tracking-widest">
                      <span className="text-zinc-400 font-bold">
                        {project.caseId}
                      </span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-500">{project.year}</span>
                      <span className="text-zinc-600">·</span>
                      <span
                        className="px-2.5 py-0.5 rounded-full border text-[11px] font-mono uppercase tracking-widest font-medium"
                        style={{
                          borderColor:
                            'color-mix(in srgb, var(--accent) 40%, transparent)',
                          backgroundColor:
                            'color-mix(in srgb, var(--accent) 15%, transparent)',
                          color: 'var(--accent)',
                        }}
                      >
                        {project.status}
                      </span>
                    </div>

                    {/* Top-Right "✕ CLOSE FILE" mono button */}
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 flex-shrink-0"
                    >
                      <span className="text-sm leading-none">✕</span>
                      <span>CLOSE FILE</span>
                    </button>
                  </div>

                  {/* Thin 1px line that draws from left to right (scaleX 0→1, origin-left) */}
                  <motion.div
                    variants={lineVariants}
                    className="h-[1px] w-full origin-left"
                    style={{
                      background:
                        'linear-gradient(90deg, var(--accent) 0%, rgba(255,255,255,0.2) 35%, rgba(255,255,255,0.06) 100%)',
                    }}
                  />
                </motion.div>

                {/* 2. Title + Subtitle */}
                <motion.div variants={blockVariants}>
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white flex items-center gap-4 flex-wrap">
                    <DecryptText
                      text={project.title}
                      trigger={selectedId}
                      delay={250}
                    />
                    <span
                      className={`text-xs font-mono px-2.5 py-1 rounded-full border ${project.badgeColor}`}
                    >
                      {project.badge}
                    </span>
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-400 font-mono mt-2">
                    {project.subtitle}
                  </p>
                </motion.div>

                {/* 3. 2-column section on md+ */}
                <motion.div
                  variants={blockVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start"
                >
                  {/* Left: Summary + Key Findings */}
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="space-y-2">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                        Summary
                      </h3>
                      <p className="text-sm sm:text-base text-zinc-300 leading-relaxed bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 sm:p-5">
                        {project.description}
                      </p>
                    </div>

                    {/* Key Findings */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                        Key Findings
                      </h3>
                      <div className="space-y-2.5">
                        {project.keyPoints.map((pt, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5"
                          >
                            <span
                              className="font-mono text-xs font-bold shrink-0 mt-0.5 tracking-wider"
                              style={{ color: 'var(--accent)' }}
                            >
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                              {pt}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Evidence Panel + Links */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                          Evidence
                        </h3>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">
                          CHANNEL // 01 · 60FPS
                        </span>
                      </div>

                      {/* Evidence Box with scanline gradient */}
                      <div className="relative rounded-2xl border border-white/10 bg-zinc-950/90 overflow-hidden h-52 sm:h-64 flex flex-col justify-between p-4 [background-image:repeating-linear-gradient(0deg,rgba(0,0,0,0.5)_0px,rgba(0,0,0,0.5)_2px,transparent_2px,transparent_4px)]">
                        {/* Animated scanline gradient sweep */}
                        <div
                          className="absolute inset-0 pointer-events-none opacity-25 animate-scanline"
                          style={{
                            background:
                              'linear-gradient(180deg, transparent 0%, var(--accent) 50%, transparent 100%)',
                            height: '40%',
                          }}
                        />

                        {/* Ambient center glow */}
                        <div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-15"
                          style={{ backgroundColor: 'var(--accent)' }}
                        />

                        {/* Top telemetry strip */}
                        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block w-2 h-2 rounded-full animate-ping"
                              style={{ backgroundColor: 'var(--accent)' }}
                            />
                            <span className="tracking-wider">
                              ARTIFACT CAPTURE
                            </span>
                          </div>
                          <span className="text-zinc-600">
                            AIR-GAPPED TELEMETRY
                          </span>
                        </div>

                        {/* Middle placeholder visual */}
                        <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center gap-2.5 py-2">
                          <div
                            className="w-12 h-12 rounded-xl border flex items-center justify-center bg-white/[0.03]"
                            style={{
                              borderColor:
                                'color-mix(in srgb, var(--accent) 35%, transparent)',
                              color: 'var(--accent)',
                            }}
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                              Telemetry & Architecture Audit
                            </div>
                            <div className="text-[11px] font-mono text-zinc-500 max-w-xs mt-0.5">
                              Real-time pipeline verification & verifiable
                              dossiers
                            </div>
                          </div>
                        </div>

                        {/* Bottom telemetry strip */}
                        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-white/[0.06] pt-2">
                          <span>SHA-256 // VERIFIED</span>
                          <span style={{ color: 'var(--accent)' }}>
                            STATUS: AUDITED
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Buttons (GitHub / Live) */}
                    <div className="flex items-center gap-3 pt-1">
                      <a
                        href={project.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer border shadow-lg group/btn text-white hover:brightness-110"
                        style={{
                          borderColor:
                            'color-mix(in srgb, var(--accent) 45%, transparent)',
                          backgroundColor:
                            'color-mix(in srgb, var(--accent) 18%, transparent)',
                          boxShadow:
                            '0 0 20px color-mix(in srgb, var(--accent) 25%, transparent)',
                        }}
                      >
                        <span>{project.linkText}</span>
                        <svg
                          className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>

                      <button
                        type="button"
                        onClick={onClose}
                        className="py-2.5 px-4 rounded-xl text-xs font-mono text-zinc-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 transition-colors cursor-pointer"
                      >
                        Close (Esc)
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* 4. Bottom: "Tech Stack" tags */}
                <motion.div variants={blockVariants} className="space-y-3 pt-2">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                    Tech Stack
                  </h3>
                  <motion.div
                    variants={tagsContainerVariants}
                    className="flex flex-wrap gap-2.5"
                  >
                    {project.tech.map((t) => (
                      <motion.div
                        key={t}
                        variants={tagItemVariants}
                        whileHover={{
                          y: -2,
                          boxShadow:
                            '0 0 20px color-mix(in srgb, var(--accent) 70%, transparent)',
                        }}
                        transition={{ duration: 0.2 }}
                        className="group relative overflow-hidden rounded-full font-mono text-xs px-3.5 py-1.5 cursor-default transition-[box-shadow,border-color] duration-300 text-white select-none inline-flex items-center"
                        style={{
                          border:
                            '1px solid color-mix(in srgb, var(--accent) 40%, transparent)',
                          backgroundColor:
                            'color-mix(in srgb, var(--accent) 10%, transparent)',
                          boxShadow:
                            '0 0 12px color-mix(in srgb, var(--accent) 35%, transparent)',
                        }}
                      >
                        {/* Slow shimmer gradient sweeping across on hover */}
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                        <span className="relative z-10">{t}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
