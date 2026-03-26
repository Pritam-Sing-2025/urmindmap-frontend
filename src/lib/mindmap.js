import { Position } from '@xyflow/react';

export const EXAMPLE_NOTES = `Artificial intelligence can help students turn long notes into clearer study materials.

Main idea:
- AI extracts the central topic from paragraphs.
- It groups supporting ideas into branches.

Benefits:
- Faster revision before exams
- Better memory through visual structure
- Easier presentation planning

Use cases:
- Classroom notes
- Product brainstorming
- Meeting summaries
- Research breakdowns

Important reminder:
- Keep each child point concise and easy to scan.`;

export const DEFAULT_MINDMAP = {
  title: 'AI Notes to Mind Map',
  nodes: [
    {
      title: 'Paste your notes',
      children: ['Lecture summaries', 'Product docs', 'Research ideas']
    },
    {
      title: 'Generate structure',
      children: ['Title extraction', 'Clean branches', 'Key supporting points']
    },
    {
      title: 'Share the result',
      children: ['Export as PNG', 'Save locally', 'Copy share link']
    }
  ]
};

const BRANCH_COLORS = [
  '#2563eb',
  '#8b5cf6',
  '#f97316',
  '#14b8a6',
  '#ec4899',
  '#84cc16',
  '#06b6d4',
  '#f59e0b'
];

function cleanText(value, fallback = '') {
  if (typeof value !== 'string') {
    return fallback;
  }

  const normalized = value.replace(/\s+/g, ' ').trim();

  return normalized || fallback;
}

export function normalizeMindMapData(payload) {
  const safePayload = payload && typeof payload === 'object' ? payload : {};
  const rawNodes = Array.isArray(safePayload.nodes) ? safePayload.nodes : [];

  const nodes = rawNodes
    .map((node, index) => ({
      title: cleanText(node?.title, `Branch ${index + 1}`),
      children: Array.isArray(node?.children)
        ? node.children.map((child) => cleanText(child)).filter(Boolean).slice(0, 8)
        : []
    }))
    .filter((node) => node.title);

  return {
    title: cleanText(safePayload.title, 'Generated Mind Map'),
    nodes: nodes.length ? nodes.slice(0, 10) : DEFAULT_MINDMAP.nodes
  };
}

function centeredOffsets(count, gap) {
  return Array.from({ length: count }, (_, index) => (index - (count - 1) / 2) * gap);
}

export function buildFlowElements(mindMap, collapsedBranches, callbacks = {}) {
  const safeMindMap = normalizeMindMapData(mindMap);
  const leftBranches = safeMindMap.nodes.filter((_, index) => index % 2 === 1);
  const rightBranches = safeMindMap.nodes.filter((_, index) => index % 2 === 0);
  const leftOffsets = centeredOffsets(leftBranches.length, 220);
  const rightOffsets = centeredOffsets(rightBranches.length, 220);

  let leftPointer = 0;
  let rightPointer = 0;

  const nodes = [
    {
      id: 'root',
      type: 'mindMap',
      data: {
        label: safeMindMap.title,
        level: 'root',
        color: '#0ea5e9',
        onEdit: callbacks.onEdit
      },
      position: { x: 0, y: 0 }
    }
  ];

  const edges = [];

  safeMindMap.nodes.forEach((branch, index) => {
    const branchId = `branch-${index}`;
    const color = BRANCH_COLORS[index % BRANCH_COLORS.length];
    const side = index % 2 === 0 ? 1 : -1;
    const y = side === 1 ? rightOffsets[rightPointer++] : leftOffsets[leftPointer++];
    const isCollapsed = collapsedBranches.has(branchId);

    nodes.push({
      id: branchId,
      type: 'mindMap',
      data: {
        label: branch.title,
        level: 'branch',
        color,
        side,
        collapsible: branch.children.length > 0,
        collapsed: isCollapsed,
        childCount: branch.children.length,
        onToggle: callbacks.onToggle,
        onEdit: callbacks.onEdit
      },
      position: { x: side * 310, y },
      sourcePosition: side === 1 ? Position.Right : Position.Left,
      targetPosition: side === 1 ? Position.Left : Position.Right
    });

    edges.push({
      id: `edge-root-${branchId}`,
      source: 'root',
      sourceHandle: side === 1 ? 'source-right' : 'source-left',
      target: branchId,
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: color,
        strokeWidth: 2.8
      }
    });

    if (isCollapsed) {
      return;
    }

    const childOffsets = centeredOffsets(branch.children.length, 86);

    branch.children.forEach((child, childIndex) => {
      const childId = `${branchId}-child-${childIndex}`;

      nodes.push({
        id: childId,
        type: 'mindMap',
        data: {
          label: child,
          level: 'leaf',
          color,
          side,
          onEdit: callbacks.onEdit
        },
        position: {
          x: side * 610,
          y: y + childOffsets[childIndex]
        },
        sourcePosition: side === 1 ? Position.Right : Position.Left,
        targetPosition: side === 1 ? Position.Left : Position.Right
      });

      edges.push({
        id: `edge-${branchId}-${childId}`,
        source: branchId,
        target: childId,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: color,
          opacity: 0.72,
          strokeWidth: 2.2
        }
      });
    });
  });

  return { nodes, edges };
}

export function updateMindMapNodeTitle(mindMap, nodeId, nextTitle) {
  const normalizedTitle = cleanText(nextTitle);

  if (!normalizedTitle) {
    return mindMap;
  }

  if (nodeId === 'root') {
    return {
      ...mindMap,
      title: normalizedTitle
    };
  }

  const branchMatch = nodeId.match(/^branch-(\d+)$/);

  if (branchMatch) {
    const branchIndex = Number(branchMatch[1]);

    return {
      ...mindMap,
      nodes: mindMap.nodes.map((node, index) =>
        index === branchIndex ? { ...node, title: normalizedTitle } : node
      )
    };
  }

  const childMatch = nodeId.match(/^branch-(\d+)-child-(\d+)$/);

  if (!childMatch) {
    return mindMap;
  }

  const branchIndex = Number(childMatch[1]);
  const childIndex = Number(childMatch[2]);

  return {
    ...mindMap,
    nodes: mindMap.nodes.map((node, index) => {
      if (index !== branchIndex) {
        return node;
      }

      return {
        ...node,
        children: node.children.map((child, currentChildIndex) =>
          currentChildIndex === childIndex ? normalizedTitle : child
        )
      };
    })
  };
}

export function slugify(value) {
  return cleanText(value, 'mind-map')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
