import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PredictResponse, Draw } from "@/types/draw";
import { RefreshCw, Flame } from "lucide-react";

type Props = {
  result: PredictResponse;
  onRegenerate: () => void;
  recentDraws: Draw[];
};

function computeHotSet(draws: Draw[]): Set<number> {
  const last5 = draws.slice(-5);
  const s = new Set<number>();
  for (const d of last5) {
    if (d.invalid) continue;
    for (const n of d.winning) s.add(n);
    for (const n of d.machine) s.add(n);
  }
  return s;
}

const ResultsCard: React.FC<Props> = ({ result, onRegenerate, recentDraws }) => {
  const hot = computeHotSet(recentDraws);
  return (
    <Card className="mb-4">
      <CardHeader className="flex items-start justify-between">
        <div>
          <CardTitle>Suggested Numbers</CardTitle>
          <CardDescription>
            Unsorted, unique picks. {result.usedFallback && <span className="inline-block ml-1 px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-800">Used fallback generator</span>}
          </CardDescription>
        </div>
        <Button variant="secondary" onClick={onRegenerate} aria-label="Regenerate">
          <RefreshCw className="h-4 w-4" />
          Regenerate
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {result.numbers.map((n) => (
            <Badge key={n} className="text-base px-3 py-1">
              {n}
              {hot.has(n) && (
                <span className="ml-1 inline-flex items-center gap-1 text-amber-600">
                  <Flame className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-wide">hot</span>
                </span>
              )}
            </Badge>
          ))}
        </div>

        {result.pairs && result.pairs.length > 0 && (
          <div className="text-sm">
            <span className="font-medium mr-2">Pairs to watch:</span>
            {result.pairs.map((p, idx) => (
              <Badge key={idx} variant="secondary" className="mr-1">
                {p[0]} & {p[1]}
              </Badge>
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground">{result.rationale}</p>

        <div
          role="note"
          aria-live="polite"
          className="text-sm mt-2 p-3 rounded-md border bg-muted/30"
        >
          ⚠️ Lottery outcomes are random. This tool is for entertainment only—no guarantees.
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsCard;