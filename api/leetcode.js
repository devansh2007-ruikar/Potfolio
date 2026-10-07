import { LEETCODE_GRAPHQL_QUERY, mapLeetCodeResponse } from '../src/lib/leetcode.js'

export { LEETCODE_GRAPHQL_QUERY, mapLeetCodeResponse }

export default async function handler(req, res) {
  const username = req.query?.username || 'devanshruikar2007'

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: LEETCODE_GRAPHQL_QUERY,
        variables: { username },
      }),
    })

    if (!response.ok) {
      return res.status(502).json({ error: `LeetCode responded with status ${response.status}` })
    }

    const json = await response.json()
    if (json.errors) {
      return res.status(502).json({ error: json.errors[0]?.message || 'GraphQL query error' })
    }

    const cleanData = mapLeetCodeResponse(json.data)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    return res.status(200).json(cleanData)
  } catch (error) {
    return res.status(502).json({ error: error?.message || 'Failed to fetch LeetCode stats' })
  }
}
