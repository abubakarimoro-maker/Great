import { addDays } from "date-fns";
import type { Draw, GameType } from "@/types/draw";

// Map game to weekday: 1=Mon, 2=Tue, 3=Wed
export function gameToWeekday(game: GameType): number {
  switch (game) {
    case "Monday Special":
      return 1;
    case "Lucky Tuesday":
      return 2;
    case "Mid Week":
      return 3;
    default:
      return 1;
  }
}

// Return the next date (including today) that matches the game's weekday.
export function nextDrawDate(game: GameType, fromDate: Date = new Date()): Date {
  const target = gameToWeekday(game); // 1..3
  const current = fromDate.getDay(); // 0..6 where 0=Sun
  // Convert target 1..3 to JS day 1..3 (Mon..Wed), which already aligns.
  const daysAhead = (target - current + 7) % 7;
  return addDays(fromDate, daysAhead);
}

// Keep only draws strictly before the upcoming draw date (so future-dated entries don't leak in)
export function filterDrawsBefore(draws: Draw[], upcomingISO: string): Draw[] {
  // dateISO is in YYYY-MM-DD so string comparison is safe
  return draws.filter((d) => d.dateISO < upcomingISO);
}