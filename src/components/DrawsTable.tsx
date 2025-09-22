import * as React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Draw } from "@/types/draw";
import { Button } from "@/components/ui/button";
import { Clipboard, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

type Props = {
  draws: Draw[];
};

const DrawsTable: React.FC<Props> = ({ draws }) => {
  const [desc, setDesc] = React.useState(true);

  const sorted = React.useMemo(() => {
    const arr = [...draws];
    arr.sort((a, b) =>
      desc ? b.dateISO.localeCompare(a.dateISO) : a.dateISO.localeCompare(b.dateISO),
    );
    return arr;
  }, [draws, desc]);

  const copyTable = async () => {
    const header = "dateISO,winning,machine";
    const lines = sorted.map(
      (d) =>
        `${d.dateISO},"${d.winning.join("-")}","${d.machine.join("-")}"`,
    );
    const csv = [header, ...lines].join("\n");
    await navigator.clipboard.writeText(csv);
    toast.success("Copied table to clipboard");
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Recent Draws</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyTable} aria-label="Copy table">
            <Clipboard className="h-4 w-4" />
            Copy
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => setDesc((v) => !v)}
              aria-sort={desc ? "descending" : "ascending"}
            >
              Date {desc ? "↓" : "↑"}
            </TableHead>
            <TableHead>Winning</TableHead>
            <TableHead>Machine</TableHead>
            <TableHead className="w-10">Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="whitespace-nowrap">{d.dateISO}</TableCell>
              <TableCell className="font-mono">{d.winning.join(" - ")}</TableCell>
              <TableCell className="font-mono">{d.machine.join(" - ")}</TableCell>
              <TableCell className="text-right">
                {(d.sourceNote || d.invalid) && (
                  <span className="inline-flex items-center gap-1 text-amber-600" title={d.sourceNote || "Invalid"}>
                    <TriangleAlert className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>Click Date to sort. Copy exports as CSV.</TableCaption>
      </Table>
    </div>
  );
};

export default DrawsTable;