import { useState } from "react";

import { WORLD_LAND_PATH } from "./world-path";
import { worldNodes } from "@/data/content";
import type { WorldNode } from "@/types/content";
import { cn } from "@/lib/utils";

const project = (lat: number, lng: number) => ({
  x: ((lng + 180) / 360) * 1000,
  y: ((90 - lat) / 180) * 500,
});

const JAKARTA = project(-6.2, 106.85);

export function WorldMap({
  nodes = worldNodes,
  selectedId,
  onSelect,
}: {
  nodes?: WorldNode[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ?? selectedId ?? null;

  return (
    <div className="relative overflow-hidden border border-border bg-sand">
      <svg
        viewBox="60 40 940 420"
        role="img"
        aria-label="Map of Indonesia Vibes programmes around the world"
        className="block w-full"
      >
        <defs>
          <radialGradient id="iv-glow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path
          d={WORLD_LAND_PATH}
          fill="var(--color-line)"
          stroke="var(--color-background)"
          strokeWidth="0.6"
        />

        <circle cx={JAKARTA.x} cy={JAKARTA.y} r="70" fill="url(#iv-glow)" />

        {nodes.map((n) => {
          const p = project(n.lat, n.lng);
          if (n.city === "Jakarta") return null;
          const isActive = active === n.id;
          const mid = {
            x: (JAKARTA.x + p.x) / 2,
            y: (JAKARTA.y + p.y) / 2 - Math.abs(JAKARTA.x - p.x) * 0.22,
          };
          return (
            <path
              key={`arc-${n.id}`}
              d={`M${JAKARTA.x},${JAKARTA.y} Q${mid.x},${mid.y} ${p.x},${p.y}`}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth={isActive ? 1.3 : 0.6}
              strokeOpacity={isActive ? 0.9 : n.status === "Archive" ? 0.15 : 0.32}
            />
          );
        })}

        {nodes.map((n) => {
          const p = project(n.lat, n.lng);
          const isActive = active === n.id;
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
              {isActive ? (
                <circle cx={p.x} cy={p.y} r="9" fill="var(--color-primary)" fillOpacity="0.18" />
              ) : null}
              <circle
                cx={p.x}
                cy={p.y}
                r={n.status === "Archive" ? 2.6 : 4}
                fill={n.status === "Archive" ? "var(--color-muted-foreground)" : "var(--color-primary)"}
                stroke="var(--color-background)"
                strokeWidth="1.2"
              />
              <text
                x={p.x + 8}
                y={p.y + 3.5}
                className={cn(
                  "pointer-events-none fill-ink text-[9px] font-medium transition-opacity",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              >
                {n.city}
              </text>
            </g>
          );
        })}
      </svg>

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