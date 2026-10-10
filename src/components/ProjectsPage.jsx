import { useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { projects } from '../data/projects'
import DecryptText from './DecryptText'
import CaseFileOverlay from './CaseFileOverlay'
import Footer from './Footer'

const springTransition = { type: 'spring', stiffness: 300, damping: 34, mass: 0.9 }

const pageContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

const pageItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

const filterOptions = ['All', 'Award', 'Deployed', 'In Progress']

export default function ProjectsPage() {
  const [selectedId, setSelectedId] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')

  // Calculate statistics from projects data
  const totalCases = projects.length
  const totalAwards = projects.filter((p) => p.status === 'Award').length
  const totalDeployed = projects.filter((p) => p.status === 'Deployed').length
  const uniqueTechCount = new Set(projects.flatMap((p) => p.tech || [])).size

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'All') return true
    return p.status === activeFilter
  })

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <LayoutGroup id="projects-page">
      <motion.div
        variants={pageContainerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* 1. Hero Card */}
        <motion.div
          variants={pageItemVariants}
          className="bento-card p-8 sm:p-10 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8"
        >
          {/* Ambient blurred glows */}
          <div className="absolute -top-10 -right-10 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Left Hero Text */}
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                // CASE ARCHIVES · ACCESS GRANTED
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
              <DecryptText text="Classified Projects" delay={150} />
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 font-mono mt-3 leading-relaxed">
              Tactical crypto-forensics, high-performance rendering engines, and production AI architectures.
            </p>
          </div>

          {/* Right: 4 Stat Boxes */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3.5 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {String(totalCases).padStart(2, '0')}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mt-0.5">
                Case Files
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3.5 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                {String(totalAwards).padStart(2, '0')}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mt-0.5">
                Awards
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3.5 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {String(totalDeployed).padStart(2, '0')}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mt-0.5">
                Deployed
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3.5 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-violet-400 font-mono">
                {String(uniqueTechCount).padStart(2, '0')}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mt-0.5">
                Technologies
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Filter Bar */}
        <motion.div
          variants={pageItemVariants}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          {/* Filter Pills */}
          <div className="inline-flex items-center bg-black/90 p-1 rounded-full border border-white/10 self-start">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt)}
                className={`relative px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full transition-colors cursor-pointer ${
                  activeFilter === opt ? 'text-black font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {activeFilter === opt && (
                  <motion.div
                    layoutId="projectFilterPill"
                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{opt}</span>
              </button>
            ))}
          </div>

          {/* Showing counter */}
          <div className="text-xs font-mono text-zinc-400 tracking-wider">
            Showing {filteredProjects.length} of {totalCases} files
          </div>
        </motion.div>

        {/* 3. Grid of Dossier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full border border-dashed border-white/10 rounded-2xl p-12 text-center text-zinc-500 font-mono text-xs"
              >
                // NO CASE FILES FOUND MATCHING THIS FILTER //
              </motion.div>
            ) : (
              filteredProjects.map((p, index) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                      delay: index * 0.06,
                    },
                  }}
                  exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
                >
                  <motion.div
                    layoutId={`case-page-${p.id}`}
                    transition={springTransition}
                    onClick={() => setSelectedId(p.id)}
                    onMouseMove={handleMouseMove}
                    style={{
                      borderRadius: 24,
                      '--accent': p.accent,
                    }}
                    className="dossier-card group relative bg-black border border-white/10 p-6 sm:p-7 min-h-[340px] flex flex-col justify-between cursor-pointer transition-[border-color,box-shadow] duration-300 hover:border-white/25 overflow-hidden"
                  >
                    {/* Spotlight overlay */}
                    <div className="dossier-spotlight absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Faint Watermark Number in bottom-right */}
                    <span className="absolute bottom-2 right-4 text-7xl sm:text-8xl font-mono font-black text-white/[0.03] select-none pointer-events-none leading-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Card Content Top */}
                    <div className="relative z-10">
                      {/* Case ID, Year, Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                          {p.caseId} · {p.year}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${p.badgeColor}`}
                        >
                          {p.badge}
                        </span>
                      </div>

                      {/* Thin gradient line */}
                      <div
                        className="h-[1px] w-full mt-3 mb-4"
                        style={{
                          background:
                            'linear-gradient(90deg, var(--accent) 0%, rgba(255,255,255,0.15) 30%, transparent 100%)',
                        }}
                      />

                      {/* Title & Subtitle */}
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-zinc-100 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono mt-1">
                        {p.subtitle}
                      </p>

                      {/* Description */}
                      <p className="line-clamp-3 text-xs sm:text-sm text-zinc-300 leading-relaxed mt-3">
                        {p.description}
                      </p>

                      {/* Tech Chips (up to 5, then +N) */}
                      <div className="flex flex-wrap gap-1.5 my-4">
                        {p.tech.slice(0, 5).map((t) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.06]"
                          >
                            {t}
                          </span>
                        ))}
                        {p.tech.length > 5 && (
                          <span className="px-2 py-1 text-[11px] font-mono rounded-md bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
                            +{p.tech.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="relative z-10 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: p.accent }}
                        />
                        <span className="text-xs font-mono text-zinc-400">
                          {p.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
                        <span>Open file</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Case File Overlay for Projects Page */}
      <CaseFileOverlay
        selectedId={selectedId}
        onClose={() => setSelectedId(null)}
        layoutPrefix="case-page"
      />

      <Footer />
    </LayoutGroup>
  )
}
