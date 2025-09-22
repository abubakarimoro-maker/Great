import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GameType } from "@/types/draw";

type Props = {
  value: GameType;
  onChange: (v: GameType) => void;
};

const MachinePicker: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="machine" className="text-sm font-medium">
        Lotto Machine / Game
      </label>
      <Select value={value} onValueChange={(v) => onChange(v as GameType)}>
        <SelectTrigger id="machine" aria-label="Select game">
          <SelectValue placeholder="Select game" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Monday Special">Monday Special</SelectItem>
          <SelectItem value="Lucky Tuesday">Lucky Tuesday</SelectItem>
          <SelectItem value="Mid Week">Mid Week</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MachinePicker;