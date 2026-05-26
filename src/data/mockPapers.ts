import { Node, Edge } from "@xyflow/react";
import { ResearchNodeData } from "@/src/store/canvasStore";

export const mockNodes: Node<ResearchNodeData>[] = [
  {
    id: "paper-001",
    type: "researchNode",
    position: { x: 80, y: 80 },
    data: {
      type: "paper",
      paper: {
        id: "paper-001",
        title: "Attention Is All You Need",
        authors: ["Vaswani, A.", "Shazeer, N.", "Parmar, N.", "Uszkoreit, J."],
        year: 2017,
        venue: "NeurIPS",
        abstract:
          "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism.",
        tags: ["transformers", "attention", "seq2seq", "architecture"],
        citations: 87432,
        aiSummary:
          "Introduces the Transformer architecture, replacing recurrence entirely with self-attention. Achieves state-of-the-art on translation tasks with significantly better parallelization.",
        status: "synthesized",
      },
    },
  },
  {
    id: "paper-002",
    type: "researchNode",
    position: { x: 480, y: 60 },
    data: {
      type: "paper",
      paper: {
        id: "paper-002",
        title: "GPT-4 Technical Report",
        authors: ["OpenAI"],
        year: 2023,
        venue: "arXiv",
        abstract:
          "We report the development of GPT-4, a large-scale, multimodal model which can accept image and text inputs and produce text outputs.",
        tags: ["LLM", "multimodal", "RLHF", "scaling"],
        citations: 12847,
        aiSummary:
          "GPT-4 extends the GPT series to multimodal input and significantly improves reasoning, instruction following, and safety via RLHF and Constitutional AI-inspired techniques.",
        status: "annotated",
      },
    },
  },
  {
    id: "paper-003",
    type: "researchNode",
    position: { x: 860, y: 120 },
    data: {
      type: "paper",
      paper: {
        id: "paper-003",
        title:
          "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
        authors: [
          "Wei, J.",
          "Wang, X.",
          "Schuurmans, D.",
          "Bosma, M.",
          "Chi, E.",
        ],
        year: 2022,
        venue: "NeurIPS",
        abstract:
          "We explore how generating a chain of thought — a series of intermediate reasoning steps — significantly improves the ability of large language models to perform complex reasoning.",
        tags: ["reasoning", "prompting", "chain-of-thought", "emergent"],
        citations: 9231,
        aiSummary:
          "Demonstrates that prompting LLMs with step-by-step reasoning examples dramatically improves multi-step arithmetic, commonsense, and symbolic reasoning — an emergent capability at scale.",
        status: "reviewing",
      },
    },
  },
  {
    id: "paper-004",
    type: "researchNode",
    position: { x: 180, y: 400 },
    data: {
      type: "paper",
      paper: {
        id: "paper-004",
        title:
          "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        authors: ["Lewis, P.", "Perez, E.", "Piktus, A.", "Petroni, F."],
        year: 2020,
        venue: "NeurIPS",
        abstract:
          "We explore a general-purpose fine-tuning recipe for retrieval-augmented generation (RAG), which combines parametric and non-parametric memory for language generation.",
        tags: ["RAG", "retrieval", "knowledge", "generation"],
        citations: 6104,
        aiSummary:
          "RAG combines a retrieval component (dense passage retrieval) with a seq2seq generator, enabling knowledge-intensive tasks without full parametric memorization. Foundational for modern LLM tooling.",
        status: "connected",
      },
    },
  },
  {
    id: "paper-005",
    type: "researchNode",
    position: { x: 680, y: 380 },
    data: {
      type: "paper",
      paper: {
        id: "paper-005",
        title: "Constitutional AI: Harmlessness from AI Feedback",
        authors: ["Bai, Y.", "Jones, A.", "Ndousse, K.", "Askell, A."],
        year: 2022,
        venue: "arXiv",
        abstract:
          "We propose Constitutional AI, a method for training AI systems to be helpful, harmless, and honest using a set of principles and AI feedback rather than human feedback.",
        tags: ["alignment", "RLHF", "safety", "constitutional"],
        citations: 3872,
        aiSummary:
          "Introduces a self-improvement loop where models critique and revise their own outputs against a set of principles, reducing reliance on human feedback for harmlessness training.",
        status: "annotated",
      },
    },
  },
  {
    id: "insight-001",
    type: "researchNode",
    position: { x: 440, y: 260 },
    data: {
      type: "insight",
      insight: {
        id: "insight-001",
        content:
          "All five papers converge on attention mechanisms as the central primitive for reasoning. Transformers (2017) provide the substrate; CoT prompting exploits it; RAG extends it with external memory.",
        sourceIds: ["paper-001", "paper-003", "paper-004"],
        type: "synthesis",
        confidence: 0.91,
      },
    },
  },
  {
    id: "insight-002",
    type: "researchNode",
    position: { x: 940, y: 360 },
    data: {
      type: "insight",
      insight: {
        id: "insight-002",
        content:
          "Tension between Constitutional AI (rule-based alignment) and RLHF (preference-based). CAI reduces human labeling cost but introduces brittleness to principle specification.",
        sourceIds: ["paper-002", "paper-005"],
        type: "contradiction",
        confidence: 0.78,
      },
    },
  },
  {
    id: "question-001",
    type: "researchNode",
    position: { x: 100, y: 600 },
    data: {
      type: "question",
      question: {
        id: "question-001",
        text: "Does chain-of-thought reasoning persist under adversarial prompting, or does it collapse to surface-level pattern matching?",
        relatedPaperIds: ["paper-003"],
        answered: false,
      },
    },
  },
  {
    id: "question-002",
    type: "researchNode",
    position: { x: 700, y: 580 },
    data: {
      type: "question",
      question: {
        id: "question-002",
        text: "Can RAG and Constitutional AI be composed — retrieval-augmented alignment feedback?",
        relatedPaperIds: ["paper-004", "paper-005"],
        answered: true,
        answer:
          "Emerging work (RLAIF, 2023) suggests yes — retrieval can ground constitutional principles in empirical examples rather than abstract rules.",
      },
    },
  },
  {
    id: "note-001",
    type: "researchNode",
    position: { x: 360, y: 560 },
    data: {
      type: "note",
      note: {
        id: "note-001",
        content:
          "The scaling hypothesis running through GPT-4 and CoT: capabilities emerge discontinuously at scale. But RAG suggests architectural choice may matter as much as scale.",
        color: "amber",
      },
    },
  },
  {
    id: "cluster-001",
    type: "researchNode",
    position: { x: 60, y: 200 },
    data: {
      type: "cluster",
      cluster: {
        id: "cluster-001",
        label: "Foundation Models",
        paperCount: 3,
        theme: "Architecture & Scaling",
      },
    },
  },
];

export const mockEdges: Edge[] = [
  {
    id: "edge-001-003",
    source: "paper-001",
    target: "paper-003",
    type: "smoothstep",
    animated: false,
    style: { stroke: "#C4C4F0", strokeWidth: 1.5 },
    label: "enables",
    labelStyle: { fontSize: 10, fill: "#8888AA" },
    labelBgStyle: { fill: "rgba(255,255,255,0.8)" },
  },
  {
    id: "edge-001-004",
    source: "paper-001",
    target: "paper-004",
    type: "smoothstep",
    animated: false,
    style: { stroke: "#C4C4F0", strokeWidth: 1.5 },
    label: "architecture basis",
    labelStyle: { fontSize: 10, fill: "#8888AA" },
    labelBgStyle: { fill: "rgba(255,255,255,0.8)" },
  },
  {
    id: "edge-003-insight001",
    source: "paper-003",
    target: "insight-001",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#A8A8E8", strokeWidth: 1.5, strokeDasharray: "4 3" },
  },
  {
    id: "edge-001-insight001",
    source: "paper-001",
    target: "insight-001",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#A8A8E8", strokeWidth: 1.5, strokeDasharray: "4 3" },
  },
  {
    id: "edge-004-insight001",
    source: "paper-004",
    target: "insight-001",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#A8A8E8", strokeWidth: 1.5, strokeDasharray: "4 3" },
  },
  {
    id: "edge-002-005",
    source: "paper-002",
    target: "paper-005",
    type: "smoothstep",
    animated: false,
    style: { stroke: "#F5D89A", strokeWidth: 1.5 },
    label: "RLHF basis",
    labelStyle: { fontSize: 10, fill: "#AA8844" },
    labelBgStyle: { fill: "rgba(255,255,255,0.8)" },
  },
  {
    id: "edge-005-insight002",
    source: "paper-005",
    target: "insight-002",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#F5C4A8", strokeWidth: 1.5, strokeDasharray: "4 3" },
  },
  {
    id: "edge-002-insight002",
    source: "paper-002",
    target: "insight-002",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#F5C4A8", strokeWidth: 1.5, strokeDasharray: "4 3" },
  },
  {
    id: "edge-003-q001",
    source: "paper-003",
    target: "question-001",
    type: "smoothstep",
    animated: false,
    style: { stroke: "#F5D89A", strokeWidth: 1.5, strokeDasharray: "3 3" },
  },
  {
    id: "edge-004-q002",
    source: "paper-004",
    target: "question-002",
    type: "smoothstep",
    animated: false,
    style: { stroke: "#F5D89A", strokeWidth: 1.5, strokeDasharray: "3 3" },
  },
  {
    id: "edge-005-q002",
    source: "paper-005",
    target: "question-002",
    type: "smoothstep",
    animated: false,
    style: { stroke: "#F5D89A", strokeWidth: 1.5, strokeDasharray: "3 3" },
  },
];
