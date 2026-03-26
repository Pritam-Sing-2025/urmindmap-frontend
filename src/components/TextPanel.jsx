import { Clock, FileText, Sparkles } from 'lucide-react';

function formatSavedAt(value) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export default function TextPanel({
  notes,
  onNotesChange,
  onUseExample,
  savedMaps,
  onLoadSavedMap,
  isLoading
}) {
  return (
    <div className="glass-panel-strong mesh-background soft-scrollbar flex h-full flex-col rounded-[32px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
            <FileText size={14} />
            Input Notes
          </div>
          <h2 className="font-display text-2xl font-bold text-[color:var(--text-strong)]">
            Drop in rough notes
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[color:var(--text-muted)]">
            Paste paragraphs, meeting minutes, or class notes. The AI will convert
            them into a structured visual map.
          </p>
        </div>

        <button
          type="button"
          onClick={onUseExample}
          className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-[color:var(--text-strong)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          <Sparkles size={16} />
          Example Notes
        </button>
      </div>

      <div className="mt-6 flex-1">
        <textarea
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="Paste your notes here..."
          className="soft-scrollbar h-full min-h-[280px] w-full rounded-[28px] border border-white/20 bg-white/10 px-5 py-5 text-base leading-7 text-[color:var(--text-strong)] outline-none transition focus:border-sky-400/40 focus:bg-white/14"
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 text-sm text-[color:var(--text-muted)]">
        <div>{notes.trim().length} characters</div>
        <div>{isLoading ? 'Generating…' : 'Ready for AI processing'}</div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[color:var(--text-strong)]">
          <Clock size={15} />
          Recent saves
        </div>

        <div className="space-y-3">
          {savedMaps.length ? (
            savedMaps.slice(0, 3).map((savedMap) => (
              <button
                key={savedMap.id}
                type="button"
                onClick={() => onLoadSavedMap(savedMap)}
                className="glass-panel flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-transform duration-300 hover:-translate-y-0.5"
              >
                <div>
                  <div className="font-semibold text-[color:var(--text-strong)]">
                    {savedMap.title}
                  </div>
                  <div className="mt-1 text-xs text-[color:var(--text-muted)]">
                    {formatSavedAt(savedMap.savedAt)}
                  </div>
                </div>
                <div className="text-xs text-[color:var(--text-muted)]">
                  {savedMap.mindMap.nodes.length} branches
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/20 px-4 py-4 text-sm text-[color:var(--text-muted)]">
              Saved maps will appear here after you click save.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
