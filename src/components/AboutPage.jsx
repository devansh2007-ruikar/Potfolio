import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import DecryptText from './DecryptText'
import AboutIntro from './about-intro/AboutIntro'
import AboutMusicPill from './AboutMusicPill'
import Footer from './Footer'
import { links } from '../data/links'

const ROLES = [
  'Backend & Distributed Systems',
  'Interactive 3D Web Experiences',
  'Smart India Hackathon Finalist',
  'YouTube Tech & Space Creator',
]

function RotatingRole({ shouldReduceMotion }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROLES.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="h-8 overflow-hidden relative inline-flex items-center">
      <motion.div
        key={index}
        initial={{ y: shouldReduceMotion ? 0 : 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: shouldReduceMotion ? 0 : -20, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="font-bold text-violet-400 whitespace-nowrap"
      >
        {ROLES[index]}
      </motion.div>
    </div>
  )
}

function MagneticButton({ children, className, onClick, href, download, shouldReduceMotion }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

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

const goals = [
  {
    phase: 'SHORT-TERM · 2026',
    title: 'Backend / Full-Stack Internship',
    description: 'Land a high-impact engineering internship in 2026 building production Java/Spring Boot & React services.',
    accent: '#a78bfa',
    progress: 85,
    icon: (
      <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    phase: 'MID-TERM · 2027',
    title: 'Master Scalable System Design',
    description: 'Master distributed systems, event-driven pipelines, low-latency microservices, and cloud architecture.',
    accent: '#f59e0b',
    progress: 55,
    icon: (
      <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    phase: 'LONG-TERM · HORIZON',
    title: 'Tech That Secures the Web',
    description: 'Engineer automated crypto-forensic engines and AI-driven fraud detection that make the internet fundamentally safer.',
    accent: '#10b981',
    progress: 30,
    isBeacon: true,
    icon: (
      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
]

function GoalCheckpointRing({ progress, accent, isBeacon, shouldReduceMotion }) {
  const radius = 13
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
      <svg className="w-9 h-9 -rotate-90" viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="2.2"
        />
        <motion.circle
          cx="16"
          cy="16"
          r={radius}
          fill="none"
          stroke={accent}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: shouldReduceMotion ? strokeDashoffset : strokeDashoffset }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {isBeacon ? (
        <span className="absolute flex h-2 w-2">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: accent }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ backgroundColor: accent }}
          />
        </span>
      ) : (
        <span className="absolute text-[9px] font-mono font-bold" style={{ color: accent }}>
          {progress}%
        </span>
      )}
    </div>
  )
}

const toolboxGroups = [
  {
    category: 'Technical',
    accent: '#a78bfa',
    tech: [
      'Java',
      'Python',
      'Spring Boot',
      'MySQL',
      'Git',
      'Linux',
      'Streamlit',
      'Scikit-learn',
      'Data Structures',
      'REST APIs',
    ],
  },
  {
    category: 'Creative',
    accent: '#f472b6',
    tech: [
      'Video editing',
      'Content creation (YouTube)',
      'UI/motion design',
      'Storytelling',
    ],
  },
  {
    category: 'Organizational',
    accent: '#38bdf8',
    tech: [
      'Team collaboration (SIH)',
      'Project planning',
      'Problem solving',
      'Communication',
    ],
  },
]

const tagContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
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

const pageContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
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
    navigator.clipboard.writeText(links.email)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="w-full">
      <AboutMusicPill />
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
                  href={links.resume}
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
                  src="/me.jpg"
                  alt="Devansh Ruikar"
                  width="600"
                  height="600"
                  loading="lazy"
                  className="w-full h-full object-cover object-[50%_25%]"
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

          {/* CARD 4 – Goals (lg:col-span-1) */}
          <motion.div
            variants={cardItemVariants}
            className="bento-card lg:col-span-1 p-8 relative overflow-hidden flex flex-col justify-between border-violet-500/20"
          >
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-violet-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    Trajectory & Milestones
                  </span>
                </div>
                <span className="text-[11px] font-mono text-violet-400 font-semibold tracking-wider">
                  // MISSION
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Goals</h2>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Strategic technical milestones guiding my engineering roadmap.
              </p>

              {/* 3 Goals List */}
              <div className="space-y-4">
                {goals.map((goal, idx) => (
                  <motion.div
                    key={goal.phase}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.07] hover:border-white/15 transition-all flex items-start gap-3 group"
                  >
                    <GoalCheckpointRing
                      progress={goal.progress}
                      accent={goal.accent}
                      isBeacon={goal.isBeacon}
                      shouldReduceMotion={shouldReduceMotion}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: goal.accent }}>
                          {goal.phase}
                        </span>
                        <div className="p-1 rounded bg-white/[0.04]">
                          {goal.icon}
                        </div>
                      </div>
                      <h3 className="text-xs font-bold text-white tracking-tight">
                        {goal.title}
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                        {goal.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-white/[0.06] text-[11px] font-mono text-zinc-500">
              // ROADMAP CHECKPOINTS
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
                    Skills & Capabilities
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mt-1">Toolbox & Skills</h2>
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
                STACK DIRECTORY
              </span>
            </div>

            {/* Grouped Skills: Technical, Creative, Organizational */}
            <div className="space-y-6">
              {toolboxGroups.map((group) => (
                <div key={group.category} className="space-y-2.5">
                  <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: group.accent }} />
                    <span className="font-bold text-zinc-300">{group.category}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-[10px] text-zinc-500 lowercase font-mono">
                      {group.tech.length} proficiencies
                    </span>
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
                        {/* Shimmer gradient sweeping across on hover */}
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                        <span className="relative z-10">{t}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CARD 6 – Beyond Code (lg:col-span-1) */}
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

          {/* CARD 7 – Let's Talk / Contact & Links (lg:col-span-3) */}
          <motion.div
            variants={cardItemVariants}
            className="bento-card lg:col-span-3 p-8 sm:p-10 relative overflow-hidden border-violet-500/30 shadow-[0_0_60px_rgba(167,139,250,0.14)]"
          >
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Heading, Subtitle, Availability, Email actions */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    // GET IN TOUCH · CONTACT & LINKS
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  Let&apos;s build something.
                </h2>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg">
                  Have an internship opening, innovative project, or technical idea? Drop a line directly or connect across socials.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {/* Copy Email Button */}
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono transition-all text-zinc-200 hover:text-white flex items-center gap-3 cursor-pointer group"
                  >
                    <span>{links.email}</span>
                    <span className="px-2 py-0.5 rounded bg-violet-600/40 text-violet-200 text-[11px] font-bold group-hover:bg-violet-600 transition-colors">
                      {copied ? 'Copied ✓' : 'Copy'}
                    </span>
                  </button>

                  {/* Direct Mailto */}
                  <a
                    href={`mailto:${links.email}`}
                    className="py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-violet-500/25 cursor-pointer"
                  >
                    <span>Email Me</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>

              {/* Right Column: 4 Social Cards with Brand Hover Glows */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {/* GitHub */}
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/40 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-300 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-white">GitHub</div>
                      <div className="text-[11px] font-mono text-zinc-500">@devansh2007-ruikar</div>
                    </div>
                  </div>
                  <span className="text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 font-mono text-sm">↗</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#0a66c2]/60 hover:shadow-[0_0_25px_rgba(10,102,194,0.35)] transition-all duration-300 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-[#0a66c2] transition-colors">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-[#0a66c2] transition-colors">LinkedIn</div>
                      <div className="text-[11px] font-mono text-zinc-500">/in/devansh-ruikar</div>
                    </div>
                  </div>
                  <span className="text-zinc-500 group-hover:text-[#0a66c2] transition-transform group-hover:translate-x-0.5 font-mono text-sm">↗</span>
                </a>

                {/* Instagram */}
                <a
                  href={links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#e1306c]/60 hover:shadow-[0_0_25px_rgba(225,48,108,0.35)] transition-all duration-300 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-[#e1306c] transition-colors">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-[#e1306c] transition-colors">Instagram</div>
                      <div className="text-[11px] font-mono text-zinc-500">@d3vansh27</div>
                    </div>
                  </div>
                  <span className="text-zinc-500 group-hover:text-[#e1306c] transition-transform group-hover:translate-x-0.5 font-mono text-sm">↗</span>
                </a>

                {/* YouTube */}
                <a
                  href={links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#ff0000]/60 hover:shadow-[0_0_25px_rgba(255,0,0,0.35)] transition-all duration-300 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-[#ff0000] transition-colors">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-[#ff0000] transition-colors">YouTube</div>
                      <div className="text-[11px] font-mono text-zinc-500">@CrazzySpace</div>
                    </div>
                  </div>
                  <span className="text-zinc-500 group-hover:text-[#ff0000] transition-transform group-hover:translate-x-0.5 font-mono text-sm">↗</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
