import {
  Brain,
  Code,
  Download,
  Eraser,
  Play,
  Save,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function ActionButton({ children, onClick, disabled, variant = 'secondary' }) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-50';

  const variantClasses =
    variant === 'primary'
      ? 'bg-[linear-gradient(135deg,#2563eb_0%,#0ea5e9_55%,#14b8a6_100%)] text-white shadow-[0_18px_40px_rgba(14,165,233,0.28)] hover:-translate-y-0.5'
      : 'glass-panel text-[color:var(--text-strong)] hover:-translate-y-0.5';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses}`}
    >
      {children}
    </button>
  );
}

export default function TopBar({
  theme,
  onToggleTheme,
  onGenerate,
  onClear,
  onExportPng,
  onSave,
  onShare,
  onExportJson,
  isLoading
}) {
  return (
    <div className="glass-panel-strong flex flex-col gap-4 rounded-[30px] p-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2563eb_0%,#0ea5e9_55%,#14b8a6_100%)] text-white shadow-[0_18px_40px_rgba(14,165,233,0.22)]"
        >
          <Brain size={20} />
        </Link>

        <div>
          <div className="font-display text-xl font-bold text-[color:var(--text-strong)]">
            AI Notes to Mind Map Generator
          </div>
          <div className="text-sm text-[color:var(--text-muted)]">
            Turn your notes into visual mind maps using AI
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ActionButton onClick={onGenerate} disabled={isLoading} variant="primary">
          <Play size={16} />
          {isLoading ? 'Generating...' : 'Generate'}
        </ActionButton>
        <ActionButton onClick={onClear} disabled={isLoading}>
          <Eraser size={16} />
          Clear
        </ActionButton>
        <ActionButton onClick={onExportPng} disabled={isLoading}>
          <Download size={16} />
          Export PNG
        </ActionButton>
        <ActionButton onClick={onSave} disabled={isLoading}>
          <Save size={16} />
          Save
        </ActionButton>
        <ActionButton onClick={onShare} disabled={isLoading}>
          <Share2 size={16} />
          Share
        </ActionButton>
        <ActionButton onClick={onExportJson} disabled={isLoading}>
          <Code size={16} />
          JSON
        </ActionButton>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </div>
  );
}
