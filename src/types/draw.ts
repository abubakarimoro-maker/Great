export type GameType = "Monday Special" | "Lucky Tuesday" | "Mid Week";

export type Draw = {
  id: string;
  game: GameType;
  dateISO: string; // e.g., "2025-09-15"
  winning: number[]; // length 5, values 1..90
  machine: number[]; // length 5, values 1..90
  sourceNote?: string; // optional: parsing notes
  invalid?: boolean; // if true, skip from frequency stats
};

export type PredictRequest = {
  game: GameType;
  draws: Draw[];
  topK: number;
  temperature: number;
  preferRecent: number;
};

export type PredictResponse = {
  numbers: number[]; // unsorted, unique
  rationale: string;
  pairs?: [number, number][];
  usedFallback?: boolean;
};