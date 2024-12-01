import { Dispatch, SetStateAction, useState } from "react";
import { boardType, MOVE } from "../types"
import { Chess, Square } from "chess.js";

interface ChessBoardType {
    board: boardType | undefined,
    socket: WebSocket,
    chess: Chess | undefined,
    setBoard: Dispatch<SetStateAction<boardType | undefined>>
}

const ChessBoard = ({ board, socket, chess, setBoard }: ChessBoardType) => {

    const [from, setFrom] = useState<null | Square>()
    if (!board) {
        return <ChessLoading />;
    }

    return (
        <div className="grid grid-cols-8 gap-0" style={{ width: "384px", height: "384px" }}>
            {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                    const isWhiteSquare = (rowIndex + colIndex) % 2 === 0;
                    const squareColorClass = isWhiteSquare ? "bg-white" : "bg-gray-700";
                    const squarePosition: Square = String.fromCharCode(97 + colIndex) + String(8 - rowIndex) as Square;
                    return (
                        <div
                            onClick={(e) => {
                                console.log(squarePosition)
                                if (!from) {
                                    setFrom(squarePosition)
                                }
                                else {
                                    if (from == squarePosition) return
                                    const move = {
                                        from,
                                        to: squarePosition
                                    }
                                    const message = {
                                        type: MOVE,
                                        move
                                    }
                                    socket.send(JSON.stringify(message))
                                    chess?.move(move)
                                    setBoard(chess?.board())
                                    setFrom(null)
                                }
                            }}
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-12 h-12 ${squareColorClass} flex items-center justify-center`}
                        >
                            {piece ? (
                                <span className={`font-bold ${piece.color === "w" ? "text-red-950" : "text-slate-950"}`}>
                                    {piece.square.toUpperCase()}
                                </span>
                            ) : null}
                        </div>
                    );
                })
            )}
        </div>
    )
}

const ChessLoading = () => {
    return (
        <div className="grid grid-cols-8 gap-0" style={{ width: "400px", height: "400px" }}>
            {Array(8)
                .fill(null)
                .map((_, rowIndex) =>
                    Array(8)
                        .fill(null)
                        .map((_, colIndex) => {
                            const isWhiteSquare = (rowIndex + colIndex) % 2 === 0;
                            const squareColorClass = isWhiteSquare ? "bg-white" : "bg-gray-700";

                            return (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`w-full h-full ${squareColorClass} animate-pulse`}
                                />
                            );
                        })
                )}
        </div>
    )
}

export default ChessBoard