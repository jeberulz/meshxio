"use client";

import { useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SourceNodeId = "sap-erp" | "kafka-stream" | "rest-api";
type NodeId = SourceNodeId | "foundation-engine" | "supply-chain-dp";

interface LineageNode {
  id: NodeId;
  systemName: string;
  label: string;
  badge: string;
  type: "source" | "transform" | "output";
  x: number;
  y: number;
}

interface LineageEdge {
  id: string;
  from: NodeId;
  to: NodeId;
  flowRate: string;
}

interface Feature {
  num: string;
  title: string;
  description: string;
  nodeId: SourceNodeId;
  progress?: number;
  badge?: string;
  badgeAccent?: boolean;
}

// ---------------------------------------------------------------------------
// Static Data
// ---------------------------------------------------------------------------

const NODES: LineageNode[] = [
  {
    id: "sap-erp",
    systemName: "SAP_ERP",
    label: "WAREHOUSE DATA",
    badge: "DOMAIN: LOGISTICS",
    type: "source",
    x: 30,
    y: 40,
  },
  {
    id: "kafka-stream",
    systemName: "KAFKA_STREAM",
    label: "SHIPMENT EVENTS",
    badge: "DOMAIN: TRANSPORT",
    type: "source",
    x: 30,
    y: 150,
  },
  {
    id: "rest-api",
    systemName: "REST_API",
    label: "CARRIER METRICS",
    badge: "DOMAIN: PARTNERS",
    type: "source",
    x: 30,
    y: 260,
  },
  {
    id: "foundation-engine",
    systemName: "FOUNDATION ENGINE",
    label: "MERGE + VALIDATE + ENRICH",
    badge: "",
    type: "transform",
    x: 230,
    y: 135,
  },
  {
    id: "supply-chain-dp",
    systemName: "SUPPLY CHAIN DP",
    label: "DATA PRODUCT",
    badge: "STATUS: LIVE",
    type: "output",
    x: 420,
    y: 135,
  },
];

const NODE_W = 160;
const NODE_H = 70;

const EDGES: LineageEdge[] = [
  { id: "e1", from: "sap-erp", to: "foundation-engine", flowRate: "~2.1k events/sec" },
  { id: "e2", from: "kafka-stream", to: "foundation-engine", flowRate: "~3.8k events/sec" },
  { id: "e3", from: "rest-api", to: "foundation-engine", flowRate: "~1.4k events/sec" },
  { id: "e4", from: "foundation-engine", to: "supply-chain-dp", flowRate: "~7.3k events/sec" },
];

const FEATURES: Feature[] = [
  {
    num: "01",
    title: "Data Quality Score",
    description:
      "Automated validation passes 847 of 851 checks. 4 warnings on carrier_id schema drift.",
    nodeId: "sap-erp",
    progress: 99.5,
  },
  {
    num: "02",
    title: "Access & Governance",
    description:
      "Role-based access active. 14 consumers authorized. PII fields encrypted. GDPR compliant.",
    nodeId: "kafka-stream",
    badge: "GOVERNANCE: ACTIVE",
  },
  {
    num: "03",
    title: "AI Readiness",
    description:
      "Pre-processed for model training. Feature store compatible. Last model training: 2h ago.",
    nodeId: "rest-api",
    badge: "AI-READY: TRUE",
    badgeAccent: true,
  },
];

const STATS = [
  { label: "FRESHNESS", value: "< 4min" },
  { label: "RECORDS", value: "12.4M" },
  { label: "DOMAINS", value: "3 connected" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function nodeById(id: NodeId) {
  return NODES.find((n) => n.id === id)!;
}

function edgePath(edge: LineageEdge): string {
  const from = nodeById(edge.from);
  const to = nodeById(edge.to);
  const x1 = from.x + NODE_W;
  const y1 = from.y + NODE_H / 2;
  const x2 = to.x;
  const y2 = to.y + NODE_H / 2;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

function edgeMidpoint(edge: LineageEdge): { x: number; y: number } {
  const from = nodeById(edge.from);
  const to = nodeById(edge.to);
  const x1 = from.x + NODE_W;
  const y1 = from.y + NODE_H / 2;
  const x2 = to.x;
  const y2 = to.y + NODE_H / 2;
  return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Home() {
  const [hoveredNode, setHoveredNode] = useState<NodeId | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [ctaFlash, setCtaFlash] = useState(false);

  const handleCtaClick = useCallback(() => {
    setCtaFlash(true);
    setTimeout(() => setCtaFlash(false), 300);
  }, []);

  const isEdgeActive = useCallback(
    (edge: LineageEdge) =>
      hoveredEdge === edge.id ||
      hoveredNode === edge.from ||
      hoveredNode === edge.to,
    [hoveredEdge, hoveredNode]
  );

  const sourceForFeature = useCallback(
    (nodeId: SourceNodeId) => hoveredNode === nodeId,
    [hoveredNode]
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background bg-grid">
      {/* ================================================================ */}
      {/* LEFT PANEL                                                       */}
      {/* ================================================================ */}
      <div className="flex w-[60%] flex-col border-r border-border">
        {/* Top Bar */}
        <div className="flex items-center border-b border-border">
          <div className="flex flex-1 items-center gap-3 border-r border-border px-6 py-3">
            <span className="font-mono text-[11px] tracking-[0.2em] text-foreground">
              MESHX FOUNDATION
            </span>
            <span className="inline-block h-[6px] w-[6px] animate-pulse-slow bg-accent-green" />
          </div>
          <div className="flex-1 border-r border-border px-6 py-3">
            <span className="font-mono text-[11px] tracking-[0.15em] text-secondary">
              V. 1.0
            </span>
          </div>
          <div className="flex-1 px-6 py-3 text-right">
            <span className="font-mono text-[11px] tracking-[0.15em] text-secondary">
              CATALOG +
            </span>
          </div>
        </div>

        {/* Hero */}
        <div className="border-b border-border px-8 py-12">
          <h1 className="font-display text-[72px] font-black uppercase leading-[0.9] tracking-tight text-foreground">
            SUPPLY
            <br />
            CHAIN
            <br />
            LOGISTICS
          </h1>
        </div>

        {/* Description */}
        <div className="border-b border-border px-8 py-6">
          <div className="border-l border-border-bright pl-5 font-mono text-[12px] leading-[1.8] text-secondary">
            Real-time shipment tracking data combined with
            <br />
            warehouse inventory levels and carrier performance
            <br />
            metrics. Federated from 3 domain sources across
            <br />
            EU operations.
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex border-b border-border">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex-1 px-8 py-5 ${i < STATS.length - 1 ? "border-r border-border" : ""}`}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">
                {stat.label}
              </div>
              <div className="mt-1 font-mono text-[14px] text-foreground">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Feature List */}
        <div className="flex-1 overflow-auto">
          {FEATURES.map((feature) => {
            const highlighted = sourceForFeature(feature.nodeId);
            return (
              <div
                key={feature.num}
                className="border-b border-border transition-colors duration-150"
                style={{
                  borderLeft: highlighted
                    ? "1px solid #c45a2d"
                    : "1px solid transparent",
                  backgroundColor: highlighted
                    ? "rgba(255, 255, 255, 0.02)"
                    : "transparent",
                }}
                onMouseEnter={() => setHoveredNode(feature.nodeId)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="flex items-start gap-5 px-8 py-5">
                  <span className="mt-[2px] font-mono text-[11px] text-secondary">
                    {feature.num}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[12px] font-bold tracking-wide text-foreground">
                        {feature.title}
                      </span>
                      {feature.badge && (
                        <span
                          className="font-mono text-[9px] tracking-[0.15em] px-2 py-[2px]"
                          style={{
                            border: feature.badgeAccent
                              ? "1px solid #c45a2d"
                              : "1px solid rgba(255, 255, 255, 0.1)",
                            color: feature.badgeAccent ? "#c45a2d" : "#666",
                          }}
                        >
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-mono text-[11px] leading-[1.7] text-secondary">
                      {feature.description}
                    </p>
                    {feature.progress != null && (
                      <div className="mt-3 h-[2px] w-full bg-border-bright">
                        <div
                          className="h-full bg-accent-orange transition-all duration-500"
                          style={{ width: `${feature.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <button
          onClick={handleCtaClick}
          className="flex w-full items-center justify-between border-t border-border px-8 py-5 font-mono text-[12px] tracking-[0.15em] text-foreground transition-all duration-150 hover:border-t-accent-orange"
          style={
            ctaFlash
              ? { backgroundColor: "rgba(196, 90, 45, 0.15)" }
              : undefined
          }
        >
          <span>Initialize Environment</span>
          <span className="text-accent-orange">{"->"}</span>
        </button>
      </div>

      {/* ================================================================ */}
      {/* RIGHT PANEL                                                      */}
      {/* ================================================================ */}
      <div className="flex w-[40%] flex-col">
        {/* Lineage Header */}
        <div className="border-b border-border px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-foreground">
              LINEAGE: LIVE
            </span>
            <span className="inline-block h-[6px] w-[6px] animate-pulse-slow bg-accent-green" />
          </div>
        </div>

        {/* SVG Graph */}
        <div className="relative flex-1 overflow-hidden p-4">
          <svg
            viewBox="0 0 620 370"
            className="h-full w-full"
            style={{ fontFamily: "var(--font-jb-mono), monospace" }}
          >
            {/* Edges (behind nodes) */}
            {EDGES.map((edge) => {
              const d = edgePath(edge);
              const active = isEdgeActive(edge);
              const mid = edgeMidpoint(edge);

              return (
                <g key={edge.id}>
                  <path d={d} className={`edge-path ${active ? "active" : ""}`} />
                  <path
                    d={d}
                    className="edge-hit-area"
                    onMouseEnter={() => setHoveredEdge(edge.id)}
                    onMouseLeave={() => setHoveredEdge(null)}
                  />
                  {active && (
                    <g>
                      <rect
                        x={mid.x - 55}
                        y={mid.y - 18}
                        width={110}
                        height={18}
                        fill="#050505"
                        fillOpacity={0.95}
                      />
                      <text
                        x={mid.x}
                        y={mid.y - 6}
                        textAnchor="middle"
                        fill="#c45a2d"
                        fontSize={9}
                        letterSpacing="0.05em"
                      >
                        {edge.flowRate}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map((node) => {
              const hovered = hoveredNode === node.id;
              const borderColor = hovered
                ? "#c45a2d"
                : "rgba(255, 255, 255, 0.1)";

              return (
                <g
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: "default" }}
                >
                  {/* Node rect */}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={NODE_W}
                    height={NODE_H}
                    fill="#0a0a0a"
                    stroke={borderColor}
                    strokeWidth={0.5}
                  />

                  {/* System name */}
                  <text
                    x={node.x + 10}
                    y={node.y + 18}
                    fill={hovered ? "#e5e5e5" : "#777"}
                    fontSize={10}
                    fontWeight={700}
                    letterSpacing="0.08em"
                  >
                    {node.systemName}
                  </text>

                  {/* Label */}
                  <text
                    x={node.x + 10}
                    y={node.y + 34}
                    fill={hovered ? "#c45a2d" : "#444"}
                    fontSize={8}
                    letterSpacing="0.1em"
                  >
                    {node.label}
                  </text>

                  {/* Badge */}
                  {node.badge && (
                    <g>
                      <rect
                        x={node.x + 9}
                        y={node.y + 44}
                        width={node.badge.length * 5.5 + 10}
                        height={14}
                        fill="none"
                        stroke={
                          node.type === "output"
                            ? "#c45a2d"
                            : "rgba(255, 255, 255, 0.1)"
                        }
                        strokeWidth={0.5}
                      />
                      <text
                        x={node.x + 14}
                        y={node.y + 54}
                        fill={node.type === "output" ? "#c45a2d" : "#444"}
                        fontSize={7}
                        letterSpacing="0.08em"
                      >
                        {node.badge}
                      </text>
                    </g>
                  )}

                  {/* Green dot for transform (active indicator) */}
                  {node.type === "transform" && (
                    <circle
                      cx={node.x + NODE_W - 12}
                      cy={node.y + 14}
                      r={3}
                      fill="#00ff41"
                      className="animate-pulse-slow"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Bottom-right metadata overlay */}
          <div className="absolute right-6 bottom-6 text-right font-mono text-[10px] leading-[1.8] text-secondary">
            <div>
              SOURCES: <span className="text-foreground">3</span>
            </div>
            <div>
              TRANSFORMS: <span className="text-foreground">7</span>
            </div>
            <div>
              LATENCY: <span className="text-foreground">3.8min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
