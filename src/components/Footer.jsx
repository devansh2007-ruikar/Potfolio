import { links } from '../data/links'

export default function Footer({ isDashboard = false }) {
  const socialLinks = [
    {
      name: 'GitHub',
      href: links.github,
      hoverColor: 'hover:text-white hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: links.linkedin,
      hoverColor: 'hover:text-[#0a66c2] hover:border-[#0a66c2]/40 hover:shadow-[0_0_15px_rgba(10,102,194,0.35)]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: links.instagram,
      hoverColor: 'hover:text-[#e1306c] hover:border-[#e1306c]/40 hover:shadow-[0_0_15px_rgba(225,48,108,0.35)]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: links.youtube,
      hoverColor: 'hover:text-[#ff0000] hover:border-[#ff0000]/40 hover:shadow-[0_0_15px_rgba(255,0,0,0.35)]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'Email',
      href: `mailto:${links.email}`,
      hoverColor: 'hover:text-emerald-400 hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(52,211,153,0.35)]',
      icon: (
        <svg className="w-4 h-4 fill-none viewBox" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  return (
    <footer
      className={`w-full relative z-20 ${
        isDashboard
          ? 'pt-3 pb-2 lg:pt-2 lg:pb-1 mt-auto border-t border-white/[0.06]'
          : 'pt-8 pb-12 mt-12 border-t border-white/[0.08]'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        {/* Left: Copyright */}
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="text-white font-semibold">© 2026 Devansh Ruikar</span>
          <span className="text-zinc-600 hidden sm:inline">·</span>
          <span className="text-zinc-500 hidden sm:inline">Nagpur, India</span>
        </div>

        {/* Right: Icon buttons with brand hover glows */}
        <div className="flex items-center gap-2">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target={item.name === 'Email' ? undefined : '_blank'}
              rel={item.name === 'Email' ? undefined : 'noopener noreferrer'}
              title={item.name}
              aria-label={item.name}
              className={`w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-zinc-400 transition-all duration-200 cursor-pointer ${item.hoverColor}`}
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
