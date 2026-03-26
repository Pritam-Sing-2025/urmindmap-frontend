import { motion } from 'framer-motion';
import { ArrowRight, LayoutTemplate, Share2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroPreview from '../components/HeroPreview';
import ThemeToggle from '../components/ThemeToggle';

const featureCards = [
  {
    icon: Sparkles,
    title: 'AI-powered structure',
    description: 'Turn messy paragraphs into clean branches and supporting points in seconds.'
  },
  {
    icon: LayoutTemplate,
    title: 'Interactive canvas',
    description: 'Drag nodes, collapse branches, zoom freely, and auto-fit the layout.'
  },
  {
    icon: Share2,
    title: 'Export and share',
    description: 'Download as PNG, save locally, export JSON, or copy a shareable link.'
  }
];

export default function LandingPage({ theme, onToggleTheme }) {
  return (
    <div className="relative overflow-hidden px-4 pb-16 pt-6 sm:px-6 lg:px-10">
      <div className="absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),_transparent_40%)]" />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2563eb_0%,#0ea5e9_55%,#14b8a6_100%)] text-white shadow-[0_18px_40px_rgba(14,165,233,0.22)]">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="font-display text-xl font-bold">MindMap AI</div>
            <div className="text-sm text-[color:var(--text-muted)]">
              Showcase-ready note visualization
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#2563eb_0%,#0ea5e9_55%,#14b8a6_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(14,165,233,0.22)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            Try Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      <main className="mx-auto mt-14 grid w-full max-w-7xl gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-[color:var(--text-muted)] backdrop-blur-xl">
            <Sparkles size={16} />
            AI-powered knowledge visualization
          </div>

          <h1 className="max-w-3xl font-display text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            Turn Your Notes into <span className="gradient-text">Visual Mind Maps</span> Using AI
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--text-muted)]">
            Paste raw notes, click generate, and watch them become an interactive
            mind map with fluid motion, bold gradients, and polished export tools.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-[22px] bg-[linear-gradient(135deg,#2563eb_0%,#0ea5e9_55%,#14b8a6_100%)] px-6 py-4 text-base font-semibold text-white shadow-[0_22px_50px_rgba(14,165,233,0.26)] transition-transform duration-300 hover:-translate-y-1"
            >
              Try Now
              <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="glass-panel inline-flex items-center gap-2 rounded-[22px] px-6 py-4 text-base font-semibold text-[color:var(--text-strong)] transition-transform duration-300 hover:-translate-y-1"
            >
              Explore Features
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {['Interactive React Flow canvas', 'PNG + JSON export', 'Shareable map links'].map(
              (item) => (
                <div
                  key={item}
                  className="glass-panel rounded-[24px] px-4 py-4 text-sm font-medium text-[color:var(--text-strong)]"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </motion.div>

        <HeroPreview />
      </main>

      <section id="features" className="mx-auto mt-20 w-full max-w-7xl">
        <div className="mb-8">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--text-muted)]">
            Why it feels premium
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold">
            Designed to look strong in demos and screenshots
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featureCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="glass-panel-strong mesh-background rounded-[30px] p-6"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(37,99,235,0.12)] text-sky-600">
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-2xl font-bold">{card.title}</h3>
                <p className="mt-3 text-base leading-7 text-[color:var(--text-muted)]">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
