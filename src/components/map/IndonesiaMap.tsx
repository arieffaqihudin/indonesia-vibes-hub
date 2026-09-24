import { useMemo, useState } from "react";

import { INDONESIA_PATH, projectIdn } from "./indonesia-path";
import type { Place } from "@/types/content";
import { cn } from "@/lib/utils";

interface Cluster {
  key: string;
  x: number;
  y: number;
  places: Place[];
}

/** Group markers that would overlap at this scale into one cluster pin. */
const clusterPlaces = (list: Place[], radius = 26): Cluster[] => {
  const clusters: Cluster[] = [];
  for (const place of list) {
    const { x, y } = projectIdn(place.lat, place.lng);
    const near = clusters.find((c) => Math.hypot(c.x - x, c.y - y) < radius);
    if (near) {
      near.places.push(place);
      near.x = (near.x * (near.places.length - 1) + x) / near.places.length;
      near.y = (near.y * (near.places.length - 1) + y) / near.places.length;
    } else {
      clusters.push({ key: place.id, x, y, places: [place] });
    }
  }
  return clusters;
};

export function IndonesiaMap({
  places,
  selectedId,
  onSelect,
  className,
}: {
  places: Place[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const clusters = useMemo(() => clusterPlaces(places), [places]);
  const active = hovered ?? selectedId ?? null;
  const hoveredPlace = places.find((p) => p.id === hovered);

  return (
    <div className={cn("relative overflow-hidden border border-border bg-sand", className)}>
      <svg
        viewBox="0 60 1000 340"
        role="group"
        aria-label="Map of cultural places across Indonesia. A full list of the same places follows."
        className="block w-full"
      >
        <defs>
          <radialGradient id="idn-glow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path d={INDONESIA_PATH} fill="var(--color-line)" stroke="var(--color-background)" strokeWidth="0.8" />

        {clusters.map((cluster) => {
          const isCluster = cluster.places.length > 1;
          const first = cluster.places[0]!;
          const isActive = cluster.places.some((p) => p.id === active);
          const label = isCluster
            ? `${cluster.places.length} places: ${cluster.places.map((p) => p.name).join(", ")}`
            : `${first.name}, ${first.region}`;

          return (
            <g
              key={cluster.key}
              tabIndex={0}
              role="button"
              aria-label={label}
              className="cursor-pointer outline-none"
              onMouseEnter={() => setHovered(first.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(first.id)}
              onBlur={() => setHovered(null)}
              onClick={() => {
                const current = cluster.places.findIndex((p) => p.id === selectedId);
                onSelect(cluster.places[(current + 1) % cluster.places.length]!.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  const current = cluster.places.findIndex((p) => p.id === selectedId);
                  onSelect(cluster.places[(current + 1) % cluster.places.length]!.id);
                }
              }}
            >
              <circle cx={cluster.x} cy={cluster.y} r="22" fill="transparent" />
              {isActive ? (
                <>
                  <circle cx={cluster.x} cy={cluster.y} r="34" fill="url(#idn-glow)" />
                  {/* brand wave rings */}
                  <circle
                    cx={cluster.x}
                    cy={cluster.y}
                    r="4"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="1"
                    className="ring-ping"
                  />
                  {[10, 15, 20].map((r) => (
                    <circle
                      key={r}
                      cx={cluster.x}
                      cy={cluster.y}
                      r={r}
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeOpacity={0.55 - r * 0.015}
                      strokeWidth="1"
                    />
                  ))}
                </>
              ) : null}
              <circle
                cx={cluster.x}
                cy={cluster.y}
                r={isCluster ? 8 : 5}
                fill={isActive ? "var(--color-primary)" : "var(--color-clay)"}
                stroke="var(--color-background)"
                strokeWidth="1.5"
                style={{ transition: "r 200ms cubic-bezier(0.22, 1, 0.36, 1), fill 200ms ease" }}
              />
              {isCluster ? (
                <text
                  x={cluster.x}
                  y={cluster.y + 2.6}
                  textAnchor="middle"
                  fontSize="7"
                  fontWeight="600"
                  fill="var(--color-background)"
                >
                  {cluster.places.length}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      {hoveredPlace ? (
        <p className="menu-in pointer-events-none absolute right-3 bottom-3 left-3 bg-background/95 px-3 py-2 text-xs text-ink shadow-sm sm:left-auto sm:max-w-xs">
          <span className="font-medium">{hoveredPlace.name}</span>
          <span className="text-muted-foreground"> · {hoveredPlace.type ?? "Place"}</span>
        </p>
      ) : null}
    </div>
  );
}
