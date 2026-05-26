import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Node, Edge } from "@xyflow/react";
import { mockNodes, mockEdges } from "@/src/data/mockPapers";

export type NodeType = "paper" | "insight" | "question" | "note" | "cluster";

export interface PaperData {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  abstract: string;
  tags: string[];
  citations: number;
  aiSummary: string;
  status: "unread" | "reviewing" | "annotated" | "connected" | "synthesized";
}

export interface InsightData {
  id: string;
  content: string;
  sourceIds: string[];
  type: "synthesis" | "contradiction" | "gap" | "theme";
  confidence: number;
}

export interface QuestionData {
  id: string;
  text: string;
  relatedPaperIds: string[];
  answered: boolean;
  answer?: string;
}

export interface NoteData {
  id: string;
  content: string;
  color: string;
}

export interface ClusterData {
  id: string;
  label: string;
  paperCount: number;
  theme: string;
}

export interface ResearchNodeData extends Record<string, unknown> {
  type: NodeType;

  paper?: PaperData;
  insight?: InsightData;
  question?: QuestionData;
  note?: NoteData;
  cluster?: ClusterData;

  selected?: boolean;
}

export type ResearchFlowNode = Node<ResearchNodeData>;

export interface CanvasSession {
  id: string;
  title: string;
  createdAt: string;
  lastAccessed: string;

  nodes: ResearchFlowNode[];
  edges: Edge[];
}

export interface CanvasState {
  canvases: CanvasSession[];
  activeCanvasId: string;

  nodes: ResearchFlowNode[];
  edges: Edge[];

  selectedNodeId: string | null;
  sidebarCollapsed: boolean;
  rightPanelOpen: boolean;

  recentPapers: RecentPaper[];

  setNodes: (nodes: ResearchFlowNode[]) => void;
  setEdges: (edges: Edge[]) => void;

  selectNode: (id: string | null) => void;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  setRightPanel: (open: boolean) => void;

  addNode: (node: ResearchFlowNode) => void;
  removeNode: (id: string) => void;

  createCanvas: (title: string) => string;
  switchCanvas: (id: string) => void;
  deleteCanvas: (id: string) => void;

  addRecentPaper: (paper: RecentPaper) => void;
  removeRecentPaper: (id: string) => void;
}

const defaultCanvas: CanvasSession = {
  id: "canvas-001",
  title: "Transformer Architecture Survey",
  createdAt: "May 18, 2026",
  lastAccessed: "Just now",
  nodes: mockNodes as ResearchFlowNode[],
  edges: mockEdges,
};

const defaultRecentPapers: RecentPaper[] = [
  {
    id: "rp-001",
    title: "Attention Is All You Need",
    year: 2017,
    venue: "NeurIPS",
  },
  {
    id: "rp-002",
    title: "GPT-4 Technical Report",
    year: 2023,
    venue: "arXiv",
  },
];

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      canvases: [defaultCanvas],

      activeCanvasId: "canvas-001",

      nodes: mockNodes as ResearchFlowNode[],
      edges: mockEdges,

      selectedNodeId: null,

      sidebarCollapsed: false,
      rightPanelOpen: false,

      recentPapers: defaultRecentPapers,

      setNodes: (nodes) => {
        const { activeCanvasId, canvases } = get();

        set({
          nodes,
          canvases: canvases.map((canvas) =>
            canvas.id === activeCanvasId ? { ...canvas, nodes } : canvas
          ),
        });
      },

      setEdges: (edges) => {
        const { activeCanvasId, canvases } = get();

        set({
          edges,
          canvases: canvases.map((canvas) =>
            canvas.id === activeCanvasId ? { ...canvas, edges } : canvas
          ),
        });
      },

      addNode: (node) => {
        const { nodes, activeCanvasId, canvases } = get();

        const updatedNodes = [...nodes, node];

        set({
          nodes: updatedNodes,
          canvases: canvases.map((canvas) =>
            canvas.id === activeCanvasId
              ? { ...canvas, nodes: updatedNodes }
              : canvas
          ),
        });
      },

      removeNode: (id) => {
        const { nodes, edges, activeCanvasId, canvases } = get();

        const updatedNodes = nodes.filter((node) => node.id !== id);

        const updatedEdges = edges.filter(
          (edge) => edge.source !== id && edge.target !== id
        );

        set({
          nodes: updatedNodes,
          edges: updatedEdges,

          canvases: canvases.map((canvas) =>
            canvas.id === activeCanvasId
              ? {
                  ...canvas,
                  nodes: updatedNodes,
                  edges: updatedEdges,
                }
              : canvas
          ),
        });
      },

      selectNode: (id) =>
        set({
          selectedNodeId: id,
          rightPanelOpen: id !== null,
        }),

      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),

      setSidebarCollapsed: (collapsed) =>
        set({
          sidebarCollapsed: collapsed,
        }),

      setRightPanel: (open) =>
        set({
          rightPanelOpen: open,
        }),

      createCanvas: (title) => {
        const id = `canvas-${Date.now()}`;

        const newCanvas: CanvasSession = {
          id,
          title,
          createdAt: new Date().toLocaleDateString(),
          lastAccessed: "Just now",
          nodes: [],
          edges: [],
        };

        set((state) => ({
          canvases: [...state.canvases, newCanvas],
          activeCanvasId: id,
          nodes: [],
          edges: [],
          selectedNodeId: null,
          rightPanelOpen: false,
        }));

        return id;
      },

      switchCanvas: (id) => {
        const canvas = get().canvases.find((c) => c.id === id);

        if (!canvas) return;

        set({
          activeCanvasId: id,
          nodes: canvas.nodes,
          edges: canvas.edges,
          selectedNodeId: null,
          rightPanelOpen: false,
        });
      },

      deleteCanvas: (id) => {
        const { canvases, activeCanvasId } = get();

        if (canvases.length <= 1) return;

        const filtered = canvases.filter((c) => c.id !== id);

        const nextCanvas = activeCanvasId === id ? filtered[0] : filtered[0];

        set({
          canvases: filtered,
          activeCanvasId: nextCanvas.id,
          nodes: nextCanvas.nodes,
          edges: nextCanvas.edges,
          selectedNodeId: null,
          rightPanelOpen: false,
        });
      },

      addRecentPaper: (paper) => {
        set((state) => ({
          recentPapers: [
            paper,
            ...state.recentPapers.filter((p) => p.id !== paper.id),
          ].slice(0, 20),
        }));
      },

      removeRecentPaper: (id) => {
        set((state) => ({
          recentPapers: state.recentPapers.filter((paper) => paper.id !== id),
        }));
      },
    }),
    {
      name: "research-canvas-store",
    }
  )
);
