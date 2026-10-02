"use client";

import { useTilt } from "@/components/ui/useTilt";
import { useReducedMotion } from "@/components/ui/useReducedMotion";
import { LineIcon } from "@/components/brand/LineIcon";
import { SIGNAL_BARS, SIGNAL_ACCENTS } from "@/components/brand/SignalBars";
import { LINES } from "@/lib/lines";
import styles from "@/app/(frontend)/[lang]/Home.module.css";

// One ellipse per business line, rotated around the core. Each carries a
// node travelling along it (SMIL, so the path follows the rotation for free),
// coloured like that line's chip: mint, cyan, and Media's mint→cyan gradient.
const ORBITS = [
  { line: "id", angle: -28, dur: 16, color: "#00ff91" },
  { line: "cloud", angle: 32, dur: 21, color: "#00c9ff" },
  { line: "media", angle: 92, dur: 26, color: "url(#media-node)" },
];
const RX = 250;
const RY = 88;
const ORBIT_PATH = `M${300 - RX},300 a${RX},${RY} 0 1,0 ${RX * 2},0 a${RX},${RY} 0 1,0 ${-RX * 2},0`;

const BAR_W = 9;
const BAR_GAP = 6;
const BAR_MAX = 78;
const BARS_X = 300 - (SIGNAL_BARS.length * BAR_W + (SIGNAL_BARS.length - 1) * BAR_GAP) / 2;
const BARS_BASE = 300 + BAR_MAX / 2;

const CHIP_CLASSES = { id: styles.chipOne, cloud: styles.chipTwo, media: styles.chipThree };

export function HeroVisual({ visual, lines }) {
  const tiltRef = useTilt();
  const reducedMotion = useReducedMotion();

  return (
    <div className={styles.heroVisual} ref={tiltRef}>
      <figure className={styles.orbitScene}>
        <svg viewBox="0 0 600 600" role="img" aria-labelledby="orbit-title orbit-desc">
          <title id="orbit-title">{visual.title}</title>
          <desc id="orbit-desc">{visual.description}</desc>
          <defs>
            <radialGradient id="core-surface" cx=".35" cy=".3" r=".8">
              <stop offset="0" stopColor="#1c1c78" />
              <stop offset=".6" stopColor="#101064" />
              <stop offset="1" stopColor="#000038" />
            </radialGradient>
            <linearGradient id="core-scan" x1="0" x2="1">
              <stop offset="0" stopColor="#00ff91" stopOpacity="0" />
              <stop offset=".5" stopColor="#00ff91" />
              <stop offset="1" stopColor="#00ff91" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="media-node" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#00ff91" />
              <stop offset="1" stopColor="#00c9ff" />
            </linearGradient>
            <filter id="node-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <clipPath id="core-clip">
              <circle cx="300" cy="300" r="104" />
            </clipPath>
          </defs>

          <circle className={styles.outerRing} cx="300" cy="300" r="286" />
          <g className={styles.ticks}>
            {Array.from({ length: 48 }, (_, i) => (
              <line
                key={i}
                x1="300"
                y1="22"
                x2="300"
                y2={i % 4 === 0 ? 34 : 28}
                transform={`rotate(${i * 7.5} 300 300)`}
              />
            ))}
          </g>

          {ORBITS.map((orbit) => (
            <g key={orbit.line} transform={`rotate(${orbit.angle} 300 300)`}>
              <path className={styles.orbitPath} d={ORBIT_PATH} />
              {!reducedMotion && (
                <g>
                  <circle r="11" fill={orbit.color} opacity=".45" filter="url(#node-glow)" />
                  <circle r="6" fill={orbit.color} />
                  <animateMotion dur={`${orbit.dur}s`} repeatCount="indefinite" path={ORBIT_PATH} />
                </g>
              )}
            </g>
          ))}

          <circle cx="300" cy="300" r="118" fill="none" stroke="#00ff91" strokeOpacity=".35" strokeDasharray="4 7" />
          <circle cx="300" cy="300" r="104" fill="url(#core-surface)" stroke="#00ff91" strokeWidth="1.5" />

          <g className={styles.coreBars}>
            {SIGNAL_BARS.map((height, i) => (
              <rect
                key={i}
                x={BARS_X + i * (BAR_W + BAR_GAP)}
                y={BARS_BASE - height * BAR_MAX}
                width={BAR_W}
                height={height * BAR_MAX}
                rx={BAR_W / 2}
                fill={SIGNAL_ACCENTS.includes(i) ? "#00ff91" : "#f8f8f8"}
                style={{ animationDelay: `${i * 110}ms` }}
              />
            ))}
          </g>

          <g clipPath="url(#core-clip)">
            <rect className={styles.coreScan} x="196" y="196" width="208" height="3" fill="url(#core-scan)" />
          </g>
        </svg>
      </figure>

      {LINES.map((line) => (
        <div
          key={line.key}
          className={`${styles.chip} ${CHIP_CLASSES[line.key]}`}
          data-accent={line.accent}
          aria-hidden="true"
        >
          <span className={styles.chipIcon}>
            <LineIcon line={line.key} />
          </span>
          <span className={styles.chipText}>
            <strong>{line.suffix}</strong> {lines[line.key].short}
          </span>
        </div>
      ))}
    </div>
  );
}
