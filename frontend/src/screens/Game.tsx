import { useEffect, useState } from "react";
import Button from "../components/Button";
import ChessBoard from "../components/ChessBoard";
import useSocket from "../hooks/useSocket";
import { Chess } from "chess.js";
import { boardType } from "../types";
import { MOVE, INIT_GAME, GAME_OVER } from "../types";



const Game = () => {
  const socket = useSocket()
  const [chess, setChess] = useState<Chess>()
  const [board, setBoard] = useState<boardType>()

  useEffect(() => {
    console.log(socket, "THisis socket")
    if (!socket) return
    socket.onmessage = (event) => {
      console.log(event)
      const message = JSON.parse(event.data)
      switch (message.type) {
        case INIT_GAME:
          console.log("Game started")
          const newChess = new Chess()
          setChess(newChess)
          console.log("chess has been defined", newChess)
          setBoard(newChess.board())
          break;
        case MOVE:
          console.log("this is chess", chess)
          console.log("this is board", board)
          const move = message.payload.move
          console.log(message.payload.move)
          if(!chess) console.log("chess is not defined :::(")
          chess.move(move)
          setBoard(chess.board())
          setChess(chess)
          console.log("Mode made", move)
          break;
        case GAME_OVER:
          console.log("Game over")
          break;
        default:
          break;
      }
    }
  }, [socket])

  if (!socket)
    return <div className="text-white">Connecting...</div>

  return (
    <div className="justify-center flex text-white">
      <div className="max-w-screen-lg p-8 w-full">
        <div className="grid grid-cols-5 w-full gap-4">
          <div className="col-span-4 w-full">
            <ChessBoard board={board} socket={socket} chess={chess} setBoard={setBoard} />
          </div>
          <div className="col-span-1">
            <Button onClick={
              () => {
                console.log("Init game send")
                socket.send(JSON.stringify({
                  "type": INIT_GAME,
                }))
              }
            }>Play</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
