import * as React from "react";
import { SEED_DRAWS } from "@/data/seedDraws";
import type { Draw, GameType } from "@/types/draw";
import { loadJSON, saveJSON } from "@/utils/storage";
import { markInvalid } from "@/utils/cleaning";

const KEY = "lotto_predictor_draws_v1";

export function useDraws() {
  const [draws, setDraws] = React.useState<Draw[]>(() => {
    const user = loadJSON<Draw[]>(KEY, []);
    const merged = [...SEED_DRAWS, ...user];
    // Ensure sorted by date ascending for operations (we'll sort in UI as needed)
    const byDate = [...merged].sort((a, b) => a.dateISO.localeCompare(b.dateISO));
    return markInvalid(byDate);
  });

  const addDraw = (d: Draw) => {
    setDraws((prev) => {
      const next = markInvalid([...prev, d]);
      const userOnly = next.filter((x) => !SEED_DRAWS.some((s) => s.id === x.id));
      saveJSON(KEY, userOnly);
      return next.sort((a, b) => a.dateISO.localeCompare(b.dateISO));
    });
  };

  const byGame = React.useMemo(() => {
    const map = new Map<GameType, Draw[]>();
    for (const d of draws) {
      const arr = map.get(d.game) ?? [];
      arr.push(d);
      map.set(d.game, arr);
    }
    return map;
  }, [draws]);

  return { draws, addDraw, byGame };
}