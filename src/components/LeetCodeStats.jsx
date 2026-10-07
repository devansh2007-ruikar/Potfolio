import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import { fetchLeetCodeStats } from '../lib/leetcode.js'

const CACHE_KEY = 'lc-stats'

function getCachedStats() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveCachedStats(stats) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(stats))
  } catch {
    // Ignore storage quota/disabled errors
  }
}

function formatTimeAgo(updatedAt) {
  if (!updatedAt) return ''
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(updatedAt).getTime()) / 1000))
  if (diffSec < 60) return `${diffSec}s ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  return `${diffHr}h ago`
}

function formatCachedLabel(updatedAt) {
  if (!updatedAt) return 'cached'
  const diffMs = Date.now() - new Date(updatedAt).getTime()
  const diffMin = Math.max(1, Math.floor(diffMs / 60000))
  return `cached · ${diffMin} min ago`
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
  const [data, setData] = useState(getCachedStats)
  const [loading, setLoading] = useState(() => !getCachedStats())
  const [hasError, setHasError] = useState(false)
  const [fetchFailed, setFetchFailed] = useState(false)
  const [, setTicker] = useState(0)

  const isFetchingRef = useRef(false)
  const countMotion = useMotionValue(0)
  const [displayCount, setDisplayCount] = useState(0)

  // Count-up animation from old value to new value
  useEffect(() => {
    if (data?.totalSolved != null) {
      const controls = animate(countMotion, data.totalSolved, {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (latest) => {
          setDisplayCount(Math.round(latest))
        },
      })
      return () => controls.stop()
    }
  }, [data?.totalSolved, countMotion])

  // Periodic ticker for relative time ("Updated Xs ago")
  useEffect(() => {
    const timer = setInterval(() => {
      setTicker((t) => t + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const loadStats = useCallback(async (isRetry = false) => {
    if (isFetchingRef.current && !isRetry) return
    isFetchingRef.current = true

    if (isRetry) {
      setLoading(true)
      setHasError(false)
    }

    try {
      const freshData = await fetchLeetCodeStats()
      saveCachedStats(freshData)
      setData(freshData)
      setFetchFailed(false)
      setHasError(false)
    } catch (err) {
      console.error('LeetCode fetch error:', err)
      setFetchFailed(true)
      setData((prev) => {
        if (!prev) {
          setHasError(true)
        }
        return prev
      })
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }, [])

  // Auto-refresh every 5 minutes while visible + refetch on tab visibility change
  useEffect(() => {
    loadStats()

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadStats()
      }
    }, 5 * 60 * 1000)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadStats()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [loadStats])

  /* ── Loading State (when no cache exists) ── */
  if (loading && !data) {
    return (
      <div className="bento-card h-full min-h-[420px]">
        <SkeletonLoader />
      </div>
    )
  }

  /* ── Error State (when fetch failed and no cache exists) ── */
  if (hasError && !data) {
    return (
      <div className="bento-card h-full min-h-[420px] flex flex-col p-6">
        <div className="flex items-center gap-2">
          <LeetCodeIcon />
          <span className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
            LeetCode Stats
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-300">Couldn't reach LeetCode</p>
          <p className="text-xs text-gray-500 max-w-[220px]">
            Unable to fetch live statistics at the moment.
          </p>
          <button
            onClick={() => loadStats(true)}
            className="mt-2 px-4 py-1.5 text-xs font-mono rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  /* ── Data Loaded (or Cached) ── */
  const { acceptanceRate, ranking, updatedAt } = data
  const timeAgo = formatTimeAgo(updatedAt)

  return (
    <div className="bento-card h-full min-h-[420px] flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <LeetCodeIcon />
          <span className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
            LeetCode Stats
          </span>
        </div>

        <div className="flex items-center gap-2">
          {fetchFailed ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-400">
              <span className="inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
              <span>{formatCachedLabel(updatedAt)}</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span className="font-semibold tracking-wider">LIVE</span>
              </div>
              {timeAgo && (
                <span className="text-[10px] text-gray-500 font-mono">
                  Updated {timeAgo}
                </span>
              )}
            </>
          )}
        </div>
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
            {displayCount}
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
            solved={data[d.solvedKey] ?? 0}
            total={data[d.totalKey] ?? 0}
            color={d.color}
            delay={0.5 + i * 0.15}
          />
        ))}
      </motion.div>
    </div>
  )
}
