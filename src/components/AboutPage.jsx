import { useState, useEffect, useRef } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import DecryptText from './DecryptText'
import meImg from '../assets/me.jpg'
import AboutIntro from './about-intro/AboutIntro'

const pageContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

const cardItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

const roles = [
  'backend systems',
  'full-stack web apps',
  '3D web experiences',
  'forensics tools',
]

function RotatingRole({ shouldReduceMotion }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length)
    }, 2200)
    return () => clearInterval(timer)
  }, [])

  return (
    <span className="inline-block relative">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent font-bold inline-block"
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  download,
  shouldReduceMotion,
}) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 350, damping: 25 })
  const springY = useSpring(y, { stiffness: 350, damping: 25 })

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    const maxDist = 6
    x.set(Math.max(-maxDist, Math.min(maxDist, distanceX * 0.2)))
    y.set(Math.max(-maxDist, Math.min(maxDist, distanceY * 0.2)))
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const Comp = href ? motion.a : motion.button

  return (
    <Comp
      ref={ref}
      href={href}
      download={download}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: shouldReduceMotion ? 0 : springX, y: shouldReduceMotion ? 0 : springY }}
      className={className}
    >
      {children}
    </Comp>
  )
}

const timelineEvents = [
  {
    year: '2023',
    title: 'Started B.Tech CSE @ Ramdeobaba University',
    description:
      'Initiated engineering journey diving deep into Java, object-oriented design, discrete math, and distributed computing foundations.',
    accent: '#a78bfa',
  },
  {
    year: '2024',
    title: 'Started YouTube channels (Devv & Crazy Space)',
    description:
      'Created technical video essays and visual breakdowns covering software engineering, astrophysics, and space telemetry.',
    accent: '#f59e0b',
  },
  {
    year: '2025',
    title: 'Built 3D Animated Website',
    description:
      'Engineered interactive WebGL & Three.js canvas environments with physics-based card tilting and perspective camera orchestration.',
    accent: '#a78bfa',
  },
  {
    year: '2026',
    title: 'MITHYA at Smart India Hackathon',
    description:
      'Developed an air-gapped forensic engine clustering crypto wallets, generating court-ready SHA-256 provenance audit dossiers.',
    accent: '#f59e0b',
  },
]

const beyondCodeTiles = [
  {
    emoji: '🎬',
    label: 'Content creation',
    note: 'Producing tech breakdowns & creative video essays on YouTube',
  },
  {
    emoji: '🧠',
    label: 'DSA & LeetCode',
    note: 'Mastering algorithmic optimization, graph theory & recursion',
  },
  {
    emoji: '🎮',
    label: '3D & motion design',
    note: 'Crafting spatial shaders, Three.js canvases & keyframe timing',
  },
  {
    emoji: '📚',
    label: 'Always learning',
    note: 'Exploring high-throughput backend architecture & cloud tooling',
  },
]

const toolboxGroups = [
  {
    category: 'Languages',
    accent: '#f59e0b',
    tech: ['Java', 'Python'],
  },
  {
    category: 'Backend',
    accent: '#10b981',
    tech: ['Spring Boot', 'MySQL'],
  },
  {
    category: 'Tools',
    accent: '#38bdf8',
    tech: ['Git', 'Linux'],
  },
]

const tagContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
}

const tagItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 25 },
  },
}

export default function AboutPage({ onViewWork, onIntroActiveChange }) {
  const shouldReduceMotion = useReducedMotion()
  const [photoTilt, setPhotoTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const handlePhotoMouseMove = (e) => {
    if (shouldReduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setPhotoTilt({ rotateX: -y * 12, rotateY: x * 12 })
  }

  const handlePhotoMouseLeave = () => {
    setPhotoTilt({ rotateX: 0, rotateY: 0 })
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('devanshruikar2007@gmail.com')
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="w-full">
      <AboutIntro onIntroActiveChange={onIntroActiveChange} />

      <div id="about-bento" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 relative">
        <motion.div
          variants={pageContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
      {/* CARD 1 – Intro (lg:col-span-2, min-h 420px) */}
      <motion.div
        variants={cardItemVariants}
        className="bento-card lg:col-span-2 min-h-[420px] p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between"
      >
        {/* Soft background glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Giant faint DR watermark */}
        <span className="absolute bottom-2 right-4 text-8xl sm:text-9xl font-mono font-black text-white/[0.03] select-none pointer-events-none leading-none">
          DR
        </span>

        {/* Top: Status pill & mono label */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-mono font-medium text-emerald-400 tracking-wide">
                Open for internships · Nagpur, IN
              </span>
            </div>

            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
              CASE PROFILE // INTRO
            </span>
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
              // HELLO, WORLD. I&apos;M
            </span>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mt-1">
              <DecryptText text="Devansh Ruikar" delay={200} />
            </h1>

            <div className="text-xl sm:text-2xl font-medium text-zinc-300 mt-3 flex items-center gap-2 flex-wrap">
              <span>I build</span>
              <RotatingRole shouldReduceMotion={shouldReduceMotion} />
            </div>
          </div>
        </div>

        {/* Middle & Bottom: Bio and Magnetic Buttons */}
        <div className="relative z-10 pt-6 space-y-6">
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
            B.Tech CSE student at Ramdeobaba University. I like building things that are fast under the hood and feel great on the surface — from Spring Boot APIs to interactive 3D websites. I also run YouTube channels about tech and creativity.
          </p>

          <div className="flex items-center gap-3.5 flex-wrap">
            <MagneticButton
              onClick={onViewWork}
              shouldReduceMotion={shouldReduceMotion}
              className="px-6 py-3 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <span>View my work</span>
              <span>→</span>
            </MagneticButton>

            <MagneticButton
              href="/resume.pdf"
              download
              shouldReduceMotion={shouldReduceMotion}
              className="px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-white text-xs font-mono font-semibold tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>Download résumé</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </MagneticButton>
          </div>
        </div>
      </motion.div>

      {/* CARD 2 – Photo (lg:col-span-1) */}
      <motion.div
        variants={cardItemVariants}
        className="bento-card lg:col-span-1 min-h-[420px] p-8 relative overflow-hidden flex flex-col items-center justify-center text-center"
      >
        <div
          onMouseMove={handlePhotoMouseMove}
          onMouseLeave={handlePhotoMouseLeave}
          className="relative group cursor-pointer"
        >
          {/* Slowly rotating blurred conic-gradient glow ring */}
          <div
            className={`absolute -inset-4 rounded-3xl opacity-60 blur-xl pointer-events-none ${
              shouldReduceMotion ? '' : 'animate-spin'
            }`}
            style={{
              background: 'conic-gradient(from 0deg, #a78bfa, #f59e0b, #ec4899, #a78bfa)',
              animationDuration: '12s',
            }}
          />

          {/* Photo container with mouse tilt */}
          <motion.div
            animate={shouldReduceMotion ? { rotateX: 0, rotateY: 0 } : photoTilt}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border border-white/15 bg-zinc-900 shadow-2xl z-10"
          >
            <img
              src={meImg}
              alt="Devansh Ruikar"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

          {/* Bobbing floating mono tag */}
          <motion.div
            animate={shouldReduceMotion ? { y: 0 } : { y: [-6, 6, -6] }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-full bg-black/95 border border-white/20 text-[10px] font-mono tracking-widest text-zinc-300 shadow-2xl whitespace-nowrap"
          >
            CASE-000 · THE DEVELOPER
          </motion.div>
        </div>
      </motion.div>

      {/* CARD 3 – My Journey (lg:col-span-2) */}
      <motion.div
        variants={cardItemVariants}
        className="bento-card lg:col-span-2 p-8 sm:p-10 relative overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                Timeline & Milestones
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">My Journey</h2>
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
            2023 — 2026
          </span>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-2 sm:pl-4 space-y-7">
          {/* Timeline continuous vertical line that draws downward while in view */}
          <motion.div
            className="absolute left-[19px] sm:left-[27px] top-3 bottom-4 w-[2px] origin-top pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, #a78bfa 0%, #f59e0b 50%, #a78bfa 100%)',
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          />

          {timelineEvents.map((evt, i) => (
            <motion.div
              key={evt.year}
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-start gap-4 sm:gap-5"
            >
              {/* Dot */}
              <div className="w-8 h-8 rounded-full border border-white/20 bg-black flex items-center justify-center shrink-0 z-10 shadow-[0_0_14px_rgba(167,139,250,0.35)]">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: evt.accent }}
                />
              </div>

              {/* Event Content */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-xs font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08]"
                    style={{ color: evt.accent }}
                  >
                    {evt.year}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white font-sans">
                    {evt.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                  {evt.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CARD 4 – Beyond Code (lg:col-span-1) */}
      <motion.div
        variants={cardItemVariants}
        className="bento-card lg:col-span-1 p-8 relative overflow-hidden flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-violet-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              Interests & Craft
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-6">Beyond Code</h2>

          {/* 2x2 Grid of Tiles */}
          <div className="grid grid-cols-2 gap-3">
            {beyondCodeTiles.map((tile) => (
              <motion.div
                key={tile.label}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: -4,
                      }
                }
                className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-3.5 flex flex-col justify-between cursor-default transition-[border-color,box-shadow] duration-200 hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(167,139,250,0.2)]"
              >
                <div className="text-2xl mb-2">{tile.emoji}</div>
                <div>
                  <div className="text-xs font-bold text-white font-mono">
                    {tile.label}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1 leading-snug">
                    {tile.note}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-white/[0.06] text-[11px] font-mono text-zinc-500">
          // CREATIVE CODING & SYSTEMS
        </div>
      </motion.div>

      {/* CARD 5 – Toolbox (lg:col-span-2) */}
      <motion.div
        variants={cardItemVariants}
        className="bento-card lg:col-span-2 p-8 sm:p-10 relative overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                Skills & Technologies
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">Technical Toolbox</h2>
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
            STACK DIRECTORY
          </span>
        </div>

        {/* Grouped Skills */}
        <div className="space-y-5">
          {toolboxGroups.map((group) => (
            <div key={group.category} className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: group.accent }} />
                <span>{group.category}</span>
              </div>

              <motion.div
                variants={tagContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-wrap gap-2"
              >
                {group.tech.map((t) => (
                  <motion.div
                    key={t}
                    variants={tagItemVariants}
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : {
                            y: -2,
                            boxShadow: `0 0 20px color-mix(in srgb, ${group.accent} 70%, transparent)`,
                          }
                    }
                    className="group relative overflow-hidden rounded-full font-mono text-xs px-3.5 py-1.5 cursor-default transition-[box-shadow,border-color] duration-300 text-white select-none inline-flex items-center"
                    style={{
                      border: `1px solid color-mix(in srgb, ${group.accent} 40%, transparent)`,
                      backgroundColor: `color-mix(in srgb, ${group.accent} 10%, transparent)`,
                      boxShadow: `0 0 12px color-mix(in srgb, ${group.accent} 35%, transparent)`,
                    }}
                  >
                    {/* Slow shimmer gradient sweeping across on hover */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                    <span className="relative z-10">{t}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CARD 6 – Let's Talk (lg:col-span-1, violet glow) */}
      <motion.div
        variants={cardItemVariants}
        className="bento-card lg:col-span-1 p-8 relative overflow-hidden flex flex-col justify-between border-violet-500/30 shadow-[0_0_50px_rgba(167,139,250,0.12)]"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              Get in Touch
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Let&apos;s build something.
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 mt-2.5 leading-relaxed">
            Have an internship opening, innovative project, or technical idea? Drop a line directly.
          </p>

          {/* Copy Email Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="w-full py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono transition-[border-color,background-color] duration-200 text-zinc-200 hover:text-white flex items-center justify-between cursor-pointer group"
            >
              <span className="truncate">devanshruikar2007@gmail.com</span>
              <span className="shrink-0 ml-2 px-2.5 py-0.5 rounded bg-violet-600/40 text-violet-200 text-[11px] font-bold group-hover:bg-violet-600 transition-colors">
                {copied ? 'Copied ✓' : 'Copy'}
              </span>
            </button>
          </div>
        </div>

        {/* Social Icons Below */}
        <div className="relative z-10 pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            Connect
          </span>

          <div className="flex items-center gap-3">
            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-[background-color,border-color,color] duration-200"
              title="GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-[background-color,border-color,color] duration-200"
              title="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-[background-color,border-color,color] duration-200"
              title="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </div>
</div>
  )
}
