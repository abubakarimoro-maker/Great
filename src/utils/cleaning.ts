import type { Draw } from "@/types/draw";

const inRange = (n: number) => Number.isInteger(n) && n >= 1 && n <= 90;

export function parseNumberTokens(raw: string): { numbers: number[]; note?: string } {
  if (!raw) return { numbers: [] };
  const tokens = raw
    .replace(/[,|-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const numbers: number[] = [];
  const notes: string[] = [];

  for (const t of tokens) {
    if (/^\d+$/.test(t)) {
      const n = Number(t);
      if (inRange(n)) {
        numbers.push(n);
        continue;
      }
      // 4 digits glued into two 2-digit numbers (e.g., 5926)
      if (t.length === 4) {
        const a = Number(t.slice(0, 2));
        const b = Number(t.slice(2));
        if (inRange(a) && inRange(b)) {
          numbers.push(a, b);
          notes.push(`Token '${t}' split to ${a} & ${b}`);
          continue;
        }
      }
      // 3 digits attempt split into two parts that are 1..90
      if (t.length === 3) {
        // try 2+1 then 1+2
        const a1 = Number(t.slice(0, 2));
        const b1 = Number(t.slice(2));
        const a2 = Number(t.slice(0, 1));
        const b2 = Number(t.slice(1));
        if (inRange(a1) && inRange(b1)) {
          numbers.push(a1, b1);
          notes.push(`Token '${t}' split to ${a1} & ${b1}`);
          continue;
        }
        if (inRange(a2) && inRange(b2)) {
          numbers.push(a2, b2);
          notes.push(`Token '${t}' split to ${a2} & ${b2}`);
          continue;
        }
      }
      notes.push(`Dropped out-of-range token '${t}'`);
    }
  }
  // de-duplicate while preserving order
  const seen = new Set<number>();
  const deduped = numbers.filter((n) => (seen.has(n) ? false : (seen.add(n), true)));
  return { numbers: deduped, note: notes.length ? notes.join("; ") : undefined };
}

export function validateDrawArrays(arr: number[]): boolean {
  return Array.isArray(arr) && arr.length === 5 && arr.every(inRange);
}

export function markInvalid(draws: Draw[]): Draw[] {
  return draws.map((d) => {
    const valid = validateDrawArrays(d.winning) && validateDrawArrays(d.machine);
    return valid ? d : { ...d, invalid: true, sourceNote: d.sourceNote ?? "Invalid length or value(s)" };
  });
}