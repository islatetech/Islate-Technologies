/**
 * The animated top edge of the contact panel. Two layers of waves cut into the
 * panel from above and drift sideways at different speeds. Each path is two
 * full periods wide, so sliding it by half its width loops without a seam.
 */
function wavePath(amp: number, base: number, periods: number, phase: number) {
  const W = 2400;
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 20) {
    const y = base + amp * Math.sin(((x / W) * periods * Math.PI * 2) + phase) + amp * 0.35 * Math.sin(((x / W) * periods * 2.3 * Math.PI * 2) + phase * 1.7);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M0,0 L${pts.join(" L")} L${W},0 Z`;
}

export function WaveEdge({ background }: { background: string }) {
  const layers = [
    { d: wavePath(34, 78, 2, 0.4), fill: "#17181b", dur: "26s" },
    { d: wavePath(28, 58, 2, 2.2), fill: background, dur: "19s" },
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[150px] overflow-hidden md:h-[190px]">
      {layers.map((l, i) => (
        <svg
          key={i}
          className="wave-layer absolute left-0 top-0 h-full"
          style={{ width: "200%", animation: `wave-drift ${l.dur} linear infinite` }}
          viewBox="0 0 2400 190"
          preserveAspectRatio="none"
        >
          <path d={l.d} fill={l.fill} />
        </svg>
      ))}
    </div>
  );
}
