import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DecryptText from './DecryptText'

const navItems = ['Dashboard', 'Projects', 'Community', 'AI']

export default function Header() {
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [isMuted, setIsMuted] = useState(false)
  const [speed, setSpeed] = useState(0)

  useEffect(() => {
    let lastX = null
    let lastY = null
    let currentX = null
    let currentY = null

    const onMouseMove = (e) => {
      currentX = e.clientX
      currentY = e.clientY
      if (lastX === null) {
        lastX = currentX
        lastY = currentY
      }
    }

    window.addEventListener('mousemove', onMouseMove)

    const interval = setInterval(() => {
      if (lastX !== null && currentX !== null) {
        const dx = currentX - lastX
        const dy = currentY - lastY
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Multiply distance by 10 to get pixels per second (since interval is 100ms)
        const currentSpeed = Math.round(distance * 10)
        
        // Smooth the speed, but snap to 0 instantly when stopped
        setSpeed((prev) => {
          if (currentSpeed === 0) return 0
          return Math.round(prev * 0.6 + currentSpeed * 0.4)
        })

        lastX = currentX
        lastY = currentY
      }
    }, 100)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      clearInterval(interval)
    }
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center mt-4 px-4">
      <div className="glass-nav max-w-[1100px] w-full rounded-full px-5 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Logo + Mode Toggle */}
        <div className="flex items-center gap-4">
          <span className="text-xl font-extrabold tracking-tight text-white cursor-pointer">
            <DecryptText text="Devv" />
          </span>
        </div>

        {/* Center: Nav Pill */}
        <nav className="hidden md:flex items-center bg-white/[0.04] rounded-full p-1 border border-white/[0.06]">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                activeNav === item
                  ? 'text-black'
                  : 'text-white hover:text-white/70'
              }`}
            >
              {activeNav === item && (
                <motion.div
                  layoutId="navHighlight"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item}</span>
            </button>
          ))}
        </nav>

        {/* Right: Points + Volume + Avatar */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-white/[0.1] rounded-full px-3 py-1.5 border border-white/[0.1] w-[88px] justify-center">
            <span className="text-xs font-mono text-white">{speed}</span>
            <span className="text-xs text-white/60">px/s</span>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors cursor-pointer"
          >
            <AnimatePresence mode="wait">
              {isMuted ? (
                <motion.svg
                  key="muted"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="unmuted"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 ring-2 ring-white/[0.08] flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">D</span>
          </div>
        </div>
      </div>
    </header>
  )
}
