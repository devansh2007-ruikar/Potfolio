import { useState } from 'react'
import { motion, LayoutGroup } from 'framer-motion'
import { projects } from '../data/projects'
import CaseFileOverlay from './CaseFileOverlay'
import { useTilt } from '../context/TiltContext'

const springTransition = { type: 'spring', stiffness: 300, damping: 34, mass: 0.9 }

export default function ProjectsCard() {
  const [selectedId, setSelectedId] = useState(null)
  const { setDisabled } = useTilt()

  function openCase(id) {
    setDisabled?.(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSelectedId(id)
      })
    })
  }

  return (
    <LayoutGroup id="case-files">
      <div className="bento-card h-full min-h-[420px] flex flex-col justify-between p-6 relative overflow-hidden group">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  Featured Work
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Classified Projects
              </h3>
            </div>

            <div className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.08]">
              CASE ARCHIVES
            </div>
          </div>
        </div>

        {/* Compact Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-auto flex-1">
          {projects.map((p) => (
            <motion.div
              key={p.id}
              layoutId={`case-${p.id}`}
              transition={springTransition}
              onClick={() => openCase(p.id)}
              style={{ borderRadius: 16 }}
              className="group/card relative bg-black [background-image:radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px] border border-white/10 p-4 flex flex-col justify-between cursor-pointer hover:border-violet-500/40 hover:shadow-[0_0_25px_rgba(167,139,250,0.15)] transition-[border-color,box-shadow] duration-300 min-h-[170px]"
            >
              <div>
                {/* Case ID & Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                    {p.caseId}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${p.badgeColor}`}
                  >
                    {p.badge}
                  </span>
                </div>

                {/* Title in bold white with layout="position" */}
                <motion.h4
                  layout="position"
                  className="text-base font-bold text-white group-hover/card:text-violet-200 transition-colors"
                >
                  {p.title}
                </motion.h4>

                {/* Subtitle */}
                <p className="text-xs text-zinc-400 font-mono mt-1 line-clamp-2 leading-relaxed">
                  {p.subtitle}
                </p>
              </div>

              {/* Bottom bar with status and sliding "Open file →" hint */}
              <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: p.accent }}
                  />
                  {p.status} • {p.year}
                </span>

                {/* Small "Open file →" hint that slides in on hover */}
                <div className="flex items-center gap-1 text-[11px] font-mono font-medium text-violet-400 opacity-0 -translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-200">
                  <span>Open file</span>
                  <span className="transition-transform group-hover/card:translate-x-0.5">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer bar */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-500 mt-4">
          <span className="text-[11px] font-mono flex items-center gap-1.5 text-zinc-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Interactive Architecture Dossiers
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            {projects.length} of {projects.length} Files Ready
          </span>
        </div>
      </div>

      {/* Portal Overlay with shared LayoutGroup */}
      <CaseFileOverlay
        selectedId={selectedId}
        onClose={() => setSelectedId(null)}
        onExitComplete={() => setDisabled?.(false)}
      />
    </LayoutGroup>
  )
}
