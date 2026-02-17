"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

const TRANSFORM_LOG = [
  { step: "MERGE", detail: "Joined warehouse + shipment tables on order_id", timestamp: "3.8 min ago" },
  { step: "DEDUPE", detail: "Removed 847 duplicate records (0.007%)", timestamp: "3.8 min ago" },
  { step: "VALIDATE", detail: "Schema validation: 847/851 checks passed", timestamp: "3.7 min ago" },
  { step: "ENRICH", detail: "Added carrier_rating from partner API", timestamp: "3.7 min ago" },
  { step: "CONVERT", detail: "Timestamps normalized to UTC", timestamp: "3.6 min ago" },
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

const QUALITY_ISSUES = [
  { id: "W-001", field: "carrier_id", issue: "12 null values detected in batch 847B", severity: "warning" as const, detected: "34 min ago", owner: "Sarah Kim" },
  { id: "W-002", field: "shipment_date", issue: "3 records outside expected range (2025-2030)", severity: "warning" as const, detected: "34 min ago", owner: "Rajesh Patel" },
  { id: "W-003", field: "carrier_id", issue: "Schema drift: field type changed string → int in source", severity: "warning" as const, detected: "2h ago", owner: "Sarah Kim" },
  { id: "W-004", field: "warehouse_code", issue: "1 unrecognized code: WH-099 not in master list", severity: "info" as const, detected: "6h ago", owner: "Maria Chen" },
];

const AI_MODELS = [
  { name: "Delivery Time Predictor", type: "REGRESSION", compatibility: 98, lastTrained: "2h ago", status: "active" as const },
  { name: "Route Optimizer", type: "OPTIMIZATION", compatibility: 94, lastTrained: "18h ago", status: "active" as const },
  { name: "Demand Forecaster", type: "TIME-SERIES", compatibility: 87, lastTrained: "3 days ago", status: "retraining" as const },
];

const DOWNSTREAM_CONSUMERS = [
  { name: "EU Logistics Dashboard", type: "DASHBOARD", team: "Operations", lastAccessed: "4 min ago" },
  { name: "Delivery Time Predictor", type: "AI MODEL", team: "Data Science", lastAccessed: "2h ago" },
  { name: "SLA Breach Alert", type: "AUTOMATION", team: "Operations", lastAccessed: "12 min ago" },
  { name: "Weekly Ops Report", type: "REPORT", team: "Leadership", lastAccessed: "2 days ago" },
];

const SOURCE_DETAILS: Record<
  SourceNodeId,
  {
    owner: string;
    team: string;
    lastSync: string;
    recordCount: string;
    slaStatus: "on-time" | "breached";
    uptimePct: number;
    weeklyVolume: number[];
  }
> = {
  "sap-erp": {
    owner: "Maria Chen",
    team: "Logistics EU",
    lastSync: "2 min ago",
    recordCount: "4.2M",
    slaStatus: "on-time",
    uptimePct: 99.7,
    weeklyVolume: [42, 38, 45, 41, 47, 44, 46],
  },
  "kafka-stream": {
    owner: "Rajesh Patel",
    team: "Transport Ops",
    lastSync: "< 1 min ago",
    recordCount: "6.1M",
    slaStatus: "on-time",
    uptimePct: 99.9,
    weeklyVolume: [120, 135, 128, 142, 138, 145, 150],
  },
  "rest-api": {
    owner: "Sarah Kim",
    team: "Partner Network",
    lastSync: "47 min ago",
    recordCount: "2.1M",
    slaStatus: "breached",
    uptimePct: 94.2,
    weeklyVolume: [18, 22, 15, 20, 12, 19, 21],
  },
};

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

function sparklinePoints(
  data: number[],
  width: number,
  height: number,
): string {
  if (data.length === 0) return "";
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  return data
    .map((val, i) => {
      const x = i * stepX;
      const y = height - ((val - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Home() {
  const [hoveredNode, setHoveredNode] = useState<NodeId | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<SourceNodeId | null>(
    null,
  );
  const [qualityExpanded, setQualityExpanded] = useState(false);
  const [domainsExpanded, setDomainsExpanded] = useState(false);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const feNodeRef = useRef<SVGGElement>(null);
  const [feTooltipPos, setFeTooltipPos] = useState<{
    left: number;
    top: number;
  } | null>(null);

  useEffect(() => {
    if (
      hoveredNode !== "foundation-engine" ||
      !feNodeRef.current ||
      !svgContainerRef.current
    ) {
      setFeTooltipPos(null);
      return;
    }
    const feRect = feNodeRef.current.getBoundingClientRect();
    const containerRect = svgContainerRef.current.getBoundingClientRect();
    setFeTooltipPos({
      left: feRect.left - containerRect.left - 12,
      top: feRect.top - containerRect.top,
    });
  }, [hoveredNode]);

  useEffect(() => {
    if (!selectedSource) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Element;
      if (target.closest?.("[data-source-node]")) return;
      if (
        detailPanelRef.current &&
        !detailPanelRef.current.contains(target)
      ) {
        setSelectedSource(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedSource]);

  useEffect(() => {
    if (!modelModalOpen) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setModelModalOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [modelModalOpen]);

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
          {STATS.map((stat, i) => {
            const isDomains = stat.label === "DOMAINS";
            return (
              <div
                key={stat.label}
                className={`flex-1 px-8 py-5 ${i < STATS.length - 1 ? "border-r border-border" : ""} ${isDomains ? "transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)]" : ""}`}
                style={{
                  cursor: isDomains ? "pointer" : undefined,
                  borderBottom: isDomains && domainsExpanded ? "1px solid #c45a2d" : undefined,
                }}
                onClick={isDomains ? () => setDomainsExpanded((p) => !p) : undefined}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">
                  {stat.label}
                </div>
                <div className="mt-1 flex items-center gap-2 font-mono text-[14px] text-foreground">
                  {stat.value}
                  {isDomains && (
                    <motion.span
                      animate={{ rotate: domainsExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[10px] text-accent-orange"
                    >
                      ▶
                    </motion.span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Downstream Consumers Panel */}
        <AnimatePresence>
          {domainsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ overflow: "hidden" }}
            >
              <div
                className="border-b border-border px-8 py-5"
                style={{ backgroundColor: "rgba(196, 90, 45, 0.03)" }}
              >
                <div className="font-mono text-[10px] tracking-[0.2em] text-accent-orange">
                  DOWNSTREAM CONSUMERS: {DOWNSTREAM_CONSUMERS.length}
                </div>
                <div className="mt-2 font-mono text-[11px] leading-[1.7] text-secondary">
                  If this data product goes offline, these systems are affected.
                </div>
                <div className="mt-4">
                  {DOWNSTREAM_CONSUMERS.map((consumer, i) => (
                    <motion.div
                      key={consumer.name}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="py-3"
                      style={{
                        borderBottom:
                          i < DOWNSTREAM_CONSUMERS.length - 1
                            ? "1px solid rgba(255, 255, 255, 0.08)"
                            : undefined,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[12px] font-bold tracking-wide text-foreground">
                          {consumer.name}
                        </span>
                        <span
                          className="font-mono text-[9px] tracking-[0.15em] px-2 py-[2px]"
                          style={{
                            border:
                              consumer.type === "AI MODEL"
                                ? "1px solid #c45a2d"
                                : "1px solid rgba(255, 255, 255, 0.1)",
                            color: consumer.type === "AI MODEL" ? "#c45a2d" : "#666",
                          }}
                        >
                          {consumer.type}
                        </span>
                      </div>
                      <div className="mt-1 font-mono text-[10px] text-secondary">
                        {consumer.team} &middot; {consumer.lastAccessed}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature List */}
        <div className="flex-1 overflow-auto">
          {FEATURES.map((feature) => {
            const highlighted = sourceForFeature(feature.nodeId);
            const isQuality = feature.num === "01";
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
                  cursor: isQuality ? "pointer" : undefined,
                }}
                onMouseEnter={() => setHoveredNode(feature.nodeId)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={isQuality ? () => setQualityExpanded((p) => !p) : undefined}
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
                    {/* Quality Issues Expanded Panel */}
                    {isQuality && (
                      <AnimatePresence>
                        {qualityExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            style={{ overflow: "hidden" }}
                          >
                            <div
                              className="mt-4 pt-4"
                              style={{ borderTop: "1px solid #d4a017" }}
                            >
                              <div
                                className="font-mono text-[10px] tracking-[0.2em]"
                                style={{ color: "#d4a017" }}
                              >
                                {QUALITY_ISSUES.length} ISSUES DETECTED
                              </div>
                              <div className="mt-3">
                                {QUALITY_ISSUES.map((issue, i) => (
                                  <motion.div
                                    key={issue.id}
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="py-3"
                                    style={{
                                      borderBottom:
                                        i < QUALITY_ISSUES.length - 1
                                          ? "1px solid rgba(255, 255, 255, 0.08)"
                                          : undefined,
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span
                                        className="font-mono text-[10px]"
                                        style={{ color: "#444" }}
                                      >
                                        {issue.id}
                                      </span>
                                      <span className="font-mono text-[10px] text-foreground">
                                        {issue.field}
                                      </span>
                                      <span className="flex-1 font-mono text-[10px] text-secondary">
                                        {issue.issue}
                                      </span>
                                      <span
                                        className="font-mono text-[8px] tracking-[0.15em] px-2 py-[1px]"
                                        style={{
                                          border:
                                            issue.severity === "warning"
                                              ? "1px solid #d4a017"
                                              : "1px solid rgba(255, 255, 255, 0.1)",
                                          color:
                                            issue.severity === "warning"
                                              ? "#d4a017"
                                              : "#666",
                                        }}
                                      >
                                        {issue.severity === "warning" ? "WARNING" : "INFO"}
                                      </span>
                                    </div>
                                    <div className="mt-1 font-mono text-[9px] text-secondary">
                                      Detected {issue.detected} &middot; {issue.owner}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <button
          onClick={() => setModelModalOpen(true)}
          className="flex w-full items-center justify-between border-t border-border px-8 py-5 font-mono text-[12px] tracking-[0.15em] text-foreground transition-all duration-150 hover:border-t-accent-orange hover:bg-[rgba(196,90,45,0.08)]"
        >
          <span>Connect to AI Model</span>
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
        <div ref={svgContainerRef} className="relative flex-1 overflow-hidden p-4">
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
              const isSelected = selectedSource === node.id;
              const borderColor =
                isSelected || hovered
                  ? "#c45a2d"
                  : "rgba(255, 255, 255, 0.1)";

              return (
                <g
                  key={node.id}
                  ref={node.id === "foundation-engine" ? feNodeRef : undefined}
                  data-source-node={
                    node.type === "source" ? node.id : undefined
                  }
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={
                    node.type === "source"
                      ? () =>
                          setSelectedSource((prev) =>
                            prev === node.id
                              ? null
                              : (node.id as SourceNodeId),
                          )
                      : undefined
                  }
                  style={{
                    cursor:
                      node.type === "source" || node.type === "transform"
                        ? "pointer"
                        : "default",
                  }}
                >
                  {/* Node rect */}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={NODE_W}
                    height={NODE_H}
                    fill="#0a0a0a"
                    stroke={borderColor}
                    strokeWidth={isSelected ? 1.5 : 0.5}
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

          {/* Transform tooltip */}
          <AnimatePresence>
            {hoveredNode === "foundation-engine" && feTooltipPos && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="pointer-events-none absolute z-20 w-[320px] border border-border-bright font-mono"
                style={{
                  left: feTooltipPos.left,
                  top: feTooltipPos.top,
                  transform: "translateX(-100%)",
                  backgroundColor: "#0a0a0a",
                  maxWidth: feTooltipPos.left,
                }}
              >
                <div className="border-b border-border-bright px-3 py-2">
                  <span className="text-[10px] tracking-[0.2em] text-secondary">
                    LAST TRANSFORMATION RUN
                  </span>
                </div>
                {TRANSFORM_LOG.map((entry, i) => (
                  <div
                    key={entry.step}
                    className={`flex items-baseline justify-between gap-3 px-3 py-2${i < TRANSFORM_LOG.length - 1 ? " border-b border-border-bright" : ""}`}
                  >
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-foreground">
                        {entry.step}
                      </span>
                      <span className="text-[9px] leading-tight text-secondary">
                        {entry.detail}
                      </span>
                    </div>
                    <span className="shrink-0 text-[9px] text-[#333]">
                      {entry.timestamp}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

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

          {/* Source Detail Panel */}
          <AnimatePresence>
            {selectedSource &&
              (() => {
                const detail = SOURCE_DETAILS[selectedSource];
                const sourceNode = NODES.find(
                  (n) => n.id === selectedSource,
                )!;
                const slaColor =
                  detail.slaStatus === "on-time" ? "#00ff41" : "#ff3344";

                return (
                  <motion.div
                    ref={detailPanelRef}
                    key={selectedSource}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    transition={{
                      type: "tween",
                      duration: 0.25,
                      ease: "easeOut",
                    }}
                    className="absolute inset-y-0 right-0 z-10 flex w-[25vw] flex-col overflow-y-auto"
                    style={{
                      backgroundColor: "#0a0a0a",
                      borderLeft: "1px solid #c45a2d",
                    }}
                  >
                    {/* Header */}
                    <div
                      className="flex items-center justify-between px-5 py-4"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <span
                        className="font-mono text-[10px] tracking-[0.2em]"
                        style={{ color: "#e5e5e5" }}
                      >
                        SOURCE DETAIL
                      </span>
                      <button
                        onClick={() => setSelectedSource(null)}
                        className="font-mono text-[12px] transition-colors"
                        style={{ color: "#555" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#e5e5e5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#555")
                        }
                      >
                        X
                      </button>
                    </div>

                    {/* System Name */}
                    <div
                      className="px-5 py-4"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div
                        className="font-mono text-[9px] tracking-[0.2em]"
                        style={{ color: "#555" }}
                      >
                        SYSTEM
                      </div>
                      <div
                        className="mt-1 font-mono text-[14px] font-bold tracking-wide"
                        style={{ color: "#e5e5e5" }}
                      >
                        {sourceNode.systemName}
                      </div>
                      <div
                        className="mt-1 font-mono text-[9px] tracking-[0.15em]"
                        style={{ color: "#c45a2d" }}
                      >
                        {sourceNode.label}
                      </div>
                    </div>

                    {/* Owner + Team */}
                    <div
                      className="flex"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div
                        className="flex-1 px-5 py-3"
                        style={{
                          borderRight: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div
                          className="font-mono text-[9px] tracking-[0.2em]"
                          style={{ color: "#555" }}
                        >
                          OWNER
                        </div>
                        <div
                          className="mt-1 font-mono text-[11px]"
                          style={{ color: "#e5e5e5" }}
                        >
                          {detail.owner}
                        </div>
                      </div>
                      <div className="flex-1 px-5 py-3">
                        <div
                          className="font-mono text-[9px] tracking-[0.2em]"
                          style={{ color: "#555" }}
                        >
                          TEAM
                        </div>
                        <div
                          className="mt-1 font-mono text-[11px]"
                          style={{ color: "#e5e5e5" }}
                        >
                          {detail.team}
                        </div>
                      </div>
                    </div>

                    {/* Last Sync + Records */}
                    <div
                      className="flex"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div
                        className="flex-1 px-5 py-3"
                        style={{
                          borderRight: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div
                          className="font-mono text-[9px] tracking-[0.2em]"
                          style={{ color: "#555" }}
                        >
                          LAST SYNC
                        </div>
                        <div
                          className="mt-1 font-mono text-[11px]"
                          style={{ color: "#e5e5e5" }}
                        >
                          {detail.lastSync}
                        </div>
                      </div>
                      <div className="flex-1 px-5 py-3">
                        <div
                          className="font-mono text-[9px] tracking-[0.2em]"
                          style={{ color: "#555" }}
                        >
                          RECORDS
                        </div>
                        <div
                          className="mt-1 font-mono text-[11px]"
                          style={{ color: "#e5e5e5" }}
                        >
                          {detail.recordCount}
                        </div>
                      </div>
                    </div>

                    {/* SLA + Uptime */}
                    <div
                      className="flex"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div
                        className="flex-1 px-5 py-3"
                        style={{
                          borderRight: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <div
                          className="font-mono text-[9px] tracking-[0.2em]"
                          style={{ color: "#555" }}
                        >
                          SLA STATUS
                        </div>
                        <div className="mt-2">
                          <span
                            className="font-mono text-[9px] tracking-[0.15em]"
                            style={{
                              border: `1px solid ${slaColor}`,
                              color: slaColor,
                              padding: "2px 8px",
                            }}
                          >
                            {detail.slaStatus === "on-time"
                              ? "ON-TIME"
                              : "SLA: BREACHED"}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 px-5 py-3">
                        <div
                          className="font-mono text-[9px] tracking-[0.2em]"
                          style={{ color: "#555" }}
                        >
                          UPTIME
                        </div>
                        <div
                          className="mt-1 font-mono text-[14px]"
                          style={{ color: "#e5e5e5" }}
                        >
                          {detail.uptimePct}%
                        </div>
                      </div>
                    </div>

                    {/* Sparkline */}
                    <div className="px-5 py-4">
                      <div
                        className="font-mono text-[9px] tracking-[0.2em]"
                        style={{ color: "#555" }}
                      >
                        7-DAY VOLUME
                      </div>
                      <div
                        className="mt-3"
                        style={{
                          border: "1px solid rgba(255,255,255,0.08)",
                          padding: "12px",
                        }}
                      >
                        <svg
                          viewBox="0 0 200 60"
                          className="w-full"
                          style={{ display: "block" }}
                        >
                          <polyline
                            points={sparklinePoints(
                              detail.weeklyVolume,
                              200,
                              60,
                            )}
                            fill="none"
                            stroke="#c45a2d"
                            strokeWidth={1.5}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          />
                          {detail.weeklyVolume.map((val, i) => {
                            const max = Math.max(...detail.weeklyVolume);
                            const min = Math.min(...detail.weeklyVolume);
                            const range = max - min || 1;
                            const stepX =
                              200 / (detail.weeklyVolume.length - 1);
                            const x = i * stepX;
                            const y =
                              60 - ((val - min) / range) * 60;
                            return (
                              <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r={2}
                                fill="#0a0a0a"
                                stroke="#c45a2d"
                                strokeWidth={1}
                              />
                            );
                          })}
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
          </AnimatePresence>
        </div>
      </div>

      {/* ================================================================ */}
      {/* AI MODEL MODAL                                                   */}
      {/* ================================================================ */}
      <AnimatePresence>
        {modelModalOpen && (
          <motion.div
            key="model-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            onClick={() => setModelModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[500px] border border-border-bright"
              style={{ backgroundColor: "#0a0a0a" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="border-b border-border px-6 py-5">
                <div className="font-mono text-[11px] tracking-[0.2em] text-foreground">
                  AVAILABLE MODELS
                </div>
                <div className="mt-1 font-mono text-[11px] text-secondary">
                  Compatible AI models for this data product
                </div>
              </div>

              {/* Model Rows */}
              <div>
                {AI_MODELS.map((model) => (
                  <div
                    key={model.name}
                    className="border-b border-border px-6 py-4 transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)]"
                  >
                    {/* Name + Type Badge */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[12px] font-bold tracking-wide text-foreground">
                        {model.name}
                      </span>
                      <span
                        className="font-mono text-[9px] tracking-[0.15em] px-2 py-[2px]"
                        style={{
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          color: "#666",
                        }}
                      >
                        {model.type}
                      </span>
                    </div>

                    {/* Compatibility Bar */}
                    <div className="mt-3 flex items-center gap-3">
                      <span className="font-mono text-[9px] tracking-[0.15em] text-secondary">
                        COMPATIBILITY: {model.compatibility}%
                      </span>
                      <div className="h-[2px] flex-1 bg-border-bright">
                        <div
                          className="h-full bg-accent-orange transition-all duration-500"
                          style={{ width: `${model.compatibility}%` }}
                        />
                      </div>
                    </div>

                    {/* Last Trained + Status Badge */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-secondary">
                        Last trained: {model.lastTrained}
                      </span>
                      <span
                        className="font-mono text-[9px] tracking-[0.15em] px-2 py-[2px]"
                        style={{
                          border: `1px solid ${model.status === "active" ? "#00ff41" : "#f59e0b"}`,
                          color: model.status === "active" ? "#00ff41" : "#f59e0b",
                        }}
                      >
                        {model.status === "active" ? "ACTIVE" : "RETRAINING"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Locked Deploy Bar */}
              <div className="border-t border-border px-6 py-4">
                <span className="font-mono text-[11px] tracking-[0.15em] text-secondary">
                  [LOCKED] DEPLOY REQUIRES APPROVAL
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
