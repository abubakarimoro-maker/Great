export const config = {
  runtime: "nodejs",
};

type Req = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: any;
};

type Res = {
  status: (code: number) => Res;
  setHeader: (name: string, value: string) => void;
  json: (data: any) => void;
  send: (data: any) => void;
};

const RATE_LIMIT = 10; // per minute
const buckets = new Map<string, number[]>();

function ipFromHeaders(headers: Record<string, any>): string {
  const xf = headers["x-forwarded-for"];
  if (typeof xf === "string") return xf.split(",")[0].trim();
  if (Array.isArray(xf)) return xf[0];
  return "unknown";
}

function allow(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const arr = buckets.get(ip) ?? [];
  const recent = arr.filter((t) => now - t < windowMs);
  if (recent.length >= RATE_LIMIT) {
    buckets.set(ip, recent);
    return false;
  }
  recent.push(now);
  buckets.set(ip, recent);
  return true;
}

export default async function handler(req: Req, res: Res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const ip = ipFromHeaders(req.headers || {});
  if (!allow(ip)) {
    res.status(429).json({ error: "Rate limit exceeded. Try again later." });
    return;
  }

  try {
    const { game, draws, topK = 5, temperature = 0.8, preferRecent = 0.6 } = req.body || {};
    const systemPrompt = `
You are an assistant that suggests ${topK} lottery numbers (1-90) for entertainment only.
NEVER claim certainty. Avoid duplicates within a suggestion.
Bias slightly toward recent frequency (weight=${preferRecent}), but include novelty.
Return strict JSON with keys: numbers (array of ${topK} ints 1..90, unsorted, unique), rationale (short string), pairs (array of up to 3 two-number arrays).
`.trim();

    const userPrompt = `
Game: ${game}
Recent draws (most recent last):
${(draws || [])
  .map(
    (d: any) =>
      `${d.dateISO} | Winning ${Array.isArray(d.winning) ? d.winning.join("-") : ""} | Machine ${Array.isArray(d.machine) ? d.machine.join("-") : ""}`,
  )
  .join("\n")}

Task: Suggest ${topK} numbers (1..90), unique within the set. Provide a short rationale and up to 3 number pairs to watch. Do not repeat the exact last winning set.
`.trim();

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "Missing DEEPSEEK_API_KEY" });
      return;
    }

    const resp = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      res.status(500).json({ error: "DeepSeek error", detail });
      return;
    }
    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content ?? "{}";
    const json = JSON.parse(content);
    res.json(json);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Unknown error" });
  }
}