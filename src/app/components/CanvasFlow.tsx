"use client";
import React, { useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  ConnectionLineType,
} from "@xyflow/react";
import type {
  Connection,
  NodeTypes,
  ReactFlowInstance,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCanvasStore } from "@/src/store/canvasStore";
import ResearchNodeComponent from "./ResearchNodeComponent";
import type { ResearchFlowNode } from "@/src/store/canvasStore";

const nodeTypes: NodeTypes = {
  researchNode: ResearchNodeComponent as React.ComponentType<any>,
};

interface CanvasFlowProps {
  onFlowReady?: (instance: ReactFlowInstance<ResearchFlowNode, Edge>) => void;
  onPaneClick?: () => void;
}

export default function CanvasFlow({
  onFlowReady,
  onPaneClick,
}: CanvasFlowProps) {
  const {
    selectNode,
    nodes: storeNodes,
    edges: storeEdges,
    setEdges: storeSetEdges,
    removeNode,
  } = useCanvasStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  const prevStoreNodeCountRef = useRef(storeNodes.length);
  const prevStoreEdgeCountRef = useRef(storeEdges.length);
  const activeCanvasIdRef = useRef(useCanvasStore.getState().activeCanvasId);

  useEffect(() => {
    const prevCount = prevStoreNodeCountRef.current;
    const currCount = storeNodes.length;
    const currentCanvasId = useCanvasStore.getState().activeCanvasId;

    if (
      currCount !== prevCount ||
      currentCanvasId !== activeCanvasIdRef.current
    ) {
      prevStoreNodeCountRef.current = currCount;
      activeCanvasIdRef.current = currentCanvasId;
      setNodes(storeNodes as never);
    }
  }, [storeNodes, setNodes]);

  useEffect(() => {
    const prevCount = prevStoreEdgeCountRef.current;
    const currCount = storeEdges.length;
    const currentCanvasId = useCanvasStore.getState().activeCanvasId;

    if (
      currCount !== prevCount ||
      currentCanvasId !== activeCanvasIdRef.current
    ) {
      prevStoreEdgeCountRef.current = currCount;
      setEdges(storeEdges as never);
    }
  }, [storeEdges, setEdges]);

  const edgeSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (edgeSyncTimerRef.current) clearTimeout(edgeSyncTimerRef.current);
    edgeSyncTimerRef.current = setTimeout(() => {
      storeSetEdges(edges);
    }, 100);
    return () => {
      if (edgeSyncTimerRef.current) clearTimeout(edgeSyncTimerRef.current);
    };
  }, [edges, storeSetEdges]);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            style: { stroke: "#C4C4F0", strokeWidth: 1.5 },
            markerEnd: { type: "arrowclosed" as const, color: "#C4C4F0" },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClickHandler = useCallback(() => {
    selectNode(null);
    onPaneClick?.();
  }, [selectNode, onPaneClick]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const { selectedNodeId } = useCanvasStore.getState();
        if (selectedNodeId) {
          setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
          setEdges((eds) =>
            eds.filter(
              (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
            )
          );
          removeNode(selectedNodeId);
          selectNode(null);
        }
      }
    },
    [setNodes, setEdges, removeNode, selectNode]
  );

  return (
    <div
      className="w-full h-full"
      onKeyDown={onKeyDown}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClickHandler}
        onInit={onFlowReady}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        style={{ background: "var(--background)" }}
        deleteKeyCode={null}
        connectionLineStyle={{ stroke: "#C4C4F0", strokeWidth: 1.5 }}
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#C8C8C0"
        />
        <MiniMap
          style={{
            background: "var(--muted)",
            border: "1px solid var(--border)",
            borderRadius: 8,
          }}
          nodeColor={(n) => {
            const t = (n.data as { type: string })?.type;
            if (t === "paper") return "#C4C4F0";
            if (t === "insight") return "#A8A8E8";
            if (t === "question") return "#F5D89A";
            if (t === "note") return "#A8E6BC";
            return "#D4C4F0";
          }}
          maskColor="rgba(250, 250, 247, 0.7)"
        />
      </ReactFlow>
    </div>
  );
}
