import { Player } from "./player";

export interface ServerToClientEvents {
  connected: (player: Player) => void
}

export interface ClientToServerEvents {

}