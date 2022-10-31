"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSocket = exports.GameServer = void 0;
const socket_io_1 = require("socket.io");
class GameServer extends socket_io_1.Server {
}
exports.GameServer = GameServer;
class GameSocket extends socket_io_1.Socket {
}
exports.GameSocket = GameSocket;
//# sourceMappingURL=socket.js.map