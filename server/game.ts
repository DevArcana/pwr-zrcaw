import { GameSocket } from "./models/socket";
import { updatePlayerStatus } from "./players";

export const startGame = (player_x: GameSocket, player_o: GameSocket) => {
  updatePlayerStatus(player_o.data.username, "in-game");
  updatePlayerStatus(player_x.data.username, "in-game");

  console.log(`${player_x.data.username} [X] vs ${player_o.data.username} [O]`)
}