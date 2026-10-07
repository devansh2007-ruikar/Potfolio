import { motion } from 'framer-motion'
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
  return (
    <div className="dot-grid-bg min-h-screen relative">
      <InteractiveDotGrid />
      <InkCursorTrail />
      <Header />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-28 pb-12 relative" style={{ zIndex: 2 }}>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto"
          style={{ perspective: '1200px' }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Row 1 */}
          <motion.div variants={cardVariants} className="lg:col-span-1 lg:row-span-1">
            <TiltCard><PortraitCard /></TiltCard>
          </motion.div>
          <motion.div variants={cardVariants} className="lg:col-span-1 lg:row-span-1">
            <TiltCard><LeetCodeStats /></TiltCard>
          </motion.div>
          <motion.div variants={cardVariants} className="lg:col-span-2 lg:row-span-1">
            <TiltCard><SkillsCard /></TiltCard>
          </motion.div>

          {/* Row 2 */}
          <motion.div variants={cardVariants} className="lg:col-span-1 lg:row-span-1">
            <TiltCard><ExperienceCard /></TiltCard>
          </motion.div>
          <motion.div variants={cardVariants} className="lg:col-span-2 lg:row-span-1">
            <TiltCard><ProjectsCard /></TiltCard>
          </motion.div>
          <motion.div variants={cardVariants} className="lg:col-span-1 lg:row-span-1">
            <TiltCard><GlobeCard /></TiltCard>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
