import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import InteractiveDotGrid from './components/InteractiveDotGrid'
import InkCursorTrail from './components/InkCursorTrail'
import TiltCard from './components/TiltCard'
import PortraitCard from './components/PortraitCard'
import LeetCodeStats from './components/LeetCodeStats'
import SkillsCard from './components/SkillsCard'
import ExperienceCard from './components/ExperienceCard'
import ProjectsCard from './components/ProjectsCard'
import GlobeCard from './components/GlobeCard'
import ProjectsPage from './components/ProjectsPage'
import AboutPage from './components/AboutPage'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function App() {
  const [view, setView] = useState('Dashboard')

  function changeView(next) {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="dot-grid-bg min-h-screen relative">
      <InteractiveDotGrid />
      <InkCursorTrail />
      <Header activeNav={view} onNavChange={changeView} />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-28 pb-12 relative" style={{ zIndex: 2 }}>
        <AnimatePresence mode="wait">
          {view === 'Projects' ? (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              }}
              exit={{
                opacity: 0,
                y: -12,
                transition: { duration: 0.2 },
              }}
            >
              <ProjectsPage />
            </motion.div>
          ) : view === 'About Me' ? (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              }}
              exit={{
                opacity: 0,
                y: -12,
                transition: { duration: 0.2 },
              }}
            >
              <AboutPage onViewWork={() => changeView('Projects')} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              }}
              exit={{
                opacity: 0,
                y: -12,
                transition: { duration: 0.2 },
              }}
            >
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto"
                style={{ perspective: '1200px' }}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Row 1 */}
                <motion.div
                  id="about"
                  style={{ scrollMarginTop: '110px' }}
                  variants={cardVariants}
                  className="lg:col-span-1 lg:row-span-1 scroll-mt-[110px]"
                >
                  <TiltCard><PortraitCard /></TiltCard>
                </motion.div>
                <motion.div variants={cardVariants} className="lg:col-span-1 lg:row-span-1">
                  <TiltCard><LeetCodeStats /></TiltCard>
                </motion.div>
                <motion.div variants={cardVariants} className="lg:col-span-2 lg:row-span-1">
                  <TiltCard><SkillsCard /></TiltCard>
                </motion.div>

                {/* Row 2 */}
                <motion.div
                  id="experience"
                  style={{ scrollMarginTop: '110px' }}
                  variants={cardVariants}
                  className="lg:col-span-1 lg:row-span-1 scroll-mt-[110px]"
                >
                  <TiltCard><ExperienceCard /></TiltCard>
                </motion.div>
                <motion.div
                  id="work"
                  style={{ scrollMarginTop: '110px' }}
                  variants={cardVariants}
                  className="lg:col-span-2 lg:row-span-1 scroll-mt-[110px]"
                >
                  <TiltCard>
                    <ProjectsCard onViewAll={() => changeView('Projects')} />
                  </TiltCard>
                </motion.div>
                <motion.div
                  id="contact"
                  style={{ scrollMarginTop: '110px' }}
                  variants={cardVariants}
                  className="lg:col-span-1 lg:row-span-1 scroll-mt-[110px]"
                >
                  <TiltCard><GlobeCard /></TiltCard>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
