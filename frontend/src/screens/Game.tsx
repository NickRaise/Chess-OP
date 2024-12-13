import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import ChessBoard from "../components/ChessBoard";
import useSocket from "../hooks/useSocket";
import { Chess } from "chess.js";
import { boardType, gameStatus } from "../types";
import { MOVE, INIT_GAME, GAME_OVER } from "../types";


const Game = () => {
  const socket = useSocket()
  const [chess] = useState<Chess>(new Chess())
  const [board, setBoard] = useState<boardType>()
  const currentUserPieceColor = useRef<null | 'w' | 'b'>(null)
  const [gameStarted, setGameStarted] = useState<true | false>(false)
  const [loading, setLoading] = useState(false)
  const [currentUserTurn, setCurrentUserTurn] = useState(false)
  const [gameStatus, setGameStatus] = useState<gameStatus>({
    gameOver: false,
    winner: null
  })

  useEffect(() => {
    if (!socket) return

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      switch (message.type) {

        case INIT_GAME:
          setBoard(chess.board())
          const color = message.payload.color == "white" ? 'w' : 'b'
          setCurrentUserTurn(color === 'w')
          currentUserPieceColor.current = color
          setGameStarted(true)
          break;

        case MOVE:
          makeMove(message)
          break;

        case GAME_OVER:
          makeMove(message)
          const winner = message.payload.winner
          showGameOver(winner)
          console.log("Game over... Winner is ", winner)
          break;

        default:
          break;
      }
    }
  }, [socket])

  const makeMove = (message: {
    payload: {
      move: { from: string, to: string; },
      playedBy: 'w' | 'b',
      winner?: 'black' | 'white'
    }
  }) => {
    const move = message.payload.move
    console.log("before move made", chess.turn())
    chess.move(move)
    console.log("after move made", chess.turn())
    setBoard(chess.board())
    setCurrentUserTurn(true)
    setCurrentUserTurn(true)
  }

  const showGameOver = (winner: 'black' | 'white') => {
    setGameStatus({
      gameOver: true,
      winner
    })
  }

  if (!socket)
    return <div className="text-white">Connecting...</div>

  return (
    <div className="justify-center flex text-white">
      <div className="max-w-screen-lg p-8 w-full">
        <div className="grid grid-cols-5 w-full gap-4">
          <div className="col-span-4 w-full">
            <ChessBoard board={board} socket={socket} chess={chess} setBoard={setBoard} currentUserPieceColor={currentUserPieceColor} gameStatus={gameStatus} setCurrentUserTurn={setCurrentUserTurn} />
          </div>
          <div className="col-span-1 flex flex-col justify-center">
            {gameStatus.gameOver === true ?
              <GameOverPanel winner={gameStatus.winner} /> :
              (gameStarted !== true) ? <Button onClick={
                () => {
                  if (loading === true) return
                  setLoading(true)
                  socket.send(JSON.stringify({
                    "type": INIT_GAME,
                  }))
                }
              }>
                {loading === true ? <Loading /> : "Play"}
              </Button> :
                <div className="mt-5 bg-slate-700 text-center px-2 py-1 rounded-md text-3xl font-bold">
                  {currentUserTurn ? "Your Turn" : "Waiting for opponent..."}
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

const GameOverPanel = ({ winner }: { winner: 'black' | 'white' | null }) => {
  return (
    <div className="text-2xl">
      Winner is {winner}
    </div>
  )
}

const Loading = () => {
  return (<div role="status">
    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>)
}


export default Game;