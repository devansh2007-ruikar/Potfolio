export const projects = [
  {
    id: 'mithya',
    caseId: 'CASE-001',
    title: 'MITHYA',
    subtitle: 'Crypto-Forensics & Triage Engine',
    badge: 'SIH 2026',
    badgeColor: 'border-amber-500/30 bg-amber-500/15 text-amber-300',
    year: '2026',
    status: 'Award',
    accent: '#f59e0b',
    description:
      'Offline, air-gapped forensics engine that ingests CSV/JSON/XML data, clusters wallet entities, and traces multi-hop fund flows through a 6-tab Streamlit dashboard.',
    keyPoints: [
      'Fused Isolation Forest, calibrated Random Forest & graph taint propagation for unified risk scoring (~1,500 tx/s).',
      'Generated court-ready PDF/JSON dossiers with SHA-256 provenance and XXE-safe parsing (87-test pytest suite).',
    ],
    tech: ['Python', 'Streamlit', 'Scikit-learn', 'NumPy', 'Pandas', 'NetworkX'],
    linkText: 'GitHub',
    linkUrl: 'https://github.com',
  },
  {
    id: '3d-web',
    caseId: 'CASE-002',
    title: '3D Animated Website',
    subtitle: 'Interactive 3D Experience & AI Tooling',
    badge: '3D Web',
    badgeColor: 'border-violet-500/30 bg-violet-500/15 text-violet-300',
    year: '2025',
    status: 'Deployed',
    accent: '#a78bfa',
    description:
      'Interactive 3D web experience blending modern web animation architecture with AI-assisted tooling for design and creative production.',
    keyPoints: [
      'Built spatial 3D interactivity, perspective card tilting, and fluid canvas interactions.',
      'Integrated AI-assisted creative workflows for content generation and responsive UI layout.',
    ],
    tech: ['React', 'Three.js', 'Tailwind CSS', 'Framer Motion', 'WebGL'],
    linkText: 'View Project',
    linkUrl: '#',
  },
]

export default projects
