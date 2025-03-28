import { Chess } from "chess.js";
import WebSocket from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private startTime: Date;
    private moveCount = 0;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        console.log("send game request")
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }))
    }

    makeMove(socket: WebSocket, move: {from: string, to: string;}) {
        
        // exit if the move is not made by the valid player
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("early return 1")
            return
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("early return 1")
            return
        }
        
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log(e)
            return
        }

        // check if the game is over ?
        if(this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() == "w" ? "black" : "white",
                    move,
                    playedBy: this.moveCount % 2 === 0 ? 'w' : 'b'
                }
            }))
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() == "w" ? "black" : "white",
                    move,
                    playedBy: this.moveCount % 2 === 0 ? 'w' : 'b'
                }
            }))
            return;
        }

        const moveMessage = JSON.stringify({
            type: MOVE,
            payload: {
                move,
                playedBy: this.moveCount % 2 === 0 ? 'w' : 'b'
            }
        })

        if(socket == this.player1)
            this.player2.send(moveMessage)
        else
            this.player1.send(moveMessage)
        
        this.moveCount++;
    }
}
