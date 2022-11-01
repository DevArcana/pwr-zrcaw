export interface Player {
  username: string;
  status: "disconnected" | "idle" | "lobby" | "in-game";
  score: number;
}