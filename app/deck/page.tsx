"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

// ---------------------------------------------------------------------------
// PRESENTATION FONT SCALE
// ---------------------------------------------------------------------------
// 14px — badges, topbar labels, metadata timestamps, slide counter
// 16px — body text, descriptions, feature lists, sublines
// 18px — bold values, emphasis, names, section titles
// 22px — large display values
// 48px — slide headlines
// 96px — title/close massive text
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// SHARED ATOMS
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
  gray,
}: {
  children: React.ReactNode;
  accent?: boolean;
  green?: boolean;
  amber?: boolean;
  red?: boolean;
  gray?: boolean;
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
  if (gray) {
    border = "rgba(255, 255, 255, 0.1)";
    color = "#666";
  }
  return (
    <span
      className="font-mono text-[14px] tracking-[0.15em] px-2 py-[2px] uppercase"
      style={{ border: `1px solid ${border}`, color }}
    >
      {children}
    </span>
  );
}

function TopBar({
  left,
  right,
}: {
  left: string;
  right?: string;
}) {
  return (
    <div className="flex items-center border-b border-border shrink-0">
      <div className="flex items-center gap-3 border-r border-border px-6 py-3">
        <LiveDot />
        <span className="font-mono text-[14px] tracking-[0.2em] text-foreground uppercase">
          MESHX FOUNDATION
        </span>
      </div>
      <div className="flex-1 px-6 py-3">
        <span className="font-mono text-[14px] tracking-[0.2em] text-secondary uppercase">
          {left}
        </span>
      </div>
      {right && (
        <div className="border-l border-border px-6 py-3">
          <span className="font-mono text-[14px] tracking-[0.2em] text-secondary uppercase">
            {right}
          </span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SLIDE 01 — TITLE
// ---------------------------------------------------------------------------

function Slide01() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background bg-grid">
      {/* Left orange accent bar */}
      <div className="w-[4px] shrink-0 bg-accent-orange" />

      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <div className="flex items-center border-b border-border shrink-0">
          <div className="flex items-center gap-3 border-r border-border px-6 py-3">
            <span className="font-mono text-[14px] tracking-[0.2em] text-foreground uppercase">
              MESHX FOUNDATION
            </span>
            <LiveDot />
          </div>
          <div className="flex-1" />
          <div className="border-l border-border px-6 py-3">
            <span className="font-mono text-[14px] tracking-[0.2em] text-secondary uppercase">
              Senior Designer Interview
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col justify-center px-16">
          <h1 className="font-display text-[96px] font-black uppercase leading-[0.9] tracking-tight text-foreground">
            DATA PRODUCT
            <br />
            EXPLORER
          </h1>

          {/* Orange line */}
          <div
            className="mt-8 h-[2px] bg-accent-orange"
            style={{ width: 200 }}
          />

          <p className="mt-6 font-mono text-[18px] tracking-[0.05em] text-secondary">
            Design Strategy &amp; Interactive Prototype
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex items-end justify-between border-t border-border px-16 py-6 shrink-0">
          <div>
            <div className="font-mono text-[18px] font-bold tracking-[0.15em] text-foreground uppercase">
              JOHN ISEGHOHI
            </div>
            <div className="mt-1 font-mono text-[14px] tracking-[0.05em] text-secondary">
              Senior UX Designer / 13+ years / Amazon, Booking.com
            </div>
          </div>
          <div
            className="font-mono text-[14px] tracking-[0.15em] px-4 py-2 text-secondary"
            style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            V. 1.0
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SLIDE 02 — THE PROBLEM
// ---------------------------------------------------------------------------

function Slide02() {
  const cards = [
    {
      title: "DATA SILOS",
      icon: "◈",
      text: "Enterprises sit on mountains of data trapped across systems. When they try to build AI, they hit walls: unreliable models, unscalable pilots, months of plumbing.",
    },
    {
      title: "TWO AUDIENCES",
      icon: "◇",
      text: "Data engineers need schemas, pipelines, queries. Business stakeholders need decisions, KPIs, outcomes. Every competitor builds for one and alienates the other.",
    },
    {
      title: "TRUST DEFICIT",
      icon: "△",
      text: "If a VP can't see where data came from, they won't trust AI recommendations built on it. Lineage is buried 3 clicks deep in every competing platform.",
    },
  ];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background bg-grid">
      <TopBar left="01  THE PROBLEM" />

      <div className="flex flex-1 flex-col px-16 py-12">
        <h2 className="font-display text-[48px] font-black uppercase leading-[1.1] text-foreground max-w-[800px]">
          Enterprise data platforms fail at the design layer
        </h2>

        <div className="mt-12 flex flex-1 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-1 flex-col"
              style={{
                borderTop: "4px solid #c45a2d",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderTopColor: "#c45a2d",
                borderTopWidth: 4,
                backgroundColor: "#0a0a0a",
              }}
            >
              <div className="px-8 py-8 flex flex-col flex-1">
                <div className="text-[28px] text-accent-orange mb-4">
                  {card.icon}
                </div>
                <div className="font-mono text-[16px] font-bold tracking-[0.2em] text-foreground uppercase mb-4">
                  {card.title}
                </div>
                <p className="font-mono text-[16px] leading-[1.8] text-secondary">
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SLIDE 03 — THE OPPORTUNITY
// ---------------------------------------------------------------------------

function Slide03() {
  const notCompeting = [
    "Databricks / Snowflake (infrastructure)",
    "Atlan / Collibra (governance-first)",
    "Starburst / Denodo (technical audiences)",
  ];

  const differentiators = [
    { label: "Data Mesh Architecture", value: "Decentralized, domain-owned" },
    { label: "Multiplayer", value: "Engineers + business users together" },
    { label: "7-30 Day Time-to-Value", value: "Zero to production, fast" },
    {
      label: "NEOM City-Scale Proof",
      value: "World's first data mesh at city scale",
    },
  ];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background bg-grid">
      <TopBar left="02  THE OPPORTUNITY" />

      <div className="flex flex-1 flex-col px-16 py-12">
        <h2 className="font-display text-[48px] font-black uppercase leading-[1.1] text-foreground">
          MeshX sits in a unique position
        </h2>

        <div className="mt-12 flex flex-1 gap-6">
          {/* Left column */}
          <div
            className="flex flex-1 flex-col px-8 py-8"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backgroundColor: "#0a0a0a",
            }}
          >
            <div className="font-mono text-[14px] tracking-[0.2em] text-secondary uppercase mb-8">
              Not Competing With
            </div>
            <div className="flex flex-col gap-4">
              {notCompeting.map((item) => (
                <div
                  key={item}
                  className="font-mono text-[16px] text-foreground leading-[1.6]"
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                    paddingBottom: 12,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-auto pt-8 font-mono text-[16px] leading-[1.7] text-accent-orange">
              MeshX is the layer on top. No rip-and-replace. Works with existing
              infrastructure.
            </div>
          </div>

          {/* Right column */}
          <div
            className="flex flex-1 flex-col px-8 py-8"
            style={{
              border: "1px solid #c45a2d",
              backgroundColor: "#0a0a0a",
            }}
          >
            <div className="font-mono text-[14px] tracking-[0.2em] text-accent-orange uppercase mb-8">
              Design Differentiators
            </div>
            <div className="flex flex-col gap-0">
              {differentiators.map((d) => (
                <div
                  key={d.label}
                  className="py-4"
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div className="font-mono text-[16px] font-bold tracking-[0.1em] text-foreground uppercase">
                    {d.label}
                  </div>
                  <div className="mt-1 font-mono text-[16px] text-secondary">
                    → {d.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SLIDE 04 — DESIGN APPROACH
// ---------------------------------------------------------------------------

function Slide04() {
  const levels = [
    {
      color: "#00ff41",
      level: "LEVEL 1",
      role: "VP / DECISION MAKER",
      time: "10 seconds",
      text: "Sees headline stats: data freshness, quality score, AI readiness. Knows immediately if this data product is trustworthy.",
    },
    {
      color: "#c45a2d",
      level: "LEVEL 2",
      role: "OPS MANAGER",
      time: "1 click",
      text: "Clicks to see who owns the data, downstream dependencies, which systems break if it goes offline. Verification without engineering knowledge.",
    },
    {
      color: "#d4a017",
      level: "LEVEL 3",
      role: "DATA ENGINEER",
      time: "2 clicks",
      text: "Digs into transformation logs, schema drift warnings, null value counts, SLA breaches. Full debugging capability from the same interface.",
    },
  ];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background bg-grid">
      <TopBar left="03  DESIGN APPROACH" />

      <div className="flex flex-1 flex-col px-16 py-12">
        <h2 className="font-display text-[48px] font-black uppercase leading-[1.1] text-foreground">
          Progressive disclosure across one surface
        </h2>
        <p className="mt-3 font-mono text-[17px] text-accent-orange">
          Same page, three audiences, zero navigation.
        </p>

        <div className="mt-10 flex flex-1 flex-col gap-4">
          {levels.map((l) => (
            <div
              key={l.level}
              className="flex flex-1 items-center"
              style={{
                borderLeft: `4px solid ${l.color}`,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderLeftColor: l.color,
                borderLeftWidth: 4,
                backgroundColor: "#0a0a0a",
              }}
            >
              <div className="flex items-center gap-8 px-8 py-6 w-full">
                <div className="shrink-0 w-[140px]">
                  <div
                    className="font-mono text-[16px] font-bold tracking-[0.15em]"
                    style={{ color: l.color }}
                  >
                    {l.level}
                  </div>
                  <div className="mt-1 font-mono text-[14px] tracking-[0.1em] text-foreground uppercase">
                    {l.role}
                  </div>
                </div>
                <div className="shrink-0 w-[100px]">
                  <div className="font-mono text-[14px] tracking-[0.1em] text-secondary uppercase">
                    {l.time}
                  </div>
                </div>
                <div className="flex-1 font-mono text-[16px] leading-[1.7] text-secondary">
                  {l.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SLIDE 05 — PROTOTYPE: LAYOUT
// ---------------------------------------------------------------------------

function Slide05() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background bg-grid">
      <TopBar left="04  PROTOTYPE: LAYOUT" />

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel mockup (60%) */}
        <div
          className="flex flex-col"
          style={{
            width: "60%",
            borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Mockup top bar */}
          <div
            className="flex items-center shrink-0 px-6 py-3"
            style={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              backgroundColor: "#0a0a0a",
            }}
          >
            <span className="font-mono text-[13px] tracking-[0.2em] text-secondary">
              MESHX FOUNDATION
            </span>
            <span className="mx-3 font-mono text-[13px] text-tertiary">/</span>
            <span className="font-mono text-[13px] tracking-[0.15em] text-secondary">
              V.1.0
            </span>
            <span className="mx-3 font-mono text-[13px] text-tertiary">/</span>
            <span className="font-mono text-[13px] tracking-[0.15em] text-accent-orange">
              CATALOG
            </span>
          </div>

          <div className="flex-1 px-8 py-6 overflow-hidden">
            {/* Headline */}
            <div className="font-display text-[36px] font-black uppercase leading-[0.9] text-foreground">
              SUPPLY CHAIN
              <br />
              LOGISTICS
            </div>

            {/* Stats row */}
            <div className="mt-4 flex gap-8">
              {[
                { label: "FRESHNESS", value: "< 4min" },
                { label: "RECORDS", value: "12.4M" },
                { label: "DOMAINS", value: "3" },
              ].map((s) => (
                <div key={s.label}>
                  <span className="font-mono text-[13px] tracking-[0.15em] text-secondary">
                    {s.label}:{" "}
                  </span>
                  <span className="font-mono text-[14px] text-foreground">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Feature items */}
            <div className="mt-6 flex flex-col gap-0">
              {[
                {
                  num: "01",
                  title: "Data Quality Score",
                  value: "99.5%",
                },
                {
                  num: "02",
                  title: "Access & Governance",
                  value: "",
                },
                {
                  num: "03",
                  title: "AI Readiness",
                  value: "",
                },
              ].map((f) => (
                <div
                  key={f.num}
                  className="flex items-center justify-between py-4"
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[13px] text-secondary">
                      {f.num}
                    </span>
                    <span className="font-mono text-[15px] text-foreground">
                      {f.title}
                    </span>
                  </div>
                  {f.value && (
                    <span className="font-mono text-[15px] text-accent-orange">
                      {f.value}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-6">
              <span className="font-mono text-[14px] tracking-[0.1em] text-accent-orange">
                Connect to AI Model →
              </span>
            </div>
          </div>

          {/* Label */}
          <div className="px-8 py-3 shrink-0" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <span className="font-mono text-[14px] text-secondary">
              Data product overview for quick trust assessment
            </span>
          </div>
        </div>

        {/* Right panel mockup (40%) */}
        <div className="flex flex-col" style={{ width: "40%" }}>
          {/* Lineage header */}
          <div
            className="flex items-center gap-3 shrink-0 px-6 py-3"
            style={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              backgroundColor: "#0a0a0a",
            }}
          >
            <span className="font-mono text-[13px] tracking-[0.2em] text-foreground">
              LINEAGE: LIVE
            </span>
            <LiveDot />
          </div>

          {/* Lineage graph mockup */}
          <div className="flex-1 px-6 py-6 overflow-hidden">
            <svg viewBox="0 0 500 300" className="w-full h-full" style={{ maxHeight: "100%" }}>
              {/* Source nodes */}
              {[
                { label: "SAP_ERP", y: 30 },
                { label: "KAFKA_STREAM", y: 120 },
                { label: "REST_API", y: 210 },
              ].map((node) => (
                <g key={node.label}>
                  <rect
                    x={20}
                    y={node.y}
                    width={130}
                    height={50}
                    fill="#0a0a0a"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth={1}
                  />
                  <text
                    x={85}
                    y={node.y + 30}
                    textAnchor="middle"
                    className="font-mono"
                    fill="#e5e5e5"
                    fontSize={10}
                  >
                    {node.label}
                  </text>
                </g>
              ))}

              {/* Edges to Foundation Engine */}
              {[55, 145, 235].map((sy) => (
                <path
                  key={sy}
                  d={`M 150 ${sy} C 200 ${sy}, 210 160, 230 160`}
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth={1}
                  fill="none"
                />
              ))}

              {/* Foundation Engine */}
              <rect
                x={230}
                y={130}
                width={130}
                height={60}
                fill="#0a0a0a"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={1}
              />
              <circle cx={245} cy={145} r={3} fill="#00ff41" />
              <text
                x={295}
                y={155}
                textAnchor="middle"
                className="font-mono"
                fill="#e5e5e5"
                fontSize={9}
              >
                FOUNDATION
              </text>
              <text
                x={295}
                y={170}
                textAnchor="middle"
                className="font-mono"
                fill="#e5e5e5"
                fontSize={9}
              >
                ENGINE
              </text>

              {/* Edge to Supply Chain DP */}
              <path
                d="M 360 160 C 390 160, 390 160, 400 160"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth={1}
                fill="none"
              />

              {/* Supply Chain DP */}
              <rect
                x={400}
                y={130}
                width={90}
                height={60}
                fill="#0a0a0a"
                stroke="#c45a2d"
                strokeWidth={1}
              />
              <text
                x={445}
                y={155}
                textAnchor="middle"
                className="font-mono"
                fill="#e5e5e5"
                fontSize={9}
              >
                SUPPLY CHAIN
              </text>
              <text
                x={445}
                y={170}
                textAnchor="middle"
                className="font-mono"
                fill="#c45a2d"
                fontSize={9}
              >
                DP
              </text>
            </svg>
          </div>

          {/* Metadata */}
          <div
            className="px-6 py-3 shrink-0"
            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}
          >
            <span className="font-mono text-[13px] tracking-[0.1em] text-secondary">
              SOURCES: 3 / TRANSFORMS: 7 / LATENCY: 3.8min
            </span>
          </div>

          {/* Label */}
          <div className="px-6 py-3 shrink-0" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <span className="font-mono text-[14px] text-secondary">
              Live lineage graph showing data flow
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SLIDE 06 — INTERACTION 1: SOURCE DETAIL
// ---------------------------------------------------------------------------

function Slide06() {
  const features = [
    "Data source owner and team",
    "Last sync timestamp",
    "Record count",
    "SLA status (green / red badge)",
    "Uptime percentage",
    "7-day volume sparkline",
    "Slide-in animation from right",
  ];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background bg-grid">
      <TopBar left="05  INTERACTION 1: SOURCE DETAIL" />

      <div className="flex flex-1 flex-col px-16 py-12">
        <h2 className="font-display text-[48px] font-black uppercase leading-[1.1] text-foreground">
          Click any source node to see who owns it
        </h2>
        <p className="mt-3 font-mono text-[17px] text-accent-orange">
          Answers: &ldquo;Can I trust this data source right now?&rdquo;
        </p>

        <div className="mt-10 flex flex-1 gap-8">
          {/* Left: feature list */}
          <div
            className="flex flex-1 flex-col px-8 py-8"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backgroundColor: "#0a0a0a",
            }}
          >
            <div className="font-mono text-[14px] tracking-[0.2em] text-secondary uppercase mb-6">
              What the Panel Shows
            </div>
            <div className="flex flex-col gap-4">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <span className="text-accent-orange font-mono text-[16px] mt-[1px]">
                    ✓
                  </span>
                  <span className="font-mono text-[16px] text-foreground leading-[1.6]">
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: detail panel mockup */}
          <div
            className="flex flex-1 flex-col"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backgroundColor: "#0a0a0a",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 shrink-0"
              style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
            >
              <span className="font-mono text-[14px] tracking-[0.2em] text-foreground uppercase">
                Source Detail
              </span>
              <span className="font-mono text-[16px] text-secondary cursor-pointer">
                ✕
              </span>
            </div>

            {/* Fields */}
            <div className="flex-1 px-6 py-6">
              {[
                { label: "SYSTEM", value: "SAP_ERP" },
                { label: "OWNER", value: "Maria Chen" },
                { label: "TEAM", value: "Logistics EU" },
                { label: "LAST SYNC", value: "2 min ago" },
                { label: "RECORDS", value: "4.2M" },
              ].map((field) => (
                <div
                  key={field.label}
                  className="flex justify-between py-3"
                  style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <span className="font-mono text-[14px] tracking-[0.15em] text-secondary uppercase">
                    {field.label}
                  </span>
                  <span className="font-mono text-[16px] text-foreground">
                    {field.value}
                  </span>
                </div>
              ))}

              {/* SLA Status */}
              <div
                className="flex justify-between py-3"
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <span className="font-mono text-[14px] tracking-[0.15em] text-secondary uppercase">
                  SLA STATUS
                </span>
                <Badge green>ON-TIME</Badge>
              </div>

              {/* Uptime */}
              <div
                className="flex justify-between py-3"
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <span className="font-mono text-[14px] tracking-[0.15em] text-secondary uppercase">
                  UPTIME
                </span>
                <span className="font-mono text-[16px] text-foreground">
                  99.7%
                </span>
              </div>

              {/* 7-day volume label */}
              <div className="mt-6">
                <span className="font-mono text-[14px] tracking-[0.15em] text-secondary uppercase">
                  7-DAY VOLUME
                </span>
                {/* Sparkline */}
                <svg
                  viewBox="0 0 200 40"
                  className="mt-3 w-full"
                  style={{ height: 40 }}
                >
                  <polyline
                    points="0,30 30,25 60,20 90,28 120,15 150,18 180,10 200,12"
                    stroke="#c45a2d"
                    strokeWidth={1.5}
                    fill="none"
                  />
                  <circle cx={200} cy={12} r={3} fill="#c45a2d" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SLIDE 07 — INTERACTION 2: QUALITY DRILL-DOWN
// ---------------------------------------------------------------------------

function Slide07() {
  const issues = [
    {
      id: "W-001",
      field: "carrier_id",
      desc: "12 null values detected in batch 847B",
      severity: "WARNING",
      time: "34 min ago",
      owner: "Sarah Kim",
    },
    {
      id: "W-002",
      field: "shipment_date",
      desc: "3 records outside expected range",
      severity: "WARNING",
      time: "34 min ago",
      owner: "Rajesh Patel",
    },
    {
      id: "W-003",
      field: "carrier_id",
      desc: "Schema drift: string to int in source",
      severity: "WARNING",
      time: "2h ago",
      owner: "Sarah Kim",
    },
    {
      id: "W-004",
      field: "warehouse_code",
      desc: "1 unrecognized code: WH-099",
      severity: "INFO",
      time: "6h ago",
      owner: "Maria Chen",
    },
  ];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background bg-grid">
      <TopBar left="06  INTERACTION 2: QUALITY DRILL-DOWN" />

      <div className="flex flex-1 flex-col px-16 py-12">
        <h2 className="font-display text-[48px] font-black uppercase leading-[1.1] text-foreground">
          Click the quality score to see what&apos;s failing
        </h2>
        <p className="mt-3 font-mono text-[17px] text-accent-orange">
          Answers: &ldquo;Do I need to worry, or is someone fixing it?&rdquo;
        </p>

        {/* Issues header */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-1">
            <span
              className="font-mono text-[18px] font-bold tracking-[0.1em] uppercase"
              style={{ color: "#d4a017" }}
            >
              4 Issues Detected
            </span>
          </div>
          <div className="h-[2px] w-[200px]" style={{ backgroundColor: "#d4a017" }} />
        </div>

        {/* Issues table */}
        <div className="mt-6 flex flex-col">
          {issues.map((issue, i) => (
            <div
              key={issue.id}
              className="flex items-center gap-6 px-6 py-4"
              style={{
                backgroundColor: i % 2 === 0 ? "#0a0a0a" : "transparent",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <span className="font-mono text-[14px] text-secondary w-[60px] shrink-0">
                {issue.id}
              </span>
              <span className="font-mono text-[14px] text-foreground w-[120px] shrink-0">
                {issue.field}
              </span>
              <span className="font-mono text-[16px] text-secondary flex-1">
                {issue.desc}
              </span>
              <span className="shrink-0">
                {issue.severity === "WARNING" ? (
                  <Badge amber>{issue.severity}</Badge>
                ) : (
                  <Badge gray>{issue.severity}</Badge>
                )}
              </span>
              <span className="font-mono text-[14px] text-secondary w-[160px] shrink-0 text-right">
                {issue.time} / {issue.owner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SLIDE 08 — INTERACTION 3: AI MODEL CONNECTOR
// ---------------------------------------------------------------------------

function Slide08() {
  const models = [
    {
      name: "Delivery Time Predictor",
      type: "REGRESSION",
      compat: 98,
      status: "ACTIVE",
      statusColor: "green" as const,
    },
    {
      name: "Route Optimizer",
      type: "OPTIMIZATION",
      compat: 94,
      status: "ACTIVE",
      statusColor: "green" as const,
    },
    {
      name: "Demand Forecaster",
      type: "TIME-SERIES",
      compat: 87,
      status: "RETRAINING",
      statusColor: "amber" as const,
    },
  ];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background bg-grid">
      <TopBar left="07  INTERACTION 3: AI MODEL CONNECTOR" />

      <div className="flex flex-1 flex-col px-16 py-12">
        <h2 className="font-display text-[48px] font-black uppercase leading-[1.1] text-foreground">
          Click CTA to see what AI can do with this data
        </h2>
        <p className="mt-3 font-mono text-[17px] text-accent-orange">
          Answers: &ldquo;What can I DO with this data right now?&rdquo;
        </p>

        {/* Modal card */}
        <div
          className="mt-10 mx-auto w-full max-w-[750px] flex flex-col"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.15)",
            backgroundColor: "#0a0a0a",
          }}
        >
          {/* Header */}
          <div
            className="px-8 py-5"
            style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
          >
            <div className="font-mono text-[16px] font-bold tracking-[0.15em] text-foreground uppercase">
              Available Models
            </div>
            <div className="mt-1 font-mono text-[14px] text-secondary">
              Compatible AI models for this data product
            </div>
          </div>

          {/* Model rows */}
          <div className="flex flex-col">
            {models.map((m) => (
              <div
                key={m.name}
                className="flex items-center gap-6 px-8 py-5"
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <div className="flex-1">
                  <div className="font-mono text-[16px] text-foreground">
                    {m.name}
                  </div>
                  <div className="mt-2">
                    <Badge>{m.type}</Badge>
                  </div>
                </div>
                <div className="w-[200px] shrink-0">
                  <div className="font-mono text-[14px] tracking-[0.1em] text-secondary uppercase mb-2">
                    COMPATIBILITY: {m.compat}%
                  </div>
                  <div className="h-[2px] w-full bg-border-bright">
                    <div
                      className="h-full bg-accent-orange transition-all duration-500"
                      style={{ width: `${m.compat}%` }}
                    />
                  </div>
                </div>
                <div className="shrink-0">
                  <Badge
                    green={m.statusColor === "green"}
                    amber={m.statusColor === "amber"}
                  >
                    {m.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 flex items-center gap-3">
            <span className="font-mono text-[16px] text-secondary">🔒</span>
            <span className="font-mono text-[14px] tracking-[0.1em] text-secondary uppercase">
              Deploy Requires Approval
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SLIDE 09 — INTERACTIONS 4 & 5
// ---------------------------------------------------------------------------

function Slide09() {
  const consumers = [
    {
      name: "EU Logistics Dashboard",
      type: "DASHBOARD",
      team: "Operations",
      typeColor: undefined,
    },
    {
      name: "Delivery Time Predictor",
      type: "AI MODEL",
      team: "Data Science",
      typeColor: "accent" as const,
    },
    {
      name: "SLA Breach Alert",
      type: "AUTOMATION",
      team: "Operations",
      typeColor: undefined,
    },
    {
      name: "Weekly Ops Report",
      type: "REPORT",
      team: "Leadership",
      typeColor: undefined,
    },
  ];

  const transforms = [
    {
      type: "MERGE",
      desc: "Joined tables on order_id",
      time: "3.8 min ago",
    },
    {
      type: "DEDUPE",
      desc: "Removed 847 duplicates (0.007%)",
      time: "3.8 min ago",
    },
    {
      type: "VALIDATE",
      desc: "Schema: 847/851 checks passed",
      time: "3.7 min ago",
    },
    {
      type: "ENRICH",
      desc: "Added carrier_rating from API",
      time: "3.7 min ago",
    },
    {
      type: "CONVERT",
      desc: "Timestamps normalized to UTC",
      time: "3.6 min ago",
    },
  ];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background bg-grid">
      <TopBar left="08  INTERACTIONS 4 & 5" />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Downstream Impact */}
        <div
          className="flex flex-1 flex-col"
          style={{ borderRight: "1px solid rgba(255, 255, 255, 0.08)" }}
        >
          <div
            className="px-8 py-6 shrink-0"
            style={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              borderTop: "4px solid #c45a2d",
            }}
          >
            <div className="font-mono text-[16px] font-bold tracking-[0.15em] text-foreground uppercase">
              Downstream Impact
            </div>
            <div className="mt-2 font-mono text-[14px] text-secondary">
              Click &ldquo;3 connected&rdquo; domains stat
            </div>
            <div className="mt-1 font-mono text-[14px] text-secondary italic">
              Answers: &ldquo;What breaks if this goes down?&rdquo;
            </div>
          </div>

          <div className="flex-1 flex flex-col px-8 py-4">
            {consumers.map((c, i) => (
              <div
                key={c.name}
                className="flex items-center justify-between py-4"
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  backgroundColor:
                    i % 2 === 0
                      ? "rgba(255, 255, 255, 0.01)"
                      : "transparent",
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[16px] text-foreground">
                    {c.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge accent={c.typeColor === "accent"}>
                    {c.type}
                  </Badge>
                  <span className="font-mono text-[14px] text-secondary">
                    {c.team}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="px-8 py-4 shrink-0" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <span
              className="font-mono text-[14px] tracking-[0.1em]"
              style={{ color: "#d4a017" }}
            >
              4 consumers affected if offline
            </span>
          </div>
        </div>

        {/* Right: Transformation Log */}
        <div className="flex flex-1 flex-col">
          <div
            className="px-8 py-6 shrink-0"
            style={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              borderTop: "4px solid #c45a2d",
            }}
          >
            <div className="font-mono text-[16px] font-bold tracking-[0.15em] text-foreground uppercase">
              Transformation Log
            </div>
            <div className="mt-2 font-mono text-[14px] text-secondary">
              Hover over Foundation Engine node
            </div>
            <div className="mt-1 font-mono text-[14px] text-secondary italic">
              Answers: &ldquo;What happened to my data?&rdquo;
            </div>
          </div>

          <div className="flex-1 flex flex-col px-8 py-4">
            {transforms.map((t, i) => (
              <div
                key={t.type}
                className="flex items-center gap-6 py-4"
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  backgroundColor:
                    i % 2 === 0
                      ? "rgba(255, 255, 255, 0.01)"
                      : "transparent",
                }}
              >
                <span className="font-mono text-[14px] font-bold tracking-[0.1em] text-accent-orange w-[90px] shrink-0 uppercase">
                  {t.type}
                </span>
                <span className="font-mono text-[16px] text-foreground flex-1">
                  {t.desc}
                </span>
                <span className="font-mono text-[14px] text-secondary shrink-0">
                  {t.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SLIDE 10 — DESIGN DECISIONS
// ---------------------------------------------------------------------------

function Slide10() {
  const decisions = [
    {
      title: "DARK TERMINAL AESTHETIC",
      text: "Data engineers live in terminals. Business users associate dark UI with professional tools. Reduces visual noise so data stands out. No competing decorative elements.",
    },
    {
      title: "LINEAGE FRONT AND CENTER",
      text: "Most platforms bury lineage in a settings menu. I put it on the main screen because trust is the first thing users evaluate. If they can see where data comes from at a glance, adoption goes up.",
    },
    {
      title: "CROSS-PANEL HOVER LINKING",
      text: "Hovering a feature on the left highlights the corresponding source node on the right. This connects abstract concepts (quality score) to concrete sources (SAP_ERP). No cognitive load to map between panels.",
    },
    {
      title: "MONOSPACE EVERYTHING",
      text: "JetBrains Mono for all text. Numbers align vertically. Status codes read like logs. It signals precision and system awareness. Technical users feel at home. Business users feel like they're looking at the real system.",
    },
  ];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background bg-grid">
      <TopBar left="09  DESIGN DECISIONS" />

      <div className="flex flex-1 flex-col px-16 py-12">
        <h2 className="font-display text-[48px] font-black uppercase leading-[1.1] text-foreground">
          Why it looks like this
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-6 flex-1">
          {decisions.map((d) => (
            <div
              key={d.title}
              className="flex flex-col px-8 py-8"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backgroundColor: "#0a0a0a",
              }}
            >
              <div className="font-mono text-[16px] font-bold tracking-[0.2em] text-foreground uppercase mb-4">
                {d.title}
              </div>
              <p className="font-mono text-[16px] leading-[1.8] text-secondary">
                {d.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SLIDE 11 — HOW I BUILT IT
// ---------------------------------------------------------------------------

function Slide11() {
  const stack = [
    {
      label: "FRAMEWORK",
      value: "Next.js + TypeScript",
      detail: "Production-grade, not a throwaway prototype",
    },
    {
      label: "STYLING",
      value: "Tailwind CSS 4",
      detail: "Utility-first, consistent spacing and color tokens",
    },
    {
      label: "ANIMATION",
      value: "Framer Motion",
      detail: "AnimatePresence for mount/unmount transitions",
    },
    {
      label: "FONTS",
      value: "JetBrains Mono + Inter Tight",
      detail: "Monospace body, tight display headlines",
    },
    {
      label: "AI TOOLS",
      value: "Claude + Cursor",
      detail: "Design in conversation, prototype in code",
    },
    {
      label: "TIME",
      value: "< 3 hours total",
      detail: "From research to deployed prototype",
    },
  ];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background bg-grid">
      <TopBar left="10  HOW I BUILT IT" />

      <div className="flex flex-1 flex-col px-16 py-12">
        <h2 className="font-display text-[48px] font-black uppercase leading-[1.1] text-foreground">
          AI-assisted prototyping in production code
        </h2>

        <div className="mt-10 grid grid-cols-3 gap-6 flex-1">
          {stack.map((s) => (
            <div
              key={s.label}
              className="flex flex-col px-8 py-8"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backgroundColor: "#0a0a0a",
              }}
            >
              <div className="font-mono text-[14px] tracking-[0.2em] text-secondary uppercase mb-3">
                {s.label}
              </div>
              <div className="font-mono text-[22px] font-bold text-foreground mb-3">
                {s.value}
              </div>
              <p className="font-mono text-[16px] leading-[1.7] text-secondary">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SLIDE 12 — LIVE DEMO WALKTHROUGH
// ---------------------------------------------------------------------------

function Slide12() {
  const script = [
    {
      time: "0:00",
      action: "Open prototype. Point to two-panel layout.",
      say: "Left is the data product. Right is live lineage.",
    },
    {
      time: "0:15",
      action: "Hover feature 01 on left.",
      say: "Watch how SAP_ERP highlights on the right. That's cross-panel linking.",
    },
    {
      time: "0:25",
      action: "Hover an edge on the lineage graph.",
      say: "Flow rates appear. 3.8k events per second through Kafka.",
    },
    {
      time: "0:35",
      action: "Click SAP_ERP source node.",
      say: "Detail panel. Owner, SLA, sparkline. Click REST_API — SLA turns red.",
    },
    {
      time: "0:55",
      action: "Click Data Quality Score.",
      say: "4 issues expand. carrier_id has 12 nulls. Sarah Kim owns it.",
    },
    {
      time: "1:15",
      action: 'Click "3 connected" domains.',
      say: "4 downstream consumers. Includes an AI model and leadership report.",
    },
    {
      time: "1:30",
      action: "Hover Foundation Engine.",
      say: "Transformation log. 5 steps. Full audit trail on hover.",
    },
    {
      time: "1:45",
      action: "Click Connect to AI Model.",
      say: "3 models, compatibility scores. Deploy locked — governance built in.",
    },
  ];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background bg-grid">
      <TopBar left="11  LIVE DEMO WALKTHROUGH" />

      <div className="flex flex-1 flex-col px-16 py-12">
        <h2 className="font-display text-[48px] font-black uppercase leading-[1.1] text-foreground">
          2-minute demo script
        </h2>

        {/* Column headers */}
        <div className="mt-10 flex items-center gap-6 px-6 pb-3" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <span className="font-mono text-[14px] tracking-[0.2em] text-secondary uppercase w-[60px] shrink-0">
            TIME
          </span>
          <span className="font-mono text-[14px] tracking-[0.2em] text-secondary uppercase flex-1">
            ACTION
          </span>
          <span className="font-mono text-[14px] tracking-[0.2em] text-secondary uppercase flex-1">
            SAY
          </span>
        </div>

        {/* Script rows */}
        <div className="flex flex-col overflow-auto">
          {script.map((row, i) => (
            <div
              key={row.time}
              className="flex items-start gap-6 px-6 py-4"
              style={{
                backgroundColor: i % 2 === 0 ? "#0a0a0a" : "transparent",
                borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
              }}
            >
              <span className="font-mono text-[16px] font-bold text-accent-orange w-[60px] shrink-0">
                {row.time}
              </span>
              <span className="font-mono text-[16px] text-foreground flex-1 leading-[1.6]">
                {row.action}
              </span>
              <span className="font-mono text-[16px] text-secondary flex-1 leading-[1.6] italic">
                {row.say}
              </span>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-6 font-mono text-[16px] text-accent-orange">
          → After this slide, switch to the live prototype at /
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SLIDE 13 — FIRST 90 DAYS
// ---------------------------------------------------------------------------

function Slide13() {
  const phases = [
    {
      color: "#00ff41",
      period: "DAYS 1-30",
      title: "LISTEN & AUDIT",
      text: "Map every user touchpoint in Foundation. Interview 3-5 customers. Audit current design assets. Identify the single highest-friction moment in onboarding. Ship one quick win.",
    },
    {
      color: "#c45a2d",
      period: "DAYS 31-60",
      title: "SYSTEM & PROCESS",
      text: "Start the component library. Not for polish — for speed. Establish design review cadence with eng. Define the primary persona hierarchy (engineer vs. business user). Prototype 2-3 concepts for the biggest gap.",
    },
    {
      color: "#d4a017",
      period: "DAYS 61-90",
      title: "SHIP & ITERATE",
      text: "Ship the first major design improvement to production. Establish design quality bar with the team. Begin mentoring the junior designer on product thinking. Present design vision to leadership.",
    },
  ];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background bg-grid">
      <TopBar left="12  FIRST 90 DAYS" />

      <div className="flex flex-1 flex-col px-16 py-12">
        <h2 className="font-display text-[48px] font-black uppercase leading-[1.1] text-foreground">
          How I&apos;d approach this role
        </h2>

        <div className="mt-10 flex flex-1 gap-6">
          {phases.map((p) => (
            <div
              key={p.period}
              className="flex flex-1 flex-col px-8 py-8"
              style={{
                borderTop: `4px solid ${p.color}`,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderTopColor: p.color,
                borderTopWidth: 4,
                backgroundColor: "#0a0a0a",
              }}
            >
              <div
                className="font-mono text-[16px] font-bold tracking-[0.15em] uppercase"
                style={{ color: p.color }}
              >
                {p.period}
              </div>
              <div className="mt-3 font-mono text-[18px] font-bold tracking-[0.1em] text-foreground uppercase">
                {p.title}
              </div>
              <p className="mt-6 font-mono text-[16px] leading-[1.8] text-secondary">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SLIDE 14 — CLOSE
// ---------------------------------------------------------------------------

function Slide14() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background bg-grid">
      {/* Left orange accent bar */}
      <div className="w-[4px] shrink-0 bg-accent-orange" />

      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <TopBar left="CLOSE" />

        {/* Main content */}
        <div className="flex flex-1 flex-col justify-center px-16">
          <h1 className="font-display text-[96px] font-black uppercase leading-[0.9] tracking-tight text-foreground">
            LET&apos;S BUILD
            <br />
            THIS TOGETHER
          </h1>

          {/* Orange line */}
          <div
            className="mt-8 h-[2px] bg-accent-orange"
            style={{ width: 200 }}
          />

          {/* Contact */}
          <div className="mt-10">
            <div className="font-mono text-[18px] font-bold tracking-[0.1em] text-foreground">
              JOHN ISEGHOHI
            </div>
            <div className="mt-1 font-mono text-[16px] text-secondary">
              Senior UX Designer
            </div>
            <div className="mt-1 font-mono text-[14px] text-tertiary">
              13+ years / Amazon / Booking.com / Fintech
            </div>
          </div>

          <div className="mt-6">
            <span className="font-mono text-[17px] text-accent-orange">
              github.com/jeberulz/meshxio
            </span>
          </div>

          <div className="mt-8 font-mono text-[16px] text-secondary">
            Press Escape to view the live prototype →
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SLIDE REGISTRY
// ---------------------------------------------------------------------------

const SLIDES = [
  Slide01,
  Slide02,
  Slide03,
  Slide04,
  Slide05,
  Slide06,
  Slide07,
  Slide08,
  Slide09,
  Slide10,
  Slide11,
  Slide12,
  Slide13,
  Slide14,
];

const TOTAL = SLIDES.length;

// ---------------------------------------------------------------------------
// DECK PAGE
// ---------------------------------------------------------------------------

export default function DeckPage() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setIndex((i) => Math.min(i + 1, TOTAL - 1));
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Escape") {
        router.push("/");
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [router]);

  const progress = ((index + 1) / TOTAL) * 100;
  const CurrentSlide = SLIDES[index];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-50 h-[2px] bg-border">
        <motion.div
          className="h-full bg-accent-orange"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-4 right-6 z-50 font-mono text-[14px] tracking-[0.15em] text-secondary">
        {String(index + 1).padStart(2, "0")} /{" "}
        {String(TOTAL).padStart(2, "0")}
      </div>

      {/* Invisible click zones */}
      <button
        onClick={() => setIndex((i) => Math.max(i - 1, 0))}
        className="absolute left-0 top-0 bottom-0 z-40 w-[8%] cursor-w-resize opacity-0"
        aria-label="Previous slide"
      />
      <button
        onClick={() => setIndex((i) => Math.min(i + 1, TOTAL - 1))}
        className="absolute right-0 top-0 bottom-0 z-40 w-[8%] cursor-e-resize opacity-0"
        aria-label="Next slide"
      />

      {/* Slide with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <CurrentSlide />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
