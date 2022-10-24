export type PlayerStatus = "idle" | "lobby" | "in-game";

export interface Player {
  username: string;
  status: PlayerStatus;
}