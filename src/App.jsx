import { useState, useEffect } from 'react'
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
import { useMusic } from './context/useMusic'

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
  const [introActive, setIntroActive] = useState(false)

  // Lock scrolling on Dashboard for desktop screens
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')

    const updateScrollLock = () => {
      if (view === 'Dashboard' && mediaQuery.matches) {
        document.documentElement.classList.add('no-scroll')
      } else {
        document.documentElement.classList.remove('no-scroll')
      }
    }

    if (view === 'Dashboard') {
      window.scrollTo(0, 0)
    }

    updateScrollLock()

    mediaQuery.addEventListener('change', updateScrollLock)
    return () => {
      mediaQuery.removeEventListener('change', updateScrollLock)
      document.documentElement.classList.remove('no-scroll')
    }
  }, [view])

  const { leaveAboutMe } = useMusic()

  function changeView(next) {
    if (view === 'About Me' && next !== 'About Me') {
      leaveAboutMe()
    }
    setView(next)
    if (next !== 'About Me') setIntroActive(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isIntroOnScreen = view === 'About Me' && introActive

  return (
    <div className={`${isIntroOnScreen ? 'bg-black' : 'dot-grid-bg'} min-h-screen relative`}>
      {!isIntroOnScreen && <InteractiveDotGrid />}
      {!isIntroOnScreen && <InkCursorTrail />}
      <Header activeNav={view} onNavChange={changeView} />

      <main
        className={`${
          view === 'About Me'
            ? 'w-full relative'
            : view === 'Dashboard'
            ? 'max-w-[1400px] mx-auto px-4 sm:px-6 pt-28 pb-12 lg:h-screen lg:pt-24 lg:pb-6 lg:box-border relative flex flex-col'
            : 'max-w-[1400px] mx-auto px-4 sm:px-6 pt-28 pb-12 relative'
        }`}
        style={{ zIndex: 2 }}
      >
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
              <AboutPage
                onViewWork={() => changeView('Projects')}
                onIntroActiveChange={setIntroActive}
              />
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
              className="flex-1 flex flex-col min-h-0 lg:h-full"
            >
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 auto-rows-auto lg:auto-rows-fr flex-1 min-h-0 lg:h-full"
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
                  className="lg:col-span-1 lg:row-span-1 scroll-mt-[110px] h-full min-h-0"
                >
                  <TiltCard className="h-full min-h-0"><PortraitCard /></TiltCard>
                </motion.div>
                <motion.div variants={cardVariants} className="lg:col-span-1 lg:row-span-1 h-full min-h-0">
                  <TiltCard className="h-full min-h-0"><LeetCodeStats /></TiltCard>
                </motion.div>
                <motion.div variants={cardVariants} className="lg:col-span-2 lg:row-span-1 h-full min-h-0">
                  <TiltCard className="h-full min-h-0"><SkillsCard /></TiltCard>
                </motion.div>

                {/* Row 2 */}
                <motion.div
                  id="experience"
                  style={{ scrollMarginTop: '110px' }}
                  variants={cardVariants}
                  className="lg:col-span-1 lg:row-span-1 scroll-mt-[110px] h-full min-h-0"
                >
                  <TiltCard className="h-full min-h-0"><ExperienceCard /></TiltCard>
                </motion.div>
                <motion.div
                  id="work"
                  style={{ scrollMarginTop: '110px' }}
                  variants={cardVariants}
                  className="lg:col-span-2 lg:row-span-1 scroll-mt-[110px] h-full min-h-0"
                >
                  <TiltCard className="h-full min-h-0">
                    <ProjectsCard onViewAll={() => changeView('Projects')} />
                  </TiltCard>
                </motion.div>
                <motion.div
                  id="contact"
                  style={{ scrollMarginTop: '110px' }}
                  variants={cardVariants}
                  className="lg:col-span-1 lg:row-span-1 scroll-mt-[110px] h-full min-h-0"
                >
                  <TiltCard className="h-full min-h-0"><GlobeCard /></TiltCard>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
