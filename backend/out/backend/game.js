"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const win_conditions = [
    0b111000000,
    0b000111000,
    0b000000111,
    0b100100100,
    0b010010010,
    0b001001001,
    0b100010001,
    0b001010100,
];
class Game {
    constructor(player_a, player_b) {
        // setup players
        [this.player_x, this.player_o] = Math.random() % 2 == 0 ? [player_a, player_b] : [player_b, player_a];
        this.status = "in-progress";
        this.current_turn = "x";
        this.board = ["", "", "", "", "", "", "", "", ""];
        // setup events
        this.player_o.once("disconnect", this.player_o_disconnect);
        this.player_x.once("disconnect", this.player_x_disconnect);
        this.player_o.once("game_ready", this.game_ready);
        this.player_x.once("game_ready", this.game_ready);
        this.player_o.once("game_leave", this.player_o_game_leave);
        this.player_x.once("game_leave", this.player_x_game_leave);
        this.setup_move_event();
    }
    get current_turn_player() {
        return this.current_turn === "x" ? this.player_x : this.player_o;
    }
    get binary_x_state() {
        return this.calculate_binary_state("x");
    }
    get binary_o_state() {
        return this.calculate_binary_state("o");
    }
    get game_state() {
        return {
            board: this.board,
            current_turn: this.current_turn,
            status: this.status,
            player_x: {
                username: this.player_x.data.username,
                status: this.player_x.connected ? "connected" : "disconnected",
            },
            player_o: {
                username: this.player_o.data.username,
                status: this.player_o.connected ? "connected" : "disconnected",
            },
        };
    }
    player_o_disconnect() {
        this.status = "x_won";
        this.player_x.emit("game_move", this.game_state);
        this.player_o_clean_up();
    }
    player_x_disconnect() {
        this.status = "o_won";
        this.player_o.emit("game_move", this.game_state);
        this.player_x_clean_up();
    }
    game_ready(callback) {
        console.log(JSON.stringify(this.game_state));
        callback(this.game_state);
    }
    player_x_game_leave() {
        if (this.status === "in-progress") {
            this.status = "o_won";
            this.player_o.emit("game_move", this.game_state);
        }
        this.player_x.data.status = "idle";
        this.player_x.emit("updated", this.player_x.data);
        this.player_x_clean_up();
    }
    player_o_game_leave() {
        if (this.status === "in-progress") {
            this.status = "x_won";
            this.player_x.emit("game_move", this.game_state);
        }
        this.player_o.data.status = "idle";
        this.player_o.emit("updated", this.player_o.data);
        this.player_o_clean_up();
    }
    player_x_clean_up() {
        this.player_x.off("disconnect", this.player_x_disconnect);
        this.player_x.off("game_ready", this.game_ready);
        this.player_x.off("game_leave", this.player_x_game_leave);
        this.player_x.off("game_move", this.player_make_move);
    }
    player_o_clean_up() {
        this.player_o.off("disconnect", this.player_o_disconnect);
        this.player_o.off("game_ready", this.game_ready);
        this.player_o.off("game_leave", this.player_o_game_leave);
        this.player_o.off("game_move", this.player_make_move);
    }
    calculate_binary_state(move) {
        return this.board.reduce((p, c, i) => p | ((c === move ? 1 : 0) << i), 0b000000000);
    }
    player_make_move(cellIndex, callback) {
        if (this.status === "in-progress") {
            this.make_move(cellIndex);
            this.setup_move_event();
            this.current_turn_player.emit("game_move", this.game_state);
        }
        callback(this.game_state);
    }
    setup_move_event() {
        if (this.status !== "in-progress") {
            return;
        }
        this.current_turn_player.once("game_move", this.player_make_move);
    }
    match_win_conditions(move) {
        const state = this.calculate_binary_state(move);
        if (win_conditions.some(x => x == state)) {
            this.status = move == "x" ? "x_won" : "o_won";
            return true;
        }
        return false;
    }
    make_move(cellIndex) {
        this.board[cellIndex] = this.current_turn;
        this.current_turn = this.current_turn === "x" ? "o" : "x";
        if (!this.match_win_conditions("x")) {
            this.match_win_conditions("o");
        }
        if (this.status == "in-progress" && this.board.every(x => x !== "")) {
            this.status = "tie";
        }
    }
}
exports.Game = Game;
//# sourceMappingURL=game.js.map