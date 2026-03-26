import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDown, ChevronRight, Pen } from 'lucide-react';

function MindMapNode({ id, data, selected }) {
  const incomingPosition = data.side === -1 ? Position.Right : Position.Left;
  const outgoingPosition = data.side === -1 ? Position.Left : Position.Right;
  const isRoot = data.level === 'root';
  const isLeaf = data.level === 'leaf';

  return (
    <div
      className="group relative min-w-[170px] max-w-[240px] rounded-[28px] border px-4 py-3 text-[color:var(--text-strong)] backdrop-blur-xl transition-all duration-300"
      style={{
        background:
          data.level === 'root' ? 'rgba(14, 165, 233, 0.14)' : 'var(--card-surface)',
        borderColor:
          data.level === 'root' ? 'rgba(14, 165, 233, 0.28)' : 'var(--card-border)',
        boxShadow: selected
          ? `0 0 0 2px ${data.color}35, var(--card-shadow)`
          : 'var(--card-shadow)'
      }}
    >
      {!isRoot ? (
        <Handle
          type="target"
          position={incomingPosition}
          isConnectable={false}
          style={{
            width: 10,
            height: 10,
            border: '2px solid rgba(255,255,255,0.9)',
            background: data.color
          }}
        />
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
            {data.level === 'root'
              ? 'Topic'
              : data.level === 'branch'
                ? 'Branch'
                : 'Point'}
          </div>
          <div
            className={`font-display leading-tight ${
              data.level === 'leaf' ? 'text-base font-medium' : 'text-lg font-bold'
            }`}
          >
            {data.label}
          </div>
          {data.childCount ? (
            <div className="mt-2 text-xs text-[color:var(--text-muted)]">
              {data.childCount} supporting point{data.childCount > 1 ? 's' : ''}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              data.onEdit?.(id, data.label);
            }}
            className="rounded-xl border border-white/20 bg-white/10 p-2 text-[color:var(--text-muted)] opacity-0 transition group-hover:opacity-100 hover:text-[color:var(--text-strong)]"
            title="Edit node text"
            aria-label="Edit node text"
          >
            <Pen size={14} />
          </button>

          {data.collapsible ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                data.onToggle?.(id);
              }}
              className="rounded-xl border border-white/20 bg-white/10 p-2 text-[color:var(--text-muted)] transition hover:text-[color:var(--text-strong)]"
              title={data.collapsed ? 'Expand branch' : 'Collapse branch'}
              aria-label={data.collapsed ? 'Expand branch' : 'Collapse branch'}
            >
              {data.collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
            </button>
          ) : null}
        </div>
      </div>

      {isRoot ? (
        <>
          <Handle
            id="source-left"
            type="source"
            position={Position.Left}
            isConnectable={false}
            style={{
              width: 10,
              height: 10,
              border: '2px solid rgba(255,255,255,0.9)',
              background: data.color
            }}
          />
          <Handle
            id="source-right"
            type="source"
            position={Position.Right}
            isConnectable={false}
            style={{
              width: 10,
              height: 10,
              border: '2px solid rgba(255,255,255,0.9)',
              background: data.color
            }}
          />
        </>
      ) : !isLeaf ? (
        <Handle
          type="source"
          position={outgoingPosition}
          isConnectable={false}
          style={{
            width: 10,
            height: 10,
            border: '2px solid rgba(255,255,255,0.9)',
            background: data.color
          }}
        />
      ) : null}
    </div>
  );
}

export default memo(MindMapNode);
