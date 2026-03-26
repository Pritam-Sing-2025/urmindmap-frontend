import { motion } from 'framer-motion';

const previewNodes = [
  {
    title: 'Benefits',
    subtitle: 'Study faster',
    color: '#2563eb',
    style: { top: '17%', left: '10%' }
  },
  {
    title: 'Use Cases',
    subtitle: 'Meetings, classes',
    color: '#14b8a6',
    style: { top: '20%', right: '8%' }
  },
  {
    title: 'Output',
    subtitle: 'Drag, zoom, export',
    color: '#f97316',
    style: { bottom: '16%', left: '16%' }
  },
  {
    title: 'Sharing',
    subtitle: 'Save and link',
    color: '#8b5cf6',
    style: { bottom: '18%', right: '12%' }
  }
];

export default function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="glass-panel-strong mesh-background relative aspect-[1.08/1] w-full overflow-hidden rounded-[36px] p-6"
    >
      <div className="dot-grid absolute inset-0 opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.18),_transparent_38%)]" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 600 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M300 240C240 180 170 150 120 120" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
        <path d="M300 240C360 180 430 150 490 132" stroke="#14b8a6" strokeWidth="4" strokeLinecap="round" opacity="0.72" />
        <path d="M300 240C240 300 190 338 144 382" stroke="#f97316" strokeWidth="4" strokeLinecap="round" opacity="0.72" />
        <path d="M300 240C364 288 420 328 468 378" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
      </svg>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.55 }}
        className="absolute left-1/2 top-1/2 z-10 w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-white/30 bg-[rgba(14,165,233,0.16)] px-6 py-5 text-center shadow-[0_24px_60px_rgba(14,165,233,0.16)] backdrop-blur-xl"
      >
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--text-muted)]">
          Main Topic
        </div>
        <h3 className="font-display text-2xl font-bold text-[color:var(--text-strong)]">
          AI Notes
        </h3>
        <p className="mt-2 text-sm text-[color:var(--text-muted)]">
          Visual mind map generated from raw text
        </p>
      </motion.div>

      {previewNodes.map((node, index) => (
        <motion.div
          key={node.title}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + index * 0.08, duration: 0.45 }}
          className="absolute z-10 w-[180px] rounded-[24px] border border-white/25 px-4 py-3 backdrop-blur-xl"
          style={{
            ...node.style,
            background: `${node.color}14`,
            boxShadow: `0 18px 50px ${node.color}24`
          }}
        >
          <div
            className="mb-3 h-1.5 w-14 rounded-full"
            style={{ backgroundColor: node.color }}
          />
          <div className="font-display text-lg font-semibold text-[color:var(--text-strong)]">
            {node.title}
          </div>
          <div className="mt-1 text-sm text-[color:var(--text-muted)]">{node.subtitle}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

