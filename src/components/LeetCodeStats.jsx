import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const USERNAME = 'devanshruikar2007'
const SOLVED_API = `https://alfa-leetcode-api.onrender.com/${USERNAME}/solved`
const PROFILE_API = `https://alfa-leetcode-api.onrender.com/${USERNAME}`

/* Fallback data in case the API is slow / down */
const FALLBACK = {
  totalSolved: 14,
  easySolved: 4,
  mediumSolved: 7,
  hardSolved: 3,
  totalEasy: 867,
  totalMedium: 1822,
  totalHard: 793,
  acceptanceRate: 44.4,
  ranking: 5000001,
}

const DIFFICULTY = [
  { key: 'easy',   label: 'Easy',   color: '#00b8a3', solvedKey: 'easySolved',   totalKey: 'totalEasy'   },
  { key: 'medium', label: 'Medium', color: '#ffc01e', solvedKey: 'mediumSolved', totalKey: 'totalMedium' },
  { key: 'hard',   label: 'Hard',   color: '#ff375f', solvedKey: 'hardSolved',   totalKey: 'totalHard'   },
]

/* ─── Skeleton Pulse ─── */
function Skeleton({ className = '' }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{ background: 'rgba(255,255,255,0.06)' }}
    />
  )
}

function SkeletonLoader() {
  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <Skeleton className="w-36 h-4" />
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <Skeleton className="w-24 h-14" />
        <Skeleton className="w-44 h-3" />
      </div>
      <div className="flex gap-4 justify-center">
        <Skeleton className="w-20 h-8 rounded-full" />
        <Skeleton className="w-28 h-8 rounded-full" />
      </div>
      <div className="flex flex-col gap-3 mt-2">
        <Skeleton className="w-full h-5 rounded-full" />
        <Skeleton className="w-full h-5 rounded-full" />
        <Skeleton className="w-full h-5 rounded-full" />
      </div>
    </div>
  )
}

/* ─── Progress Bar ─── */
function ProgressBar({ label, solved, total, color, delay }) {
  const pct = total > 0 ? (solved / total) * 100 : 0

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium" style={{ color }}>{label}</span>
        <span className="text-gray-400 tabular-nums">
          {solved}<span className="text-gray-600">/{total}</span>
        </span>
      </div>
      <div
        className="relative h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: `0 0 12px ${color}55`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay }}
        />
      </div>
    </div>
  )
}

/* ─── LeetCode Icon (inline SVG) ─── */
function LeetCodeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4 text-[#ffa116]"
    >
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414 0-1.955a1.378 1.378 0 0 0-1.951 0l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  )
}

/* ─── Main Component ─── */
export default function LeetCodeStats() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    async function fetchStats() {
      try {
        // Fetch solved stats and profile in parallel
        const [solvedRes, profileRes] = await Promise.all([
          fetch(SOLVED_API, { signal: controller.signal }),
          fetch(PROFILE_API, { signal: controller.signal }),
        ])

        if (!solvedRes.ok || !profileRes.ok) throw new Error('API error')

        const [solved, profile] = await Promise.all([
          solvedRes.json(),
          profileRes.json(),
        ])

        // Calculate acceptance rate from submission data
        const allSubmissions = solved.totalSubmissionNum?.find(s => s.difficulty === 'All')
        const allAccepted = solved.acSubmissionNum?.find(s => s.difficulty === 'All')
        const acceptanceRate = allSubmissions?.submissions > 0
          ? ((allAccepted?.submissions || 0) / allSubmissions.submissions * 100)
          : FALLBACK.acceptanceRate

        if (!cancelled) {
          setData({
            totalSolved: solved.solvedProblem ?? FALLBACK.totalSolved,
            easySolved: solved.easySolved ?? FALLBACK.easySolved,
            mediumSolved: solved.mediumSolved ?? FALLBACK.mediumSolved,
            hardSolved: solved.hardSolved ?? FALLBACK.hardSolved,
            totalEasy: FALLBACK.totalEasy,
            totalMedium: FALLBACK.totalMedium,
            totalHard: FALLBACK.totalHard,
            acceptanceRate: Math.round(acceptanceRate * 10) / 10,
            ranking: profile.ranking ?? FALLBACK.ranking,
          })
          setLoading(false)
        }
      } catch {
        // On any failure, use fallback data so the widget always renders
        if (!cancelled) {
          setData(FALLBACK)
          setLoading(false)
        }
      }
    }

    fetchStats()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="bento-card h-full min-h-[420px]">
        <SkeletonLoader />
      </div>
    )
  }

  /* ── Data Loaded ── */
  const { totalSolved, acceptanceRate, ranking } = data

  return (
    <div className="bento-card h-full min-h-[420px] flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <LeetCodeIcon />
        <span className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
          LeetCode Stats
        </span>
      </div>

      {/* Main Stat */}
      <AnimatePresence>
        <motion.div
          className="flex-1 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="text-6xl font-extrabold text-white tabular-nums leading-none"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {totalSolved}
          </motion.span>
          <span className="text-xs text-gray-500 mt-2 tracking-wide">
            Total Questions Solved
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Secondary Stats Row */}
      <motion.div
        className="flex items-center justify-center gap-3 mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span className="text-gray-400">Acceptance</span>
          <span className="font-semibold text-white">{acceptanceRate}%</span>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span className="text-gray-400">Rank</span>
          <span className="font-semibold text-white">
            #{typeof ranking === 'number' ? ranking.toLocaleString() : ranking}
          </span>
        </div>
      </motion.div>

      {/* Progress Bars */}
      <motion.div
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {DIFFICULTY.map((d, i) => (
          <ProgressBar
            key={d.key}
            label={d.label}
            solved={data[d.solvedKey]}
            total={data[d.totalKey]}
            color={d.color}
            delay={0.5 + i * 0.15}
          />
        ))}
      </motion.div>
    </div>
  )
}
