import type { Draw, PredictResponse } from "@/types/draw";

// Compute frequencies across valid draws (winning + machine)
function computeFrequencies(draws: Draw[]): number[] {
  const freq = Array(91).fill(0) as number[]; // index 1..90
  for (const d of draws) {
    if (d.invalid) continue;
    for (const n of d.winning) freq[n] += 1;
    for (const n of d.machine) freq[n] += 1;
  }
  return freq;
}

function sampleWithoutReplacement(weights: number[], k: number): number[] {
  const selected: number[] = [];
  const w = [...weights];
  for (let i = 0; i < k; i++) {
    const total = w.reduce((acc, x) => acc + x, 0);
    if (total <= 0) break;
    const r = Math.random() * total;
    let cum = 0;
    let pick = -1;
    for (let n = 1; n <= 90; n++) {
      cum += w[n];
      if (r <= cum) {
        pick = n;
        break;
      }
    }
    if (pick === -1) break;
    selected.push(pick);
    w[pick] = 0; // remove from pool
  }
  return selected;
}

export function fallbackPredict(
  game: string,
  draws: Draw[],
  topK: number,
  preferRecent: number,
): PredictResponse {
  const recent = draws.slice(-10); // last N=10 or fewer
  const lastWinning = draws.length ? draws[draws.length - 1].winning : [];
  const freq = computeFrequencies(recent);
  // Normalize and build weights
  const weights = Array(91).fill(0) as number[];
  for (let n = 1; n <= 90; n++) {
    const base = 0.001; // minimal base to keep every number possible
    const recentBoost = freq[n]; // higher if seen more
    const globalFreq = freq[n]; // same set (we use recent only dataset)
    let w = base + preferRecent * recentBoost + (1 - preferRecent) * globalFreq * 0.5;
    // novelty penalty: avoid repeating exact last winning set
    if (lastWinning.includes(n)) {
      w *= 0.7;
    }
    weights[n] = w;
  }
  const numbers = sampleWithoutReplacement(weights, topK);
  const rationale =
    "Weighted by recent frequency with a small novelty boost to avoid last draw; for entertainment only.";
  // naive pairs to watch: take first two consecutive selections if possible
  const pairs: [number, number][] =
    numbers.length >= 2 ? [[numbers[0], numbers[1]]] : [];

  return { numbers, rationale, pairs, usedFallback: true };
}