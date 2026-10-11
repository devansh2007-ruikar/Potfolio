import { motion } from 'framer-motion'
import { useMusic } from '../context/useMusic'

export default function MobileNav({ activeNav, onNavChange }) {
  const { enterAboutMe } = useMusic()

  const tabs = [
    {
      name: 'Dashboard',
      icon: (
        <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      name: 'Projects',
      icon: (
        <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
    {
      name: 'About Me',
      icon: (
        <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]

  const handleTabClick = (item) => {
    if (item === 'About Me') {
      enterAboutMe()
    }
    onNavChange?.(item)
  }

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-3 left-3 right-3 z-50 h-[60px] max-md:backdrop-blur-none max-md:bg-black/92 bg-black/85 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-around px-2 shadow-2xl pb-[env(safe-area-inset-bottom,0px)]"
      style={{
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 255, 255, 0.05)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeNav === tab.name
        return (
          <button
            key={tab.name}
            type="button"
            onClick={() => handleTabClick(tab.name)}
            aria-label={tab.name}
            className={`relative flex-1 h-[46px] min-w-[44px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer select-none ${
              isActive ? 'text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="mobileNavHighlight"
                className="absolute inset-0 bg-white rounded-xl shadow-md"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex flex-col items-center justify-center gap-0.5">
              {tab.icon}
              <span className="text-[10px] font-medium leading-none tracking-tight">
                {tab.name}
              </span>
            </span>
          </button>
        )
      })}
    </nav>
  )
}
