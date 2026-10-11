export const skillGroups = [
  {
    category: 'Languages',
    accent: '#a78bfa',
    skills: ['Java', 'Python (NumPy)'],
  },
  {
    category: 'Core CS',
    accent: '#38bdf8',
    skills: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming',
      'Operating Systems',
    ],
  },
  {
    category: 'Web & Frameworks',
    accent: '#818cf8',
    skills: ['Spring Boot', 'Hibernate', 'Gradle'],
  },
  {
    category: 'Mobile',
    accent: '#34A853',
    skills: ['Android (Java)'],
  },
  {
    category: 'Databases',
    accent: '#f59e0b',
    skills: ['MySQL'],
  },
  {
    category: 'Tools',
    accent: '#f472b6',
    skills: ['Git', 'Maven', 'Vercel', 'Render', 'AI-Assisted Development'],
  },
]

export const skillCategories = {
  Backend: [
    { name: 'Java', level: 90, detail: 'Core, Collections, Multithreading' },
    { name: 'Spring Boot', level: 85, detail: 'MVC, Security, Enterprise Architecture' },
    { name: 'Hibernate', level: 80, detail: 'ORM, Entity Relational, HQL' },
    { name: 'Gradle', level: 78, detail: 'Build automation, Dependency management' },
    { name: 'MySQL', level: 85, detail: 'Query optimization, Schema design' },
  ],
  'Core CS': [
    { name: 'Data Structures & Algorithms', level: 90, detail: 'LeetCode, Graph, DP, Trees' },
    { name: 'Object-Oriented Programming', level: 92, detail: 'Design patterns, SOLID principles' },
    { name: 'Operating Systems', level: 82, detail: 'Processes, Concurrency, Memory management' },
  ],
  'Mobile & Tools': [
    { name: 'Android (Java)', level: 84, detail: 'MVVM, Room, Material 3, Offline-first' },
    { name: 'Python (NumPy)', level: 84, detail: 'Data processing, Numerical computing' },
    { name: 'Git & Maven', level: 85, detail: 'Version control, Build pipelines' },
    { name: 'Vercel & Render', level: 82, detail: 'Cloud deployments, Production hosting' },
    { name: 'AI-Assisted Development', level: 90, detail: 'Rapid prototyping, Engineering workflows' },
  ],
}

export const quickPills = [
  'Java',
  'Spring Boot',
  'Hibernate',
  'Gradle',
  'Android (Java)',
  'MySQL',
  'Python (NumPy)',
  'DSA',
  'OOP',
  'OS',
  'Git',
  'Maven',
  'Vercel',
  'Render',
  'AI-Assisted Dev',
]

export default {
  skillGroups,
  skillCategories,
  quickPills,
}
