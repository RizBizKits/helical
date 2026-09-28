"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

const MAX_VISIBLE = 36;
const WEDGE = 0.52;
const ANGLE_GAP = 0.08;
const ANGLE_STEP = WEDGE + ANGLE_GAP;

type WedgeGeom = {
  id: number;
  face: string;
  underside: string;
  opacity: number;
  isLatest: boolean;
};

function polar(cx: number, cy: number, r: number, a: number): [number, number] {
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
}

/**
 * First-person looking UP the stairwell — climbing.
 * Newest steps rise toward the light; near wedges stay large.
 * No globe / well backdrop — stairs sit on the page atmosphere.
 */
function buildLookingUp(total: number): {
  wedges: WedgeGeom[];
  rail: string;
  innerRail: string;
} {
  if (total <= 0) {
    return { wedges: [], rail: "", innerRail: "" };
  }

  const start = Math.max(0, total - MAX_VISIBLE);
  const cx = 150;
  const cy = 150;
  const wedges: WedgeGeom[] = [];
  const railPts: string[] = [];
  const innerPts: string[] = [];

  for (let abs = start; abs < total; abs++) {
    const upFromCamera = total - 1 - abs;
    const perspective = 1 / (1 + upFromCamera * 0.085);

    const rInner = 16 * perspective;
    const rOuter = 120 * perspective;

    const a0 = Math.PI / 2 + abs * ANGLE_STEP;
    const a1 = a0 + WEDGE;

    const lift = upFromCamera * 2.2;
    const ox = cx;
    const oy = cy - lift * 0.35;

    const p0 = polar(ox, oy, rInner, a0);
    const p1 = polar(ox, oy, rOuter, a0);
    const p2 = polar(ox, oy, rOuter, a1);
    const p3 = polar(ox, oy, rInner, a1);

    const thick = 6 * perspective;
    const u1: [number, number] = [p1[0], p1[1] + thick];
    const u2: [number, number] = [p2[0], p2[1] + thick];

    let opacity = 0.5 + perspective * 0.5;
    if (upFromCamera > MAX_VISIBLE * 0.55) {
      opacity *= Math.max(
        0.18,
        1 - (upFromCamera - MAX_VISIBLE * 0.55) / 14,
      );
    }

    wedges.push({
      id: abs,
      face: `${p0.join(",")} ${p1.join(",")} ${p2.join(",")} ${p3.join(",")}`,
      underside: `${p1.join(",")} ${p2.join(",")} ${u2.join(",")} ${u1.join(",")}`,
      opacity,
      isLatest: abs === total - 1,
    });

    const [rx, ry] = polar(ox, oy, rOuter + 3 * perspective, (a0 + a1) / 2);
    const [ix, iy] = polar(ox, oy, Math.max(rInner - 2, 4), (a0 + a1) / 2);
    const i = abs - start;
    railPts.push(`${i === 0 ? "M" : "L"}${rx.toFixed(1)} ${ry.toFixed(1)}`);
    innerPts.push(`${i === 0 ? "M" : "L"}${ix.toFixed(1)} ${iy.toFixed(1)}`);
  }

  wedges.sort((a, b) => a.id - b.id);

  return {
    wedges,
    rail: railPts.join(" "),
    innerRail: innerPts.join(" "),
  };
}

type StaircasePovProps = {
  steps: number;
  className?: string;
  celebrateToken?: number;
};

export function StaircasePov({
  steps,
  className,
  celebrateToken = 0,
}: StaircasePovProps) {
  const built = useMemo(() => buildLookingUp(steps), [steps]);
  const celebrating = celebrateToken > 0;

  return (
    <div
      key={celebrating ? `pov-bloom-${celebrateToken}` : "pov-idle"}
      className={cn(
        "relative flex items-center justify-center overflow-visible",
        celebrating && "animate-climb-bloom",
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 300 300"
        className={cn(
          "relative z-[1] w-full max-w-2xl",
          "h-[min(52vh,28rem)] lg:h-[min(62vh,32rem)]",
        )}
      >
        <defs>
          <filter id="povGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Slim center post only — no globe / well disc */}
        <circle cx="150" cy="150" r="7" fill="var(--brand-navy)" opacity="0.9" />
        <circle cx="150" cy="150" r="3" fill="var(--brand-royal)" />

        {built.wedges.map((w) => (
          <g
            key={
              w.isLatest
                ? `pov-latest-${celebrateToken}-${w.id}`
                : `pov-${w.id}`
            }
            opacity={w.opacity}
            className={cn(w.isLatest && celebrating && "animate-newest-step")}
            filter={w.isLatest ? "url(#povGlow)" : undefined}
          >
            <polygon points={w.underside} fill="var(--brand-navy)" />
            <polygon
              points={w.face}
              fill={w.isLatest ? "var(--brand-sky)" : "var(--step)"}
            />
          </g>
        ))}

        {built.rail && (
          <path
            d={built.rail}
            fill="none"
            stroke="var(--step)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.88"
          />
        )}
        {built.innerRail && (
          <path
            d={built.innerRail}
            fill="none"
            stroke="var(--brand-steel)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.75"
          />
        )}

        {steps === 0 && (
          <g opacity="0.45">
            <path
              d="M150 200 a70,70 0 0,1 0,-140"
              fill="none"
              stroke="var(--step)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
