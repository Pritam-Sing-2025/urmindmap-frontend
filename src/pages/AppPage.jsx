import { startTransition, useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useEdgesState, useNodesState } from '@xyflow/react';
import { toPng } from 'html-to-image';
import { AlertCircle, ExternalLink } from 'lucide-react';
import MindMapCanvas from '../components/MindMapCanvas';
import TextPanel from '../components/TextPanel';
import TopBar from '../components/TopBar';
import {
  buildFlowElements,
  DEFAULT_MINDMAP,
  EXAMPLE_NOTES,
  normalizeMindMapData,
  slugify,
  updateMindMapNodeTitle
} from '../lib/mindmap';
import { decodeSharePayload, encodeSharePayload } from '../lib/share';

const SAVED_MAPS_STORAGE_KEY = 'ai-mindmap-saves';

function loadSavedMaps() {
  try {
    const rawValue = localStorage.getItem(SAVED_MAPS_STORAGE_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function saveMapCollection(collection) {
  localStorage.setItem(SAVED_MAPS_STORAGE_KEY, JSON.stringify(collection));
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function AppPage({ theme, onToggleTheme }) {
  const [searchParams] = useSearchParams();
  const shareLoadedRef = useRef(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  const canvasRef = useRef(null);
  const reactFlowInstanceRef = useRef(null);

  const [notes, setNotes] = useState('');
  const [mindMap, setMindMap] = useState(DEFAULT_MINDMAP);
  const [collapsedBranches, setCollapsedBranches] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [savedMaps, setSavedMaps] = useState(loadSavedMaps);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleNodeEdit = useCallback((nodeId, currentLabel) => {
    const nextLabel = window.prompt('Edit node label', currentLabel);

    if (!nextLabel || !nextLabel.trim()) {
      return;
    }

    setMindMap((currentMindMap) =>
      updateMindMapNodeTitle(currentMindMap, nodeId, nextLabel.trim())
    );
  }, []);

  const handleToggleBranch = useCallback((branchId) => {
    setCollapsedBranches((currentCollapsedBranches) =>
      currentCollapsedBranches.includes(branchId)
        ? currentCollapsedBranches.filter((currentId) => currentId !== branchId)
        : [...currentCollapsedBranches, branchId]
    );
  }, []);

  useEffect(() => {
    const flow = buildFlowElements(mindMap, new Set(collapsedBranches), {
      onToggle: handleToggleBranch,
      onEdit: handleNodeEdit
    });

    startTransition(() => {
      setNodes(flow.nodes);
      setEdges(flow.edges);
    });

    const timeoutId = window.setTimeout(() => {
      reactFlowInstanceRef.current?.fitView({
        padding: 0.24,
        duration: 650
      });
    }, 40);

    return () => window.clearTimeout(timeoutId);
  }, [collapsedBranches, handleNodeEdit, handleToggleBranch, mindMap, setEdges, setNodes]);

  useEffect(() => {
    if (shareLoadedRef.current) {
      return;
    }

    const sharedPayload = searchParams.get('share');

    if (!sharedPayload) {
      shareLoadedRef.current = true;
      return;
    }

    try {
      const decodedPayload = decodeSharePayload(sharedPayload);

      if (decodedPayload?.mindMap) {
        setNotes(typeof decodedPayload.notes === 'string' ? decodedPayload.notes : '');
        setMindMap(normalizeMindMapData(decodedPayload.mindMap));
        setCollapsedBranches([]);
        setFeedbackMessage('Shared mind map loaded.');
      }
    } catch {
      setErrorMessage('The share link is invalid or could not be decoded.');
    }

    shareLoadedRef.current = true;
  }, [searchParams]);

  useEffect(() => {
    if (!feedbackMessage && !errorMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedbackMessage('');
      setErrorMessage('');
    }, 3600);

    return () => window.clearTimeout(timeoutId);
  }, [errorMessage, feedbackMessage]);

  const handleGenerateMindMap = useCallback(async () => {
    if (!notes.trim()) {
      setErrorMessage('Paste some notes first so the AI has something to structure.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setFeedbackMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/generate-mindmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: notes.trim() })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to generate the mind map.');
      }

      setCollapsedBranches([]);
      setMindMap(normalizeMindMapData(payload.mindMap));
      setFeedbackMessage(`Generated with ${payload.model || 'Gemini'}.`);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to generate the mind map.');
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, notes]);

  const handleClear = useCallback(() => {
    setNotes('');
    setMindMap(DEFAULT_MINDMAP);
    setCollapsedBranches([]);
    setFeedbackMessage('Canvas reset.');
    setErrorMessage('');
  }, []);

  const handleUseExample = useCallback(() => {
    setNotes(EXAMPLE_NOTES);
    setFeedbackMessage('Example notes inserted. Generate whenever you are ready.');
  }, []);

  const handleSave = useCallback(() => {
    const entry = {
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}`,
      title: mindMap.title,
      notes,
      mindMap,
      savedAt: new Date().toISOString()
    };

    const nextCollection = [entry, ...savedMaps].slice(0, 6);
    setSavedMaps(nextCollection);
    saveMapCollection(nextCollection);
    setFeedbackMessage('Mind map saved locally.');
  }, [mindMap, notes, savedMaps]);

  const handleLoadSavedMap = useCallback((savedMap) => {
    setNotes(savedMap.notes || '');
    setMindMap(normalizeMindMapData(savedMap.mindMap));
    setCollapsedBranches([]);
    setFeedbackMessage(`Loaded "${savedMap.title}".`);
  }, []);

  const handleExportJson = useCallback(() => {
    downloadFile(
      `${slugify(mindMap.title)}.json`,
      JSON.stringify(mindMap, null, 2),
      'application/json'
    );
    setFeedbackMessage('JSON exported.');
  }, [mindMap]);

  const handleExportPng = useCallback(async () => {
    if (!canvasRef.current) {
      return;
    }

    try {
      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        pixelRatio: 2.2,
        backgroundColor: theme === 'dark' ? '#06111f' : '#eef4ff'
      });

      const anchor = document.createElement('a');
      anchor.href = dataUrl;
      anchor.download = `${slugify(mindMap.title)}.png`;
      anchor.click();
      setFeedbackMessage('PNG exported.');
    } catch {
      setErrorMessage('Export failed. Try again after the canvas finishes rendering.');
    }
  }, [mindMap.title, theme]);

  const handleShare = useCallback(async () => {
    try {
      const serializedPayload = encodeSharePayload({
        notes,
        mindMap
      });
      const shareUrl = `${window.location.origin}/app?share=${serializedPayload}`;
      await navigator.clipboard.writeText(shareUrl);
      setFeedbackMessage('Share link copied to your clipboard.');
    } catch {
      setErrorMessage('Could not create a share link on this browser.');
    }
  }, [mindMap, notes]);

  return (
    <div className="px-4 pb-8 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
        <TopBar
          theme={theme}
          onToggleTheme={onToggleTheme}
          onGenerate={handleGenerateMindMap}
          onClear={handleClear}
          onExportPng={handleExportPng}
          onSave={handleSave}
          onShare={handleShare}
          onExportJson={handleExportJson}
          isLoading={isLoading}
        />

        {(errorMessage || feedbackMessage) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 rounded-[24px] px-4 py-4 text-sm ${errorMessage
                ? 'border border-rose-300/30 bg-rose-500/10 text-rose-100'
                : 'glass-panel text-[color:var(--text-strong)]'
              }`}
          >
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage || feedbackMessage}</span>
          </motion.div>
        )}

        <div className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
          <TextPanel
            notes={notes}
            onNotesChange={setNotes}
            onUseExample={handleUseExample}
            savedMaps={savedMaps}
            onLoadSavedMap={handleLoadSavedMap}
            isLoading={isLoading}
          />

          <div className="flex flex-col gap-4">
            <MindMapCanvas
              ref={canvasRef}
              nodes={nodes}
              edges={edges}
              isLoading={isLoading}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onInit={(instance) => {
                reactFlowInstanceRef.current = instance;
              }}
            />

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="glass-panel-strong rounded-[28px] p-5">
                <div className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                  Current Map
                </div>
                <h2 className="font-display text-2xl font-bold text-[color:var(--text-strong)]">
                  {mindMap.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">
                  Each top-level branch gets its own color, the layout auto-balances
                  left and right, and you can collapse branches or edit labels directly
                  on the canvas.
                </p>
              </div>

              <div className="glass-panel-strong rounded-[28px] p-5">
                <div className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                  Quick Actions
                </div>
                <div className="space-y-3 text-sm text-[color:var(--text-muted)]">
                  <div>Double-click the pencil icon on a node to rename it.</div>
                  <div>Use the PNG export for social-ready screenshots.</div>
                  <div>Save locally to keep multiple versions in your browser.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/15 bg-white/10 px-5 py-4 text-sm text-[color:var(--text-muted)] backdrop-blur-xl">
          <div>
            Built with React, Vite, Tailwind CSS, Framer Motion, React Flow, Express,
            and the Gemini API.
          </div>
          <Link to="/" className="inline-flex items-center gap-2 font-semibold text-[color:var(--text-strong)]">
            Back to landing page
            <ExternalLink size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
