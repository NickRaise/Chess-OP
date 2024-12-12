"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        console.log("send game request");
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        //validation here
        //is it this user move
        //is this move valid
        console.log("movecount", this.moveCount);
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("early return 1");
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("early return 1");
            return;
        }
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log(e);
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() == "w" ? "black" : "white",
                    move,
                    playedBy: this.moveCount % 2 === 0 ? 'w' : 'b'
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() == "w" ? "black" : "white",
                    move,
                    playedBy: this.moveCount % 2 === 0 ? 'w' : 'b'
                }
            }));
            return;
        }
        const moveMessage = JSON.stringify({
            type: messages_1.MOVE,
            payload: {
                move,
                playedBy: this.moveCount % 2 === 0 ? 'w' : 'b'
            }
        });
        this.player2.send(moveMessage);
        this.player1.send(moveMessage);
        this.moveCount++;
        // check if game over
        //Send the updated board to both players
    }
}
exports.Game = Game;
