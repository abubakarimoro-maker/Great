import * as React from "react";
import type { Draw, GameType } from "@/types/draw";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseNumberTokens, validateDrawArrays } from "@/utils/cleaning";
import { toast } from "sonner";

type Props = {
  onAdd: (d: Draw) => void;
};

const AdminStub: React.FC<Props> = ({ onAdd }) => {
  const [open, setOpen] = React.useState(false);
  const [game, setGame] = React.useState<GameType>("Monday Special");
  const [dateISO, setDateISO] = React.useState("");
  const [winningRaw, setWinningRaw] = React.useState("");
  const [machineRaw, setMachineRaw] = React.useState("");

  const handleAdd = () => {
    if (!dateISO) {
      toast.error("Please enter a date");
      return;
    }
    const w = parseNumberTokens(winningRaw);
    const m = parseNumberTokens(machineRaw);
    const id = `${game}:${dateISO}`;
    const draw: Draw = {
      id,
      game,
      dateISO,
      winning: w.numbers.slice(0, 5),
      machine: m.numbers.slice(0, 5),
      sourceNote: [w.note, m.note].filter(Boolean).join("; ") || undefined,
    };
    const valid = validateDrawArrays(draw.winning) && validateDrawArrays(draw.machine);
    if (!valid) {
      draw.invalid = true;
    }
    onAdd(draw);
    toast.success("Draw added");
    setOpen(false);
    setWinningRaw("");
    setMachineRaw("");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Add draw">Add Draw</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Draw</AlertDialogTitle>
          <AlertDialogDescription>Enter a new draw. Numbers accept delimiters , - and spaces. Glued tokens like 5926 will be split.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-3 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Game</label>
            <Select value={game} onValueChange={(v) => setGame(v as GameType)}>
              <SelectTrigger><SelectValue placeholder="Select game" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Monday Special">Monday Special</SelectItem>
                <SelectItem value="Lucky Tuesday">Lucky Tuesday</SelectItem>
                <SelectItem value="Mid Week">Mid Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">Date</label>
            <Input id="date" type="date" value={dateISO} onChange={(e) => setDateISO(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label htmlFor="winning" className="text-sm font-medium">Winning (5 numbers)</label>
            <Input id="winning" placeholder="e.g. 59 26 13 36 81" value={winningRaw} onChange={(e) => setWinningRaw(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label htmlFor="machine" className="text-sm font-medium">Machine (5 numbers)</label>
            <Input id="machine" placeholder="e.g. 65 77 12 14 47" value={machineRaw} onChange={(e) => setMachineRaw(e.target.value)} />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAdd}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdminStub;