// Inline SVG diagrams for the attention blog post.
// All colors reference the site's CSS variables so the figures theme
// automatically in light/dark. The heatmap uses a purple accent.

const fg = "hsl(var(--foreground))"
const muted = "hsl(var(--muted-foreground))"
const border = "hsl(var(--border))"
const bg = "hsl(var(--background))"
const accent = "hsl(265 70% 58%)"

const svgStyle = { fontFamily: "inherit" as const }

/* ------------------------------------------------------------------ */
/* Diagram 1 — the compression bottleneck                              */
/* ------------------------------------------------------------------ */
export function BottleneckDiagram() {
  const encN = 16
  const encTop = 36
  const encBottom = 344
  const encH = 11
  const encStep = (encBottom - encTop - encH) / (encN - 1)
  const encY = Array.from({ length: encN }, (_, i) => encTop + i * encStep)
  const decY = [78, 140, 202, 264]
  const decLabels = ["I", "eat", "bread", "…"]
  const cx = 392
  const cy = 190

  return (
    <svg viewBox="0 0 760 380" className="h-auto w-full" style={svgStyle}>
      <defs>
        <marker id="bn-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={muted} />
        </marker>
      </defs>

      {/* bowtie hint: wide -> pinch -> wide */}
      <polygon points={`148,${encTop} 148,${encBottom} ${cx},${cy}`} fill={accent} fillOpacity={0.07} />
      <polygon points={`${cx},${cy} 600,60 600,320`} fill={accent} fillOpacity={0.07} />

      <text x={86} y={24} textAnchor="middle" fontSize={13} fill={muted}>
        encoder reads every word
      </text>
      <text x={86} y={366} textAnchor="middle" fontSize={12} fill={muted}>
        (a long paragraph)
      </text>
      <text x={632} y={32} textAnchor="middle" fontSize={13} fill={muted}>
        decoder writes output
      </text>

      {/* encoder states — many thin bars to convey a long input */}
      {encY.map((y, i) => (
        <g key={`enc-${i}`}>
          <line x1={134} y1={y + encH / 2} x2={cx - 46} y2={cy} stroke={border} strokeWidth={1} />
          <rect x={40} y={y} width={94} height={encH} rx={3} fill={bg} stroke={border} strokeWidth={1.25} />
        </g>
      ))}

      {/* decoder outputs */}
      {decY.map((y, i) => (
        <g key={`dec-${i}`}>
          <line
            x1={cx + 46}
            y1={cy}
            x2={584}
            y2={y + 17}
            stroke={border}
            strokeWidth={1.5}
            markerEnd="url(#bn-arrow)"
          />
          <rect x={584} y={y} width={96} height={34} rx={7} fill={bg} stroke={border} strokeWidth={1.5} />
          <text x={632} y={y + 22} textAnchor="middle" fontSize={14} fill={fg}>
            {decLabels[i]}
          </text>
        </g>
      ))}

      {/* the bottleneck node */}
      <rect x={cx - 46} y={cy - 32} width={92} height={64} rx={10} fill={accent} fillOpacity={0.14} stroke={accent} strokeWidth={1.75} />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={14} fill={fg} fontWeight={600}>
        context
      </text>
      <text x={cx} y={cy + 13} textAnchor="middle" fontSize={12} fill={muted}>
        512 numbers
      </text>
      <text x={cx} y={cy + 52} textAnchor="middle" fontSize={12.5} fill={accent} fontWeight={600}>
        everything must fit here
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Diagram 2 — attention weight heatmap                                */
/* ------------------------------------------------------------------ */
export function AttentionHeatmap() {
  const cols = ["Je", "mange", "du", "pain"]
  const rows = ["I", "eat", "bread"]
  // rows are English output, columns are French input; each row ~sums to 1
  const weights = [
    [0.85, 0.05, 0.05, 0.05],
    [0.08, 0.8, 0.07, 0.05],
    [0.03, 0.05, 0.22, 0.7],
  ]

  const gridX = 150
  const gridY = 92
  const stepX = 108
  const stepY = 100
  const cellW = 100
  const cellH = 92

  return (
    <svg viewBox="0 0 600 420" className="h-auto w-full" style={svgStyle}>
      {/* column labels (French input) */}
      {cols.map((c, j) => (
        <text key={`col-${j}`} x={gridX + j * stepX + cellW / 2} y={gridY - 26} textAnchor="middle" fontSize={16} fill={fg}>
          {c}
        </text>
      ))}
      <text x={gridX + 2 * stepX} y={gridY - 52} textAnchor="middle" fontSize={12.5} fill={muted}>
        French input
      </text>

      {/* row labels (English output) */}
      {rows.map((r, i) => (
        <text key={`row-${i}`} x={gridX - 22} y={gridY + i * stepY + cellH / 2 + 5} textAnchor="end" fontSize={16} fill={fg}>
          {r}
        </text>
      ))}
      <text
        x={44}
        y={gridY + 1.5 * stepY}
        textAnchor="middle"
        fontSize={12.5}
        fill={muted}
        transform={`rotate(-90 44 ${gridY + 1.5 * stepY})`}
      >
        English output
      </text>

      {/* cells */}
      {weights.map((row, i) =>
        row.map((w, j) => {
          const x = gridX + j * stepX
          const y = gridY + i * stepY
          const hot = w > 0.45
          return (
            <g key={`cell-${i}-${j}`}>
              <rect x={x} y={y} width={cellW} height={cellH} rx={6} fill={accent} fillOpacity={w} />
              <rect x={x} y={y} width={cellW} height={cellH} rx={6} fill="none" stroke={border} strokeWidth={1.25} />
              <text
                x={x + cellW / 2}
                y={y + cellH / 2 + 5}
                textAnchor="middle"
                fontSize={14}
                fill={hot ? "hsl(0 0% 100%)" : muted}
                fontWeight={hot ? 600 : 400}
              >
                {w.toFixed(2)}
              </text>
            </g>
          )
        })
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Diagram 3 — sequential RNN vs. parallel transformer                 */
/* ------------------------------------------------------------------ */
const DUR = "5s"

// A token box. An accent overlay fades in during [start, end] to show it being computed.
function PulseBox({ cx, cy, label, start, end }: { cx: number; cy: number; label: string; start: number; end: number }) {
  const kt = `0;${start};${start + 0.03};${end};${end + 0.03};1`
  const vals = `0;0;1;1;0;0`
  return (
    <g>
      <rect x={cx - 32} y={cy - 22} width={64} height={44} rx={9} fill={bg} stroke={fg} strokeWidth={1.5} />
      <rect x={cx - 32} y={cy - 22} width={64} height={44} rx={9} fill={accent} opacity={0}>
        <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" keyTimes={kt} values={vals} />
      </rect>
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={14} fill={fg}>
        {label}
      </text>
    </g>
  )
}

// A "time taken" meter that fills left to right, with a "done" flag where it finishes.
function TimeMeter({
  x,
  y,
  w,
  keyTimes,
  widths,
  doneAt,
  doneX,
  savedFrom,
}: {
  x: number
  y: number
  w: number
  keyTimes: string
  widths: string
  doneAt: number
  doneX: number
  savedFrom?: number
}) {
  const q = w / 4
  const doneKT = `0;${doneAt};${doneAt + 0.03};0.9;0.93;1`
  const fadeIn = `0;0;1;1;0;0`
  return (
    <g>
      {/* track */}
      <rect x={x} y={y} width={w} height={12} rx={6} fill={bg} stroke={border} strokeWidth={1.25} />
      {/* per-step tick marks */}
      {[1, 2, 3].map((i) => (
        <line key={i} x1={x + q * i} y1={y} x2={x + q * i} y2={y + 12} stroke={border} strokeWidth={1} />
      ))}

      {/* "time saved" region (transformer only) */}
      {savedFrom !== undefined && (
        <g>
          <rect x={savedFrom} y={y} width={x + w - savedFrom} height={12} rx={6} fill={accent} opacity={0}>
            <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" keyTimes={doneKT} values={`0;0;0.1;0.1;0;0`} />
          </rect>
          <text x={(savedFrom + x + w) / 2} y={y + 9} textAnchor="middle" fontSize={9.5} fill={muted} opacity={0}>
            time saved
            <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" keyTimes={doneKT} values={fadeIn} />
          </text>
        </g>
      )}

      {/* animated fill */}
      <rect x={x} y={y} width={0} height={12} rx={6} fill={accent}>
        <animate attributeName="width" dur={DUR} repeatCount="indefinite" keyTimes={keyTimes} values={widths} />
      </rect>

      {/* done flag at the finish point */}
      <text x={doneX} y={y - 8} textAnchor="middle" fontSize={11.5} fill={accent} fontWeight={600} opacity={0}>
        ✓ done
        <animate attributeName="opacity" dur={DUR} repeatCount="indefinite" keyTimes={doneKT} values={fadeIn} />
      </text>
    </g>
  )
}

export function ParallelismDiagram() {
  const sub = ["₁", "₂", "₃", "₄"]
  const cols = [180, 310, 440, 570]
  const rnnY = 90
  const tfY = 282
  const barX = 150
  const barW = 420
  const q = barW / 4
  // RNN: each token computed in its own window; meter climbs a quarter each step.
  const rnnWin: [number, number][] = [
    [0.05, 0.2],
    [0.25, 0.4],
    [0.45, 0.6],
    [0.65, 0.8],
  ]
  const rnnMeterKT = "0;0.05;0.18;0.25;0.38;0.45;0.58;0.65;0.80;0.9;1"
  const rnnMeterW = `0;0;${q};${q};${2 * q};${2 * q};${3 * q};${3 * q};${barW};${barW};0`
  // Transformer: everything in the first window; meter only ever reaches one quarter.
  const tfMeterKT = "0;0.05;0.18;0.9;1"
  const tfMeterW = `0;0;${q};${q};0`

  return (
    <svg viewBox="0 0 720 378" className="h-auto w-full" style={svgStyle}>
      <defs>
        <marker id="seq-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={fg} />
        </marker>
      </defs>

      {/* ===================== RNN row (sequential) ===================== */}
      <text x={360} y={30} textAnchor="middle" fontSize={15} fill={fg} fontWeight={600}>
        RNN: one token at a time
      </text>
      {cols.map((x, i) =>
        i < 3 ? (
          <line key={`a-${i}`} x1={x + 32} y1={rnnY} x2={cols[i + 1] - 32} y2={rnnY} stroke={fg} strokeWidth={1.6} markerEnd="url(#seq-arrow)" />
        ) : null
      )}
      {cols.map((x, i) => (
        <PulseBox key={`rnn-${i}`} cx={x} cy={rnnY} label={`x${sub[i]}`} start={rnnWin[i][0]} end={rnnWin[i][1]} />
      ))}
      <TimeMeter x={barX} y={rnnY + 44} w={barW} keyTimes={rnnMeterKT} widths={rnnMeterW} doneAt={0.8} doneX={barX + barW} />
      <text x={360} y={rnnY + 82} textAnchor="middle" fontSize={12.5} fill={muted}>
        all 4 tokens done, but it took 4 steps of time
      </text>

      {/* divider */}
      <line x1={60} y1={194} x2={660} y2={194} stroke={border} strokeWidth={1.25} strokeDasharray="5 6" />

      {/* ===================== Transformer row (parallel) ===================== */}
      <text x={360} y={224} textAnchor="middle" fontSize={15} fill={fg} fontWeight={600}>
        Transformer: all tokens at once
      </text>
      {cols.map((x, i) => (
        <PulseBox key={`tf-${i}`} cx={x} cy={tfY} label={`x${sub[i]}`} start={0.05} end={0.2} />
      ))}
      <TimeMeter x={barX} y={tfY + 44} w={barW} keyTimes={tfMeterKT} widths={tfMeterW} doneAt={0.18} doneX={barX + q} savedFrom={barX + q} />
      <text x={360} y={tfY + 82} textAnchor="middle" fontSize={12.5} fill={muted}>
        all 4 tokens done in 1 step, no matter how many tokens
      </text>
    </svg>
  )
}
