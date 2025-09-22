import type { Draw } from "@/types/draw";

const id = (game: string, dateISO: string) => `${game}:${dateISO}`;

export const SEED_DRAWS: Draw[] = [
  {
    id: id("Monday Special", "2025-08-25"),
    game: "Monday Special",
    dateISO: "2025-08-25",
    winning: [2, 1, 61, 63, 85],
    machine: [88, 5, 77, 37, 45],
  },
  {
    id: id("Monday Special", "2025-09-01"),
    game: "Monday Special",
    dateISO: "2025-09-01",
    winning: [81, 84, 50, 10, 41],
    machine: [31, 27, 37, 43, 40],
  },
  {
    id: id("Monday Special", "2025-09-08"),
    game: "Monday Special",
    dateISO: "2025-09-08",
    winning: [13, 36, 81, 59, 26],
    machine: [65, 77, 12, 14, 47],
    sourceNote: "Winning token '5926' split to 59 & 26",
  },
  {
    id: id("Monday Special", "2025-09-15"),
    game: "Monday Special",
    dateISO: "2025-09-15",
    winning: [33, 90, 34, 3, 73],
    machine: [31, 75, 40, 48, 71],
  },
  {
    id: id("Lucky Tuesday", "2025-09-02"),
    game: "Lucky Tuesday",
    dateISO: "2025-09-02",
    winning: [57, 50, 21, 89, 46],
    machine: [11, 19, 73, 80, 1],
  },
  {
    id: id("Lucky Tuesday", "2025-09-09"),
    game: "Lucky Tuesday",
    dateISO: "2025-09-09",
    winning: [14, 51, 57, 89, 17],
    machine: [34, 28, 31, 75, 54],
  },
  {
    id: id("Lucky Tuesday", "2025-09-16"),
    game: "Lucky Tuesday",
    dateISO: "2025-09-16",
    winning: [49, 87, 61, 22, 34],
    machine: [10, 8, 67, 2, 34],
  },
  {
    id: id("Mid Week", "2025-09-03"),
    game: "Mid Week",
    dateISO: "2025-09-03",
    winning: [58, 84, 18, 57, 7],
    machine: [87, 27, 9, 8, 62],
    sourceNote: "Machine token '279' split to 27 & 9",
  },
  {
    id: id("Mid Week", "2025-09-10"),
    game: "Mid Week",
    dateISO: "2025-09-10",
    winning: [23, 32, 19, 70, 3],
    machine: [74, 69, 55, 45, 89],
  },
  {
    id: id("Mid Week", "2025-09-17"),
    game: "Mid Week",
    dateISO: "2025-09-17",
    winning: [68, 63, 16, 34, 85],
    machine: [67, 57, 45, 84, 89],
  },
];