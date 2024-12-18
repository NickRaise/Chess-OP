import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];
    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter((user) => user != socket);
    }

    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type == INIT_GAME) {
                // handle case where the same user send request twice
                if (this.pendingUser) {
                    //start the game
                    console.log("Game started")
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                } else {
                    console.log("User pu in pending")
                    this.pendingUser = socket;
                }
            }

            if (message.type == MOVE) {
                const game = this.games.find(
                    (game) => game.player1 == socket || game.player2 == socket
                );
                if(game) {
                    //play the move
                    game.makeMove(socket, message.move);
                    console.log(message)
                }
            }
        });
    }
}
