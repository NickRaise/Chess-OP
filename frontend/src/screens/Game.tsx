import Button from "../components/Button";
import ChessBoard from "../components/ChessBoard";
import useSocket from "../hooks/useSocket";

const INIT_GAME = "init_game"
const MOVE = "move"
const GAME_OVER = "game_over"

const Game = () => {
  const socket = useSocket()
  if (!socket)
    return <div className="text-white">Connecting...</div>

  return (
    <div className="justify-center flex text-white">
      <div className="max-w-screen-lg p-8 w-full">
        <div className="grid grid-cols-5 w-full gap-4">
          <div className="col-span-4 w-full">
            <ChessBoard />
          </div>
          <div className="col-span-1">
            <Button onClick={
              () => {
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
