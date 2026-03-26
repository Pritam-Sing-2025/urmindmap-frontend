import { forwardRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow
} from '@xyflow/react';
import MindMapNode from './MindMapNode';

const nodeTypes = {
  mindMap: MindMapNode
};

const loadingPillVariants = {
  animate: (index) => ({
    y: [0, -8, 0],
    opacity: [0.45, 1, 0.45],
    transition: {
      duration: 0.9,
      repeat: Number.POSITIVE_INFINITY,
      delay: index * 0.12
    }
  })
};

const MindMapCanvas = forwardRef(function MindMapCanvas(
  { nodes, edges, isLoading, onNodesChange, onEdgesChange, onInit },
  ref
) {
  const nodeColor = useMemo(
    () => (node) => node.data?.color || '#2563eb',
    []
  );

  return (
    <div
      ref={ref}
      className="glass-panel-strong relative h-[540px] overflow-hidden rounded-[32px] border border-white/20 lg:h-[calc(100vh-15rem)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_34%)]" />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        fitView
        minZoom={0.25}
        maxZoom={1.8}
        fitViewOptions={{ padding: 0.25 }}
        className="dot-grid"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false
        }}
      >
        <Background color="transparent" />
        <Controls position="bottom-left" />
        <MiniMap
          position="bottom-right"
          pannable
          zoomable
          nodeStrokeWidth={3}
          maskColor="rgba(15, 23, 42, 0.08)"
          nodeColor={nodeColor}
        />
        <Panel position="top-left">
          <div className="glass-panel rounded-2xl px-4 py-3 text-sm text-[color:var(--text-muted)]">
            Drag nodes, collapse branches, or zoom the canvas to refine the layout.
          </div>
        </Panel>
      </ReactFlow>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 flex items-center justify-center bg-[color:var(--canvas-overlay)] backdrop-blur-sm"
        >
          <div className="glass-panel-strong rounded-[28px] px-7 py-6 text-center">
            <div className="mb-4 flex justify-center gap-3">
              {[0, 1, 2].map((index) => (
                <motion.span
                  key={index}
                  custom={index}
                  variants={loadingPillVariants}
                  animate="animate"
                  className="h-3 w-3 rounded-full bg-sky-500"
                />
              ))}
            </div>
            <div className="font-display text-xl font-bold text-[color:var(--text-strong)]">
              Generating your mind map
            </div>
            <p className="mt-2 text-sm text-[color:var(--text-muted)]">
              AI is extracting themes and organizing the branches.
            </p>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
});

export default MindMapCanvas;

