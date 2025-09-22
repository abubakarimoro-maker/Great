import * as React from "react";
import { loadJSON, saveJSON } from "@/utils/storage";
import type { GameType } from "@/types/draw";

type Settings = {
  game: GameType;
  topK: number;
  temperature: number; // 0.2 - 1.2
  avoidDuplicates: boolean;
  preferRecent: number; // 0 - 1
};

const KEY = "lotto_predictor_settings_v1";

const DEFAULTS: Settings = {
  game: "Monday Special",
  topK: 5,
  temperature: 0.8,
  avoidDuplicates: true,
  preferRecent: 0.6,
};

export function useSettings() {
  const [settings, setSettings] = React.useState<Settings>(() => loadJSON<Settings>(KEY, DEFAULTS));

  React.useEffect(() => {
    saveJSON(KEY, settings);
  }, [settings]);

  return {
    settings,
    setSettings,
    update<K extends keyof Settings>(key: K, value: Settings[K]) {
      setSettings((s) => ({ ...s, [key]: value }));
    },
  };
}