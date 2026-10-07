import { motion, useTransform } from 'framer-motion'

function StatementItem({
  statement,
  p,
  range,
  chip,
  shouldReduceMotion,
}) {
  const [start, enterEnd, exitStart, end] = range

  // 3D rotation, translation, opacity, and blur transforms
  const rotateX = useTransform(
    p,
    [start, enterEnd, exitStart, end],
    [70, 0, 0, -60]
  )
  const y = useTransform(p, [start, enterEnd, exitStart, end], [80, 0, 0, -80])
  const opacity = useTransform(
    p,
    [start, enterEnd, exitStart, end],
    [0, 1, 1, 0]
  )
  const blurVal = useTransform(
    p,
    [start, enterEnd, exitStart, end],
    [10, 0, 0, 8]
  )
  const filter = useTransform(blurVal, (v) => `blur(${v}px)`)

  // Parallax Chip (moves 1.4x faster)
  const chipX = useTransform(p, [start, enterEnd, exitStart, end], [120, 0, 0, -90])
  const chipOpacity = useTransform(
    p,
    [start, enterEnd, exitStart, end],
    [0, 1, 1, 0]
  )

  const pointerEvents = useTransform(p, (v) =>
    v >= enterEnd - 0.01 && v <= exitStart + 0.01 ? 'auto' : 'none'
  )

  if (shouldReduceMotion) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-4">
        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
          {statement}
        </h2>
        <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-mono border border-white/15 bg-white/5 text-zinc-300">
          {chip}
        </span>
      </div>
    )
  }

  return (
    <motion.div
      style={{
        rotateX,
        y,
        opacity,
        filter,
        pointerEvents,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:pl-[10vw] max-w-5xl select-none will-change-[transform,opacity,filter]"
    >
      <div className="flex flex-col items-start gap-4 sm:gap-6">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-tight sm:leading-none">
          {statement}
        </h2>

        {/* Parallax Floating Chip */}
        <motion.div
          style={{
            x: chipX,
            opacity: chipOpacity,
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-xs sm:text-sm font-mono text-zinc-300 shadow-xl"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          <span>{chip}</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function SceneStatements({ p, shouldReduceMotion }) {
  // Background drifting blob
  const blobX = useTransform(p, [0.56, 0.84], [-80, 80])
  const blobY = useTransform(p, [0.56, 0.84], [50, -50])
  const blobOpacity = useTransform(
    p,
    [0.56, 0.6, 0.82, 0.85],
    [0, 0.15, 0.15, 0]
  )

  const overallOpacity = useTransform(
    p,
    [0.56, 0.58, 0.83, 0.85],
    [0, 1, 1, 0]
  )
  const pointerEvents = useTransform(p, (v) =>
    v >= 0.56 && v <= 0.85 ? 'auto' : 'none'
  )

  // Progress indicators for the 3 statements
  const bar1Scale = useTransform(p, [0.58, 0.665], [0, 1])
  const bar2Scale = useTransform(p, [0.665, 0.75], [0, 1])
  const bar3Scale = useTransform(p, [0.75, 0.83], [0, 1])

  const counter1 = useTransform(p, (v) => (v < 0.665 ? 1 : 0))
  const counter2 = useTransform(p, (v) => (v >= 0.665 && v < 0.75 ? 1 : 0))
  const counter3 = useTransform(p, (v) => (v >= 0.75 ? 1 : 0))

  return (
    <motion.div
      style={{
        opacity: overallOpacity,
        pointerEvents,
      }}
      className="absolute inset-0 z-20 flex items-center select-none will-change-[opacity]"
    >
      {/* Background drifting glow blob */}
      <motion.div
        aria-hidden="true"
        style={{
          x: blobX,
          y: blobY,
          opacity: blobOpacity,
        }}
        className="absolute top-1/3 left-1/4 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-amber-500 blur-3xl pointer-events-none"
      />

      {/* 3 Statements with 3D Flip */}
      <div className="relative w-full h-full">
        {shouldReduceMotion ? (
          <div className="h-full flex flex-col justify-center px-6 sm:px-12 md:pl-[10vw] max-w-5xl space-y-6">
            <StatementItem
              statement={
                <>
                  I write{' '}
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent font-bold">
                    Java & Spring Boot
                  </span>
                  .
                </>
              }
              chip="30+ LeetCode solved"
              p={p}
              range={[0.58, 0.61, 0.635, 0.665]}
              shouldReduceMotion={shouldReduceMotion}
            />
            <StatementItem
              statement={
                <>
                  I build{' '}
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent font-bold">
                    interactive web experiences
                  </span>
                  .
                </>
              }
              chip="3D · Motion · UI"
              p={p}
              range={[0.665, 0.695, 0.72, 0.75]}
              shouldReduceMotion={shouldReduceMotion}
            />
            <StatementItem
              statement={
                <>
                  I make{' '}
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent font-bold">
                    videos
                  </span>{' '}
                  about tech.
                </>
              }
              chip="2 YouTube channels"
              p={p}
              range={[0.75, 0.78, 0.81, 0.835]}
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>
        ) : (
          <>
            <StatementItem
              statement={
                <>
                  I write{' '}
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent font-bold">
                    Java & Spring Boot
                  </span>
                  .
                </>
              }
              chip="30+ LeetCode solved"
              p={p}
              range={[0.58, 0.61, 0.635, 0.665]}
              shouldReduceMotion={shouldReduceMotion}
            />

            <StatementItem
              statement={
                <>
                  I build{' '}
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent font-bold">
                    interactive web experiences
                  </span>
                  .
                </>
              }
              chip="3D · Motion · UI"
              p={p}
              range={[0.665, 0.695, 0.72, 0.75]}
              shouldReduceMotion={shouldReduceMotion}
            />

            <StatementItem
              statement={
                <>
                  I make{' '}
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent font-bold">
                    videos
                  </span>{' '}
                  about tech.
                </>
              }
              chip="2 YouTube channels"
              p={p}
              range={[0.75, 0.78, 0.81, 0.835]}
              shouldReduceMotion={shouldReduceMotion}
            />
          </>
        )}
      </div>

      {/* Right Edge Progress Indicator */}
      {!shouldReduceMotion && (
        <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <div className="flex flex-col gap-2">
            {/* Bar 1 */}
            <div className="w-1 h-8 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                style={{ scaleY: bar1Scale }}
                className="w-full h-full bg-gradient-to-b from-violet-400 to-amber-400 origin-top"
              />
            </div>
            {/* Bar 2 */}
            <div className="w-1 h-8 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                style={{ scaleY: bar2Scale }}
                className="w-full h-full bg-gradient-to-b from-violet-400 to-amber-400 origin-top"
              />
            </div>
            {/* Bar 3 */}
            <div className="w-1 h-8 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                style={{ scaleY: bar3Scale }}
                className="w-full h-full bg-gradient-to-b from-violet-400 to-amber-400 origin-top"
              />
            </div>
          </div>

          <div className="relative text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1 w-12 text-center h-4">
            <motion.span style={{ opacity: counter1 }} className="absolute inset-0">
              01 / 03
            </motion.span>
            <motion.span style={{ opacity: counter2 }} className="absolute inset-0">
              02 / 03
            </motion.span>
            <motion.span style={{ opacity: counter3 }} className="absolute inset-0">
              03 / 03
            </motion.span>
          </div>
        </div>
      )}
    </motion.div>
  )
}
