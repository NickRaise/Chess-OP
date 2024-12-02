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

    const handleOnSelect = (squarePosition: Square) => {
        if (!from) {
            setFrom(squarePosition)
        }
        else {
            if (from == squarePosition) return setFrom(null)
            const move = {
                from,
                to: squarePosition
            }
            const message = {
                type: MOVE,
                move
            }
            socket.send(JSON.stringify(message))
            try {
                //checks if it is a valid move for the current user
                const tempChess = new Chess(chess?.fen())
                tempChess.move(move)
            } catch (e) {
                setFrom(null)
            }
            setBoard(chess?.board())
            setFrom(null)
        }
    }

    return (
        <div className="grid grid-cols-8 gap-0" style={{ width: "384px", height: "384px" }}>
            {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                    const isWhiteSquare = (rowIndex + colIndex) % 2 === 0;
                    const squareColorClass = isWhiteSquare ? "bg-[#E8EDF9]" : "bg-[#B7C0D8]";
                    const selectedColor = "bg-[#7B61FF]"
                    const squarePosition: Square = String.fromCharCode(97 + colIndex) + String(8 - rowIndex) as Square;
                    return (
                        <div
                            onClick={() => {
                                handleOnSelect(squarePosition)
                            }}
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-12 h-12  ${from === squarePosition ? selectedColor : squareColorClass} flex items-center justify-center`}
                        >
                            {piece ? (
                                <span className={`font-bold ${piece.color === "w" ? "text-red-950" : "text-slate-950"}`}>
                                    <img className="w-7 h-7" src={`/chess_pieces/${piece.color}-${piece.type}.svg`} alt="no pic" />
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
                            const squareColorClass = isWhiteSquare ? "bg-[#E8EDF9]" : "bg-[#B7C0D8]";

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