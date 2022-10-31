export interface Player {
  username: string;
  status: "idle" | "lobby" | "in-game";
}