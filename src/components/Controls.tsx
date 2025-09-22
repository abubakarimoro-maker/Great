import * as React from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

type Props = {
  topK: number;
  temperature: number;
  avoidDuplicates: boolean;
  preferRecent: number;
  onChange: (next: Partial<Props>) => void;
};

const Controls: React.FC<Props> = ({
  topK,
  temperature,
  avoidDuplicates,
  preferRecent,
  onChange,
}) => {
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="topK" className="text-sm font-medium">
          Top picks (count)
        </label>
        <Input
          id="topK"
          type="number"
          min={1}
          max={10}
          value={topK}
          onChange={(e) =>
            onChange({ topK: clamp(parseInt(e.target.value || "0", 10), 1, 10) })
          }
          aria-label="Top picks count"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="temperature" className="text-sm font-medium">
            Temperature
          </label>
          <span className="text-xs text-muted-foreground">{temperature.toFixed(2)}</span>
        </div>
        <Slider
          id="temperature"
          value={[temperature]}
          min={0.2}
          max={1.2}
          step={0.05}
          onValueChange={(vals) => onChange({ temperature: Number(vals[0]) })}
          aria-label="Temperature"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label htmlFor="avoidDup" className="text-sm font-medium">
            Avoid duplicates within pick
          </label>
          <p className="text-xs text-muted-foreground">Ensure unique numbers in a suggestion</p>
        </div>
        <Switch
          id="avoidDup"
          checked={avoidDuplicates}
          onCheckedChange={(v) => onChange({ avoidDuplicates: Boolean(v) })}
          aria-label="Avoid duplicates"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="preferRecent" className="text-sm font-medium">
            Prefer recent frequency
          </label>
          <span className="text-xs text-muted-foreground">{preferRecent.toFixed(2)}</span>
        </div>
        <Slider
          id="preferRecent"
          value={[preferRecent]}
          min={0}
          max={1}
          step={0.05}
          onValueChange={(vals) => onChange({ preferRecent: Number(vals[0]) })}
          aria-label="Prefer recent frequency weight"
        />
      </div>
    </div>
  );
};

export default Controls;