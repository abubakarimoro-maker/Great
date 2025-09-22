import * as React from "react";
import TopBar from "@/components/TopBar";
import MachinePicker from "@/components/MachinePicker";
import Controls from "@/components/Controls";
import DrawsTable from "@/components/DrawsTable";
import ResultsCard from "@/components/ResultsCard";
import AdminStub from "@/components/AdminStub";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Draw, PredictRequest, PredictResponse } from "@/types/draw";
import { useSettings } from "@/hooks/useSettings";
import { useDraws } from "@/hooks/useDraws";
import { Button } from "@/components/ui/button";
import { fetchPrediction } from "@/api/predict";
import { fallbackPredict } from "@/utils/fallback";
import { showError, showSuccess } from "@/utils/toast";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { settings, update, setSettings } = useSettings();
  const { byGame, addDraw } = useDraws();

  const gameDraws = byGame.get(settings.game) ?? [];
  const [result, setResult] = React.useState<PredictResponse | null>(null);
  const [loading, setLoading] = React.useState(false);

  const buildPayload = (): PredictRequest => ({
    game: settings.game,
    draws: gameDraws,
    topK: settings.topK,
    temperature: settings.temperature,
    preferRecent: settings.preferRecent,
  });

  const ensureUnique = (nums: number[], k: number): number[] => {
    const seen = new Set<number>();
    const uniq = nums.filter((n) => (seen.has(n) ? false : (seen.add(n), true)));
    // If fewer than k, top up deterministically with smallest numbers not in set to keep logic simple
    let candidate = 1;
    while (uniq.length < k && candidate <= 90) {
      if (!seen.has(candidate)) {
        uniq.push(candidate);
        seen.add(candidate);
      }
      candidate++;
    }
    return uniq.slice(0, k);
  };

  const generate = async () => {
    if (!gameDraws.length) return;
    setLoading(true);
    setResult(null);
    try {
      const payload = buildPayload();
      const resp = await fetchPrediction(payload);
      let nums = resp.numbers;
      if (settings.avoidDuplicates) {
        nums = ensureUnique(nums, settings.topK);
      } else {
        nums = resp.numbers.slice(0, settings.topK);
      }
      setResult({ numbers: nums, rationale: resp.rationale, pairs: resp.pairs });
      showSuccess("Prediction generated");
    } catch (e: any) {
      const fb = fallbackPredict(settings.game, gameDraws, settings.topK, settings.preferRecent);
      setResult(fb);
      showError("DeepSeek unreachable. Used fallback generator.");
    } finally {
      setLoading(false);
    }
  };

  const regenerate = () => generate();

  // Keep settings game updates
  const setGame = (g: typeof settings.game) => setSettings({ ...settings, game: g });

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="max-w-6xl mx-auto w-full px-4 py-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left controls */}
          <div className="md:w-80 w-full shrink-0">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <MachinePicker value={settings.game} onChange={setGame} />
                <Controls
                  topK={settings.topK}
                  temperature={settings.temperature}
                  avoidDuplicates={settings.avoidDuplicates}
                  preferRecent={settings.preferRecent}
                  onChange={(next) => setSettings({ ...settings, ...next })}
                />
                <div className="flex items-center justify-between">
                  <Button className="w-full" onClick={generate} aria-label="AI Generate" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {loading ? "Generating..." : "AI Generate"}
                  </Button>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Admin</span>
                    <AdminStub onAdd={addDraw} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right content */}
          <div className="flex-1">
            {result && (
              <ResultsCard result={result} onRegenerate={regenerate} recentDraws={gameDraws} />
            )}
            <DrawsTable draws={gameDraws} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;