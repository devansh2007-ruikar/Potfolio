import { useState, useRef } from 'react'
import { motion, LayoutGroup } from 'framer-motion'
import { projects } from '../data/projects'
import CaseFileOverlay from './CaseFileOverlay'
import { useTilt } from '../context/TiltContext'

const springTransition = { type: 'spring', stiffness: 300, damping: 34, mass: 0.9 }
const FLATTEN_MS = 230

export default function ProjectsCard({ onViewAll }) {
  const [selectedId, setSelectedId] = useState(null)
  const { setDisabled } = useTilt()

  const flatSince = useRef(0)
  const hovering = useRef(false)

  function openCase(id) {
    const now = performance.now()
    if (flatSince.current === 0) {
      setDisabled?.(true)
      flatSince.current = now
    }
    const wait = Math.max(0, FLATTEN_MS - (now - flatSince.current))
    if (wait === 0) {
      setSelectedId(id)
    } else {
      setTimeout(() => {
        setSelectedId(id)
      }, wait)
    }
  }

  return (
    <LayoutGroup id="case-files">
      <div className="bento-card h-full min-h-[420px] lg:min-h-0 flex flex-col justify-between p-6 lg:p-4 [@media(max-height:760px)]:p-3.5 relative overflow-hidden group">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-4 lg:mb-2 [@media(max-height:760px)]:mb-1.5">
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

            <button
              type="button"
              onClick={onViewAll}
              className="group/btn text-[10px] font-mono text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1 rounded-lg border border-white/[0.08] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>VIEW ALL</span>
              <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
            </button>
          </div>
        </div>

        {/* Compact Project Cards Grid */}
        <div
          onPointerEnter={() => {
            hovering.current = true
            setDisabled?.(true)
            flatSince.current = performance.now()
          }}
          onPointerLeave={() => {
            hovering.current = false
            if (!selectedId) {
              setDisabled?.(false)
              flatSince.current = 0
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3.5 lg:gap-2.5 my-auto flex-1 min-h-0"
        >
          {projects.map((p) => (
            <motion.div
              key={p.id}
              layoutId={`case-${p.id}`}
              transition={springTransition}
              onClick={() => openCase(p.id)}
              style={{ borderRadius: 16 }}
              className="group/card relative bg-black [background-image:radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px] border border-white/10 p-4 lg:p-3 [@media(max-height:760px)]:p-2.5 flex flex-col justify-between cursor-pointer hover:border-violet-500/40 hover:shadow-[0_0_25px_rgba(167,139,250,0.15)] transition-[border-color,box-shadow] duration-300 min-h-[170px] lg:min-h-0"
            >
              <div>
                {/* Case ID & Badge */}
                <div className="flex items-center justify-between gap-2 mb-2 lg:mb-1">
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
                  className="text-base lg:text-sm font-bold text-white group-hover/card:text-violet-200 transition-colors"
                >
                  {p.title}
                </motion.h4>

                {/* Subtitle */}
                <p className="text-xs text-zinc-400 font-mono mt-1 line-clamp-2 lg:line-clamp-1 [@media(max-height:760px)]:hidden leading-relaxed">
                  {p.subtitle}
                </p>
              </div>

              {/* Bottom bar with status and sliding "Open file →" hint */}
              <div className="pt-3 mt-3 lg:pt-1.5 lg:mt-1.5 border-t border-white/[0.06] flex items-center justify-between">
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
        <div className="pt-3 lg:pt-1.5 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-500 mt-4 lg:mt-2 [@media(max-height:760px)]:mt-1">
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
        onExitComplete={() => {
          if (!hovering.current) {
            setDisabled?.(false)
            flatSince.current = 0
          }
        }}
      />
    </LayoutGroup>
  )
}
