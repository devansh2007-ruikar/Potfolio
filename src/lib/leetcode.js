export const LEETCODE_GRAPHQL_QUERY = `
  query($username: String!) {
    allQuestionsCount { difficulty count }
    matchedUser(username: $username) {
      profile { ranking }
      submitStatsGlobal {
        acSubmissionNum { difficulty count submissions }
        totalSubmissionNum { difficulty count submissions }
      }
    }
  }
`

export function mapLeetCodeResponse(data) {
  if (!data?.matchedUser) {
    throw new Error('User not found or matchedUser is null')
  }

  const allQuestions = data.allQuestionsCount || []
  const submitStats = data.matchedUser.submitStatsGlobal || {}
  const acSubmissions = submitStats.acSubmissionNum || []
  const totalSubmissions = submitStats.totalSubmissionNum || []

  const getCount = (arr, diff) => arr.find((item) => item.difficulty === diff)?.count || 0
  const getSubmissions = (arr, diff) => arr.find((item) => item.difficulty === diff)?.submissions || 0

  const totalQuestions = getCount(allQuestions, 'All')
  const totalEasy = getCount(allQuestions, 'Easy')
  const totalMedium = getCount(allQuestions, 'Medium')
  const totalHard = getCount(allQuestions, 'Hard')

  const totalSolved = getCount(acSubmissions, 'All')
  const easySolved = getCount(acSubmissions, 'Easy')
  const mediumSolved = getCount(acSubmissions, 'Medium')
  const hardSolved = getCount(acSubmissions, 'Hard')

  const acAllSubs = getSubmissions(acSubmissions, 'All')
  const totalAllSubs = getSubmissions(totalSubmissions, 'All')

  const acceptanceRate =
    totalAllSubs > 0 ? Math.round((acAllSubs / totalAllSubs) * 1000) / 10 : 0

  const ranking = data.matchedUser.profile?.ranking || 0

  return {
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    totalEasy,
    totalMedium,
    totalHard,
    totalQuestions,
    acceptanceRate,
    ranking,
    updatedAt: new Date().toISOString(),
  }
}

export async function fetchLeetCodeStats(username = 'devanshruikar2007') {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    if (import.meta.env?.DEV) {
      const response = await fetch('/lc-graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: LEETCODE_GRAPHQL_QUERY,
          variables: { username },
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`LeetCode proxy returned ${response.status}`)
      }

      const json = await response.json()
      if (json.errors && json.errors.length > 0) {
        throw new Error(json.errors[0]?.message || 'GraphQL error')
      }

      return mapLeetCodeResponse(json.data)
    } else {
      const url = username
        ? `/api/leetcode?username=${encodeURIComponent(username)}`
        : '/api/leetcode'

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      })

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null)
        throw new Error(errorJson?.error || `API returned ${response.status}`)
      }

      return await response.json()
    }
  } finally {
    clearTimeout(timeoutId)
  }
}
