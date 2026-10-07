import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const skillCategories = {
  Backend: [
    { name: 'Java', level: 90, detail: 'Core, Collections, Multithreading' },
    { name: 'Spring Boot', level: 85, detail: 'REST APIs, MVC, Security' },
    { name: 'Hibernate & JPA', level: 80, detail: 'ORM, Entity Relational, HQL' },
    { name: 'MySQL', level: 85, detail: 'Query optimization, Schema design' },
  ],
  'Core CS': [
    { name: 'Data Structures & Algorithms', level: 90, detail: 'LeetCode, Graph, DP, Trees' },
    { name: 'Object-Oriented Programming', level: 92, detail: 'Design patterns, SOLID principles' },
    { name: 'Operating Systems', level: 82, detail: 'Processes, Concurrency, Memory management' },
  ],
  'Tools & AI': [
    { name: 'Python (NumPy)', level: 84, detail: 'Scikit-learn, Data processing' },
    { name: 'Git & Maven', level: 85, detail: 'Version control, Build pipelines' },
    { name: 'AI-Assisted Web Development', level: 90, detail: 'AI workflows, Rapid architecture' },
    { name: 'Google NotebookLM', level: 88, detail: 'Technical research, Synthesis' },
  ],
}

const quickPills = [
  'Java 21', 'Spring Boot', 'Hibernate', 'MySQL',
  'Python', 'DSA', 'OOP', 'OS', 'Git', 'Maven', 'REST APIs', 'NotebookLM'
]

export default function SkillsCard() {
  const [activeTab, setActiveTab] = useState('Backend')

  return (
    <div className="bento-card h-full min-h-[420px] lg:min-h-0 flex flex-col justify-between p-6 lg:p-4 [@media(max-height:760px)]:p-3.5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Category Switcher */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 lg:mb-2 [@media(max-height:760px)]:mb-1.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                Technical Stack
              </span>
            </div>
            <h3 className="text-lg lg:text-base font-bold text-white mt-1">Core Proficiencies</h3>
          </div>

          {/* Category Tabs (without Frontend) */}
          <div className="flex items-center bg-white/[0.05] rounded-xl p-1 border border-white/[0.08] self-start sm:self-auto">
            {Object.keys(skillCategories).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-3 py-1.5 lg:py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeSkillTab"
                    className="absolute inset-0 bg-violet-600 rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Skill Bars Block with Animated Fill */}
        <div className="my-1 flex-1 min-h-0 overflow-y-auto no-scrollbar max-h-[175px] lg:max-h-none pr-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 lg:space-y-2 [@media(max-height:760px)]:space-y-1.5"
            >
              {skillCategories[activeTab].map((skill, index) => (
                <div key={skill.name} className="group">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-200">{skill.name}</span>
                      <span className="text-[11px] text-zinc-500 hidden sm:inline">
                        — {skill.detail}
                      </span>
                    </div>
                    <span className="font-mono text-zinc-400 tabular-nums">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden p-[1px]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 shadow-[0_0_12px_rgba(167,139,250,0.4)]"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Pills */}
      <div className="pt-3 lg:pt-2 [@media(max-height:760px)]:pt-1.5 border-t border-white/[0.08]">
        <div className="text-[11px] text-zinc-400 mb-2 lg:mb-1 font-medium">Quick Tags:</div>
        <div className="flex flex-wrap gap-1.5 lg:gap-1">
          {quickPills.map((pill) => (
            <span
              key={pill}
              className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.06] hover:border-violet-500/40 hover:text-white transition-colors cursor-default"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
