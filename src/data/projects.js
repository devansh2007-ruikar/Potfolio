export const projects = [
  {
    id: 'gdg-platform',
    caseId: 'CASE-001',
    title: 'GDG Event Platform',
    subtitle: 'Event Management & Registration Platform',
    badge: 'Full-Stack',
    badgeColor: 'border-blue-500/30 bg-blue-500/15 text-blue-300',
    status: 'Deployed',
    year: '2026',
    accent: '#4285F4',
    description:
      'Full-stack event platform deployed on Vercel + Render + Neon, with JWT auth, role-based admin/user access, event CRUD and capacity-limited registrations, documented with Swagger.',
    keyPoints: [
      'Prevented overbooking with transactional seat allocation, verified by a concurrency test (52 Jest tests).',
      'Added QR tickets, admin analytics, cron reminders, rate limiting and Docker.',
    ],
    tech: [
      'Node.js',
      'Express',
      'Prisma',
      'PostgreSQL (Neon)',
      'React',
      'Vite',
      'JWT',
      'Zod',
      'Jest',
      'Docker',
    ],
    links: [
      { label: 'Live', url: 'https://gdg-iota-inky.vercel.app' },
      { label: 'API Docs', url: 'https://gdg-oz97.onrender.com/api/docs' },
      { label: 'GitHub', url: 'https://github.com/devansh2007-ruikar/GDG' },
    ],
  },
  {
    id: 'habittracker',
    caseId: 'CASE-002',
    title: 'HabitTracker',
    subtitle: 'Offline-First Android App',
    badge: 'Android',
    badgeColor: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300',
    status: 'Completed',
    year: '2026',
    accent: '#34A853',
    description:
      'Offline-first Android habit and to-do tracker in Java using MVVM + Repository, Room with versioned migrations and Material 3, with streaks, statistics and a home-screen widget.',
    keyPoints: [
      'Reliable AlarmManager reminders that reschedule after reboot.',
      'Streak/stats logic isolated in a pure-Java core module covered by JUnit tests.',
    ],
    tech: [
      'Java',
      'Android SDK',
      'Room',
      'MVVM',
      'Material 3',
      'AlarmManager',
      'JUnit',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/devansh2007-ruikar/HabitTracker' },
    ],
  },
  {
    id: 'gdg-landing',
    caseId: 'CASE-003',
    title: 'GDG RBU Landing Page',
    subtitle: 'Figma to Code',
    badge: 'Frontend',
    badgeColor: 'border-amber-500/30 bg-amber-500/15 text-amber-300',
    status: 'Deployed',
    year: '2026',
    accent: '#FBBC04',
    description:
      'Converted a Figma design into a responsive, animated landing page with dark mode, events, team and FAQ sections, an AI chatbot, and links into the live event platform.',
    keyPoints: [
      'Pixel-faithful Figma-to-code build with dark mode and animations.',
      'Integrated an AI chatbot and deep links into the event platform.',
    ],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    links: [
      { label: 'Live', url: 'https://gdg-frontend-rho.vercel.app' },
      { label: 'GitHub', url: 'https://github.com/devansh2007-ruikar/GDG-Frontend' },
    ],
  },
  {
    id: 'portfolio',
    caseId: 'CASE-004',
    title: 'Personal Portfolio',
    subtitle: 'This website',
    badge: 'Web',
    badgeColor: 'border-violet-500/30 bg-violet-500/15 text-violet-300',
    status: 'Deployed',
    year: '2026',
    accent: '#a78bfa',
    description:
      'Designed and deployed a responsive personal portfolio showcasing my projects, skills and contact links, with smooth animations and link previews.',
    keyPoints: [
      'Case-file project system with shared-layout animations.',
      'Live LeetCode stats through a Vercel serverless function.',
    ],
    tech: ['React', 'Vite', 'Framer Motion', 'Vercel'],
    links: [
      { label: 'Live', url: 'https://devansh-ruikar.vercel.app' },
      { label: 'GitHub', url: 'https://github.com/devansh2007-ruikar/Potfolio' },
    ],
  },
  {
    id: 'mithya',
    caseId: 'CASE-005',
    title: 'MITHYA',
    subtitle: 'Crypto-Forensics & Triage Engine',
    badge: 'SIH 2026',
    badgeColor: 'border-amber-500/30 bg-amber-500/15 text-amber-300',
    status: 'Award',
    year: '2026',
    accent: '#f59e0b',
    description:
      'Offline, air-gapped crypto-forensics engine that ingests CSV/JSON/XML transaction data, clusters wallet entities and traces multi-hop fund flows through a 6-tab Streamlit dashboard.',
    keyPoints: [
      'Fused Isolation Forest, Random Forest, heuristics and graph taint propagation into one risk score (~1,500 tx/sec).',
      'Court-ready PDF/JSON evidence dossiers with SHA-256 provenance, validated by an 87-test pytest suite.',
    ],
    tech: [
      'Python',
      'Streamlit',
      'Scikit-learn',
      'NumPy',
      'Pandas',
      'NetworkX',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/devansh2007-ruikar/SIH' },
    ],
  },
]

export default projects
