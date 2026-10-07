import { useState } from 'react'
import { motion } from 'framer-motion'

const experiences = [
  {
    id: 'youtube',
    role: 'Content Creator & Developer',
    organization: 'Devv & Crazy Space (YouTube)',
    period: 'Ongoing',
    status: 'Active',
    bullets: [
      'Run two YouTube channels producing documentary-style and AI-generated videos, managing research, scripting, and editing end-to-end.',
      'Built a custom browser extension to automate parts of the AI video production workflow.',
    ],
    skills: ['Browser Extension', 'AI Workflow', 'Scripting', 'Video Production'],
  },
  {
    id: 'mycaptain',
    role: 'Campus Ambassador',
    organization: 'MyCaptain',
    period: 'June 2026 – July 2026',
    status: 'Completed',
    bullets: [
      "Promoted MyCaptain's programs across campus through outreach and social media.",
      'Built communication with student groups to drive awareness and active participation.',
    ],
    skills: ['Campus Outreach', 'Community Building', 'Social Media'],
  },
]

export default function ExperienceCard() {
  const [activeId, setActiveId] = useState('youtube')
  const currentExp = experiences.find((e) => e.id === activeId) || experiences[0]

  return (
    <div className="bento-card h-full min-h-[420px] flex flex-col justify-between p-6 relative overflow-hidden group">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              Work & Roles
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            2 Experiences
          </span>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          Experience
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Organizations, outreach & creative tech production
        </p>
      </div>

      {/* Experience Selector Tabs */}
      <div className="my-3 flex gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
        {experiences.map((exp) => (
          <button
            key={exp.id}
            onClick={() => setActiveId(exp.id)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all text-center truncate cursor-pointer ${
              activeId === exp.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
            }`}
          >
            {exp.organization.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Active Experience Details Container - Scrollable Block */}
      <div className="flex-1 overflow-y-auto max-h-[195px] pr-2 my-1">
        <motion.div
          key={currentExp.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-2.5"
        >
          <div>
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-sm font-bold text-white tracking-tight">
                {currentExp.role}
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
                {currentExp.period}
              </span>
            </div>
            <p className="text-xs font-medium text-amber-300/90 mt-0.5">
              {currentExp.organization}
            </p>
          </div>

          <ul className="space-y-1.5">
            {currentExp.bullets.map((bullet, idx) => (
              <li
                key={idx}
                className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2"
              >
                <span className="text-amber-400 mt-1 text-[8px]">●</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1 pt-1">
            {currentExp.skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.06]"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer bar */}
      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-500">
        <span className="text-[11px] font-mono">Status: {currentExp.status}</span>
        <span className="text-[11px] font-mono text-amber-400/90">
          Verified Resume Entry
        </span>
      </div>
    </div>
  )
}
