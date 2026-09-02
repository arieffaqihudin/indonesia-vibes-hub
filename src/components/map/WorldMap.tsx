import { useEffect, useRef, useState } from "react";

import { WORLD_LAND_PATH } from "./world-path";
import { worldNodes } from "@/data/content";
import type { WorldNode } from "@/types/content";
import { cn } from "@/lib/utils";

const project = (lat: number, lng: number) => ({
  x: ((lng + 180) / 360) * 1000,
  y: ((90 - lat) / 180) * 500,
});

const JAKARTA = project(-6.2, 106.85);
const VIEW = { x: 60, y: 40, w: 940, h: 420 };

const arcPath = (p: { x: number; y: number }) => {
  const mid = {
    x: (JAKARTA.x + p.x) / 2,
    y: (JAKARTA.y + p.y) / 2 - Math.abs(JAKARTA.x - p.x) * 0.22,
  };
  return `M${JAKARTA.x},${JAKARTA.y} Q${mid.x},${mid.y} ${p.x},${p.y}`;
};

/**
 * Indonesia reaching outward: Jakarta is the origin, every programme is an arc.
 * Motion is used only to say something — the origin wave on arrival, a drawn
 * line when a connection is selected, a quiet pulse on live programmes.
 */
export function WorldMap({
  nodes = worldNodes,
  selectedId,
  onSelect,
  focus = false,
}: {
  nodes?: WorldNode[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  /** Gently zoom toward the selected city (used on the full-page map). */
  focus?: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [arrived, setArrived] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const active = hovered ?? selectedId ?? null;
  const activeNode = nodes.find((n) => n.id === active) ?? null;

  // One radial wave out of Indonesia, the first time the map is seen.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setArrived(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArrived(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const selectedNode = selectedId ? (nodes.find((n) => n.id === selectedId) ?? null) : null;
  const focusPoint = focus && selectedNode ? project(selectedNode.lat, selectedNode.lng) : null;
  const zoom = focusPoint ? 1.28 : 1;
  const cx = focusPoint ? (focusPoint.x + JAKARTA.x) / 2 : VIEW.x + VIEW.w / 2;
  const cy = focusPoint ? (focusPoint.y + JAKARTA.y) / 2 : VIEW.y + VIEW.h / 2;

  return (
    <div ref={wrapRef} className="relative overflow-hidden border border-border bg-sand">
      <svg
        viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
        role="img"
        aria-label="Map of Indonesia Vibes programmes around the world. The same programmes are listed as text below."
        className="block w-full"
      >
        <defs>
          <radialGradient id="iv-glow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g
          style={{
            transform: `translate(${cx}px, ${cy}px) scale(${zoom}) translate(${-cx}px, ${-cy}px)`,
            transformOrigin: "0 0",
            transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <path
            d={WORLD_LAND_PATH}
            fill="var(--color-line)"
            stroke="var(--color-background)"
            strokeWidth="0.6"
          />

          <circle cx={JAKARTA.x} cy={JAKARTA.y} r="70" fill="url(#iv-glow)" />

          {/* Origin wave — expands once, on arrival */}
          {arrived
            ? [0, 1, 2].map((i) => (
                <circle
                  key={`origin-${i}`}
                  cx={JAKARTA.x}
                  cy={JAKARTA.y}
                  r="90"
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="1"
                  className="wave-out"
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    animationDelay: `${i * 420}ms`,
                  }}
                />
              ))
            : null}

          {nodes.map((n) => {
            if (n.city === "Jakarta") return null;
            const p = project(n.lat, n.lng);
            const isActive = active === n.id;
            const d = arcPath(p);
            const length = Math.hypot(p.x - JAKARTA.x, p.y - JAKARTA.y) * 1.35;
            return (
              <path
                key={`arc-${n.id}`}
                d={d}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth={isActive ? 1.3 : 0.6}
                strokeOpacity={isActive ? 0.9 : n.status === "Archive" ? 0.12 : 0.28}
                className={isActive ? "draw-line" : undefined}
                style={
                  isActive
                    ? ({ ["--dash" as string]: `${Math.round(length)}` } as React.CSSProperties)
                    : { transition: "stroke-opacity 240ms ease, stroke-width 240ms ease" }
                }
              />
            );
          })}

          {nodes.map((n) => {
            const p = project(n.lat, n.lng);
            const isActive = active === n.id;
            const live = n.status === "Live" || n.status === "Now";
            return (
              <g
                key={n.id}
                tabIndex={0}
                role="button"
                aria-label={`${n.city}, ${n.country}: ${n.programme}`}
                className="cursor-pointer outline-none"
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(n.id)}
                onBlur={() => setHovered(null)}
                onClick={() => onSelect?.(n.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect?.(n.id);
                  }
                }}
              >
                <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
                {live && !isActive ? (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="0.8"
                    className="ring-ping"
                  />
                ) : null}
                {isActive ? (
                  <>
                    <circle cx={p.x} cy={p.y} r="9" fill="var(--color-primary)" fillOpacity="0.18" />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth="1"
                      className="ring-ping"
                    />
                  </>
                ) : null}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={n.status === "Archive" ? 2.6 : isActive ? 5 : 4}
                  fill={n.status === "Archive" ? "var(--color-muted-foreground)" : "var(--color-primary)"}
                  stroke="var(--color-background)"
                  strokeWidth="1.2"
                  style={{ transition: "r 200ms cubic-bezier(0.22, 1, 0.36, 1)" }}
                />
                <text
                  x={p.x + 8}
                  y={p.y + 3.5}
                  className={cn(
                    "pointer-events-none fill-ink text-[9px] font-medium transition-opacity duration-200",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                >
                  {n.city}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Compact preview for the hovered or selected city */}
      {activeNode ? (
        <div className="menu-in pointer-events-none absolute top-3 left-3 max-w-[16rem] border border-border bg-background/95 px-3 py-2 shadow-sm backdrop-blur-sm">
          <p className="eyebrow text-primary">
            {activeNode.status} · {activeNode.continent}
          </p>
          <p className="mt-1 text-sm font-medium text-ink">
            {activeNode.city}, {activeNode.country}
          </p>
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{activeNode.programme}</p>
        </div>
      ) : null}

      <div className="pointer-events-none absolute bottom-3 left-4 flex flex-wrap items-center gap-4 text-[0.7rem] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" /> Active or upcoming
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" /> Archive
        </span>
      </div>
    </div>
  );
}
