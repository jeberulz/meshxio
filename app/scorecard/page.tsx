"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

type DomainStatus = "READY" | "ATTENTION" | "BLOCKED";
type BlockerSeverity = "CRITICAL" | "HIGH" | "MEDIUM";

interface SubMetric {
  label: string;
  value: number;
}

interface Domain {
  id: number;
  num: string;
  name: string;
  status: DomainStatus;
  score: number;
  subMetrics: SubMetric[];
  dataProducts: number;
  consumers: number;
}

interface Blocker {
  num: string;
  domainId: number;
  description: string;
  severity: BlockerSeverity;
}

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

const DOMAINS: Domain[] = [
  {
    id: 1,
    num: "01",
    name: "SUPPLY CHAIN",
    status: "READY",
    score: 94,
    subMetrics: [
      { label: "DATA QUALITY", value: 98 },
      { label: "GOVERNANCE", value: 96 },
      { label: "FRESHNESS", value: 91 },
      { label: "SCHEMA STABILITY", value: 92 },
    ],
    dataProducts: 8,
    consumers: 23,
  },
  {
    id: 2,
    num: "02",
    name: "FLEET OPERATIONS",
    status: "READY",
    score: 87,
    subMetrics: [
      { label: "DATA QUALITY", value: 91 },
      { label: "GOVERNANCE", value: 85 },
      { label: "FRESHNESS", value: 88 },
      { label: "SCHEMA STABILITY", value: 84 },
    ],
    dataProducts: 6,
    consumers: 15,
  },
  {
    id: 3,
    num: "03",
    name: "CUSTOMER ANALYTICS",
    status: "ATTENTION",
    score: 68,
    subMetrics: [
      { label: "DATA QUALITY", value: 82 },
      { label: "GOVERNANCE", value: 71 },
      { label: "FRESHNESS", value: 74 },
      { label: "SCHEMA STABILITY", value: 45 },
    ],
    dataProducts: 5,
    consumers: 31,
  },
  {
    id: 4,
    num: "04",
    name: "FINANCE & BILLING",
    status: "READY",
    score: 91,
    subMetrics: [
      { label: "DATA QUALITY", value: 95 },
      { label: "GOVERNANCE", value: 98 },
      { label: "FRESHNESS", value: 82 },
      { label: "SCHEMA STABILITY", value: 89 },
    ],
    dataProducts: 3,
    consumers: 8,
  },
  {
    id: 5,
    num: "05",
    name: "PARTNER NETWORK",
    status: "ATTENTION",
    score: 53,
    subMetrics: [
      { label: "DATA QUALITY", value: 61 },
      { label: "GOVERNANCE", value: 48 },
      { label: "FRESHNESS", value: 67 },
      { label: "SCHEMA STABILITY", value: 36 },
    ],
    dataProducts: 1,
    consumers: 4,
  },
  {
    id: 6,
    num: "06",
    name: "HR & WORKFORCE",
    status: "BLOCKED",
    score: 29,
    subMetrics: [
      { label: "DATA QUALITY", value: 44 },
      { label: "GOVERNANCE", value: 22 },
      { label: "FRESHNESS", value: 31 },
      { label: "SCHEMA STABILITY", value: 19 },
    ],
    dataProducts: 1,
    consumers: 2,
  },
];

const BLOCKERS: Blocker[] = [
  {
    num: "01",
    domainId: 6,
    description:
      "HR & WORKFORCE: PII fields detected without encryption. 12 tables flagged. GDPR non-compliant.",
    severity: "CRITICAL",
  },
  {
    num: "02",
    domainId: 5,
    description:
      "PARTNER NETWORK: Governance policies undefined for 3 of 4 data products. No data owner assigned.",
    severity: "HIGH",
  },
  {
    num: "03",
    domainId: 3,
    description:
      "CUSTOMER ANALYTICS: Schema drift detected on customer_events table. 14 downstream consumers affected.",
    severity: "MEDIUM",
  },
  {
    num: "04",
    domainId: 5,
    description:
      "PARTNER NETWORK: Data freshness SLA breach. carrier_metrics last updated 6h ago (SLA: 1h).",
    severity: "HIGH",
  },
];

const OVERALL_SCORE = 71;

const NAV_ITEMS = [
  { num: "01", label: "DASHBOARD", description: "Overview & metrics", href: "/" },
  { num: "02", label: "CATALOG", description: "Data product catalog" },
  { num: "03", label: "SOURCES", description: "Domain data sources" },
  { num: "04", label: "GOVERNANCE", description: "Access & compliance" },
  { num: "05", label: "AI MODELS", description: "Model integrations" },
  { num: "06", label: "SETTINGS", description: "Configuration" },
  { num: "07", label: "PRESENTATION", description: "Design strategy deck", href: "/deck" },
  { num: "08", label: "AI READINESS", description: "AI readiness scorecard", href: "/scorecard" },
];

// ---------------------------------------------------------------------------
// ATOMS
// ---------------------------------------------------------------------------

function LiveDot() {
  return (
    <span className="inline-block h-[6px] w-[6px] animate-pulse-slow bg-accent-green" />
  );
}

function Badge({
  children,
  accent,
  green,
  amber,
  red,
}: {
  children: React.ReactNode;
  accent?: boolean;
  green?: boolean;
  amber?: boolean;
  red?: boolean;
}) {
  let border = "rgba(255, 255, 255, 0.1)";
  let color = "#999";
  if (accent) {
    border = "#c45a2d";
    color = "#c45a2d";
  }
  if (green) {
    border = "#00ff41";
    color = "#00ff41";
  }
  if (amber) {
    border = "#d4a017";
    color = "#d4a017";
  }
  if (red) {
    border = "#ff3344";
    color = "#ff3344";
  }
  return (
    <span
      className="font-mono text-[11px] tracking-[0.15em] px-2 py-[2px] uppercase whitespace-nowrap"
      style={{ border: `1px solid ${border}`, color }}
    >
      {children}
    </span>
  );
}

function scoreColor(score: number): string {
  if (score >= 80) return "#00ff41";
  if (score >= 50) return "#d4a017";
  return "#ff3344";
}

function ProgressBar({
  score,
  delay = 0,
  height = 2,
}: {
  score: number;
  delay?: number;
  height?: number;
}) {
  return (
    <div
      className="w-full"
      style={{ height: `${height}px`, backgroundColor: "#1a1a1a" }}
    >
      <motion.div
        className="h-full"
        style={{ backgroundColor: scoreColor(score) }}
        initial={{ width: "0%" }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.6, ease: "easeOut", delay }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// TOP BAR
// ---------------------------------------------------------------------------

function TopBar({
  catalogOpen,
  onToggleCatalog,
}: {
  catalogOpen: boolean;
  onToggleCatalog: () => void;
}) {
  return (
    <div className="flex items-center border-b border-border shrink-0">
      <div className="flex items-center gap-3 border-r border-border px-6 py-3">
        <LiveDot />
        <span className="font-mono text-[11px] tracking-[0.2em] text-foreground uppercase">
          MESHX FOUNDATION
        </span>
      </div>
      <div className="border-r border-border px-6 py-3">
        <span className="font-mono text-[11px] tracking-[0.2em] text-tertiary">
          V. 1.0
        </span>
      </div>
      <div className="flex-1 px-6 py-3 text-right">
        <button
          onClick={onToggleCatalog}
          className="font-mono text-[12px] tracking-[0.15em] text-secondary transition-colors duration-150 hover:text-foreground cursor-pointer"
        >
          CATALOG{" "}
          <motion.span
            animate={{ rotate: catalogOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            +
          </motion.span>
        </button>
      </div>
      <div className="border-l border-border px-6 py-3">
        <span className="font-mono text-[11px] tracking-[0.2em] text-secondary uppercase">
          AI READINESS REPORT
        </span>
      </div>
      <div className="border-l border-border px-6 py-3">
        <span className="font-mono text-[11px] tracking-[0.2em] text-tertiary">
          LAST SCAN: 2025-02-17 09:41 UTC
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HERO SECTION
// ---------------------------------------------------------------------------

function HeroSection() {
  return (
    <div className="border-b border-border px-8 py-12">
      <h1 className="font-display text-[72px] font-black uppercase leading-[0.9] tracking-tight text-foreground">
        AI READINESS
      </h1>
      <div
        className="mt-6 pl-5"
        style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.15)" }}
      >
        <p className="font-mono text-[13px] leading-[1.8] text-secondary">
          Enterprise-wide assessment of data readiness for AI model training and
          deployment.
          <br />6 domains scanned. 3 ready for immediate AI deployment.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// OVERALL SCORE BAR
// ---------------------------------------------------------------------------

function OverallScoreBar() {
  return (
    <div className="border-b border-border">
      <div className="flex items-center px-8 py-6 gap-8">
        <div className="shrink-0">
          <span className="font-mono text-[11px] tracking-[0.2em] text-secondary uppercase">
            OVERALL READINESS
          </span>
        </div>
        <div className="shrink-0">
          <span className="font-display text-[56px] font-black text-foreground leading-none">
            {OVERALL_SCORE}%
          </span>
        </div>
        <div className="flex-1">
          <div
            className="h-[4px] w-full"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <motion.div
              className="h-full"
              style={{ backgroundColor: "#c45a2d" }}
              initial={{ width: "0%" }}
              animate={{ width: `${OVERALL_SCORE}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            />
          </div>
        </div>
      </div>
      <div className="flex border-t border-border">
        {[
          { label: "DOMAINS READY", value: "3 / 6" },
          { label: "DATA PRODUCTS", value: "24 active" },
          { label: "BLOCKERS", value: "4 critical", danger: true },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`flex-1 px-8 py-5 ${
              i < 2 ? "border-r border-border" : ""
            }`}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-secondary">
              {stat.label}
            </div>
            <div
              className="mt-1 font-mono text-[14px] font-bold"
              style={{ color: stat.danger ? "#ff3344" : "#e5e5e5" }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DOMAIN CARD
// ---------------------------------------------------------------------------

function DomainCard({
  domain,
  index,
  isHighlighted,
  highlightColor,
}: {
  domain: Domain;
  index: number;
  isHighlighted: boolean;
  highlightColor: string | null;
}) {
  const [hovered, setHovered] = useState(false);

  const borderColor =
    isHighlighted && highlightColor
      ? highlightColor
      : hovered
        ? "rgba(255, 255, 255, 0.5)"
        : "rgba(255, 255, 255, 0.08)";

  const isBlocked = domain.status === "BLOCKED";
  const topBorderWidth = isBlocked ? "2px" : "1px";
  const topBorderColor = isBlocked ? "rgba(255, 51, 68, 0.4)" : borderColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col p-6"
      style={{
        borderLeftWidth: "1px",
        borderRightWidth: "1px",
        borderBottomWidth: "1px",
        borderTopWidth: topBorderWidth,
        borderLeftColor: borderColor,
        borderRightColor: borderColor,
        borderBottomColor: borderColor,
        borderTopColor: topBorderColor,
        borderStyle: "solid",
        backgroundColor: "#0a0a0a",
        transition: "border-color 0.15s ease",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span
            className="font-mono text-[12px]"
            style={{ color: "#666" }}
          >
            {domain.num}
          </span>
          <div className="mt-1 font-mono text-[14px] font-bold tracking-wide text-foreground uppercase">
            {domain.name}
          </div>
        </div>
        <Badge
          green={domain.status === "READY"}
          amber={domain.status === "ATTENTION"}
          red={domain.status === "BLOCKED"}
        >
          {domain.status}
        </Badge>
      </div>

      {/* Score + bar */}
      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[11px] tracking-[0.15em] text-secondary uppercase">
            READINESS
          </span>
          <span className="font-mono text-[20px] font-bold text-foreground">
            {domain.score}%
          </span>
        </div>
        <div className="mt-2">
          <ProgressBar
            score={domain.score}
            delay={index * 0.1 + 0.3}
            height={3}
          />
        </div>
      </div>

      {/* Sub-metrics */}
      <div className="mt-5 flex flex-col gap-2">
        {domain.subMetrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.15em] text-secondary uppercase">
              {m.label}
            </span>
            <span
              className="font-mono text-[11px]"
              style={{ color: scoreColor(m.value) }}
            >
              {m.value}%
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="mt-5 flex gap-6 pt-4"
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
      >
        <div>
          <div className="font-mono text-[10px] tracking-[0.15em] text-secondary uppercase">
            DATA PRODUCTS
          </div>
          <div className="mt-1 font-mono text-[13px] text-foreground">
            {domain.dataProducts}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.15em] text-secondary uppercase">
            CONSUMERS
          </div>
          <div className="mt-1 font-mono text-[13px] text-foreground">
            {domain.consumers}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// DOMAIN GRID
// ---------------------------------------------------------------------------

function severityColor(severity: BlockerSeverity): string {
  if (severity === "CRITICAL") return "#ff3344";
  return "#d4a017";
}

function DomainGrid({
  hoveredBlockerDomainId,
  hoveredBlockerSeverity,
}: {
  hoveredBlockerDomainId: number | null;
  hoveredBlockerSeverity: BlockerSeverity | null;
}) {
  return (
    <div className="border-b border-border px-8 py-8">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        {DOMAINS.map((domain, i) => (
          <div key={domain.id} style={{ backgroundColor: "#050505" }}>
            <DomainCard
              domain={domain}
              index={i}
              isHighlighted={hoveredBlockerDomainId === domain.id}
              highlightColor={
                hoveredBlockerDomainId === domain.id && hoveredBlockerSeverity
                  ? severityColor(hoveredBlockerSeverity)
                  : null
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BLOCKERS SECTION
// ---------------------------------------------------------------------------

function BlockersSection({
  onBlockerHover,
  onBlockerLeave,
}: {
  onBlockerHover: (domainId: number, severity: BlockerSeverity) => void;
  onBlockerLeave: () => void;
}) {
  return (
    <div className="border-b border-border">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-8 py-5">
        <span className="inline-block h-[6px] w-[6px] animate-pulse-slow bg-accent-red" />
        <span className="font-mono text-[11px] tracking-[0.2em] text-foreground uppercase">
          CRITICAL BLOCKERS
        </span>
      </div>

      {/* Blocker rows */}
      {BLOCKERS.map((blocker, i) => (
        <div
          key={blocker.num}
          className={`flex items-start gap-5 px-8 py-5 transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)] ${
            i < BLOCKERS.length - 1 ? "border-b border-border" : ""
          }`}
          onMouseEnter={() => onBlockerHover(blocker.domainId, blocker.severity)}
          onMouseLeave={onBlockerLeave}
        >
          <span
            className="font-mono text-[11px] shrink-0 pt-[2px]"
            style={{ color: "#666" }}
          >
            {blocker.num}
          </span>
          <p className="font-mono text-[12px] leading-[1.7] text-secondary flex-1">
            {blocker.description}
          </p>
          <span className="shrink-0">
            <Badge
              red={blocker.severity === "CRITICAL"}
              amber={blocker.severity === "HIGH" || blocker.severity === "MEDIUM"}
            >
              SEVERITY: {blocker.severity}
            </Badge>
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// BOTTOM CTA BAR
// ---------------------------------------------------------------------------

function BottomCTABar() {
  const [flashing, setFlashing] = useState(false);

  function handleClick() {
    setFlashing(true);
    setTimeout(() => setFlashing(false), 300);
  }

  return (
    <div className="flex items-center justify-between px-8 py-5 border-t border-border">
      <p className="font-mono text-[12px] leading-[1.7] text-secondary">
        RECOMMENDED NEXT STEP: Resolve HR & WORKFORCE governance blockers to
        increase overall readiness to 79%
      </p>
      <button
        onClick={handleClick}
        className="font-mono text-[12px] tracking-[0.15em] px-6 py-3 shrink-0 cursor-pointer"
        style={{
          border: `1px solid ${flashing ? "#c45a2d" : "rgba(255, 255, 255, 0.15)"}`,
          color: "#c45a2d",
          transition: flashing ? "none" : "border-color 0.3s ease",
          backgroundColor: "transparent",
        }}
      >
        Begin Remediation {"->"}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------

export default function ScorecardPage() {
  const [hoveredBlockerDomainId, setHoveredBlockerDomainId] = useState<
    number | null
  >(null);
  const [hoveredBlockerSeverity, setHoveredBlockerSeverity] =
    useState<BlockerSeverity | null>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);

  useEffect(() => {
    if (!catalogOpen) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setCatalogOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [catalogOpen]);

  return (
    <div className="min-h-screen w-full bg-background bg-grid">
      <TopBar
        catalogOpen={catalogOpen}
        onToggleCatalog={() => setCatalogOpen((p) => !p)}
      />
      <HeroSection />
      <OverallScoreBar />
      <DomainGrid
        hoveredBlockerDomainId={hoveredBlockerDomainId}
        hoveredBlockerSeverity={hoveredBlockerSeverity}
      />
      <BlockersSection
        onBlockerHover={(domainId, severity) => {
          setHoveredBlockerDomainId(domainId);
          setHoveredBlockerSeverity(severity);
        }}
        onBlockerLeave={() => {
          setHoveredBlockerDomainId(null);
          setHoveredBlockerSeverity(null);
        }}
      />
      <BottomCTABar />

      {/* CATALOG NAV OVERLAY */}
      <AnimatePresence>
        {catalogOpen && (
          <motion.div
            key="catalog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col bg-background"
          >
            <div className="flex items-center justify-between border-b border-border px-8 py-4">
              <span className="font-mono text-[12px] tracking-[0.2em] text-foreground">
                MESHX FOUNDATION
              </span>
              <button
                onClick={() => setCatalogOpen(false)}
                className="font-mono text-[12px] tracking-[0.15em] text-secondary transition-colors duration-150 hover:text-foreground cursor-pointer"
              >
                CLOSE ×
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-center px-12 md:px-24">
              {NAV_ITEMS.map((item, i) => {
                const inner = (
                  <>
                    <span className="font-mono text-[13px] tracking-[0.2em] text-secondary transition-colors duration-150 group-hover:text-accent-orange">
                      {item.num}
                    </span>
                    <span className="font-mono text-[42px] font-black uppercase leading-none tracking-tight text-foreground transition-colors duration-150 group-hover:text-accent-orange md:text-[56px]">
                      {item.label}
                    </span>
                    <span className="hidden font-mono text-[12px] tracking-[0.15em] text-secondary transition-colors duration-150 group-hover:text-accent-orange md:inline">
                      {item.description}
                    </span>
                    <span className="ml-auto font-mono text-[14px] text-secondary opacity-0 transition-all duration-150 group-hover:text-accent-orange group-hover:opacity-100">
                      {"->"}
                    </span>
                  </>
                );

                const className =
                  "group flex items-baseline gap-6 border-b border-border py-6 text-left transition-colors duration-150 hover:border-accent-orange";

                return item.href ? (
                  <motion.div
                    key={item.num}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link href={item.href} className={className}>
                      {inner}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.button
                    key={item.num}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    onClick={() => setCatalogOpen(false)}
                    className={className}
                  >
                    {inner}
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-border px-8 py-4">
              <span className="font-mono text-[11px] tracking-[0.2em] text-secondary">
                V. 1.0
              </span>
              <span className="font-mono text-[11px] tracking-[0.15em] text-secondary">
                ESC TO CLOSE
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
