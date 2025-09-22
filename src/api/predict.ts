import type { PredictRequest, PredictResponse } from "@/types/draw";

export async function fetchPrediction(payload: PredictRequest): Promise<PredictResponse> {
  const resp = await fetch("/api/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(detail || "Prediction API error");
  }

  const data = (await resp.json()) as any;
  // Defensive parsing: ensure shape
  const numbers: number[] = Array.isArray(data?.numbers)
    ? data.numbers.filter((n: any) => Number.isInteger(n) && n >= 1 && n <= 90)
    : [];
  const unique = Array.from(new Set(numbers));
  const rationale: string = typeof data?.rationale === "string" ? data.rationale : "No rationale provided.";
  const pairs: [number, number][] = Array.isArray(data?.pairs)
    ? data.pairs
        .filter(
          (p: any) =>
            Array.isArray(p) &&
            p.length === 2 &&
            Number.isInteger(p[0]) &&
            Number.isInteger(p[1]),
        )
        .map((p: any) => [p[0], p[1]] as [number, number])
    : [];
  return { numbers: unique, rationale, pairs };
}