import { Dispatch, MutableRefObject, SetStateAction, useState } from "react";
import { boardType, MOVE, gameStatus } from "../types"
import { Chess, Color, Square } from "chess.js";

interface ChessBoardType {
    board: boardType | undefined,
    socket: WebSocket,
    chess: Chess | undefined,
    setBoard: Dispatch<SetStateAction<boardType | undefined>>,
    currentUserPieceColor: MutableRefObject<"b" | "w" | null>,
    gameStatus: gameStatus
}

const ChessBoard = ({ board, socket, chess, setBoard, currentUserPieceColor, gameStatus }: ChessBoardType) => {

    const [from, setFrom] = useState<null | Square>()
    if (!board) {
        return <ChessLoading />;
    }

    const handleOnSelect = (squarePosition: Square, selectedPieceColor: undefined | Color) => {

        if (gameStatus.gameOver == true) return

        // if the turn is not the users, exit from the function
        if (chess?.turn() !== currentUserPieceColor.current) return

        if (!from) {
            // if the selected square is not valid exit
            if (selectedPieceColor !== currentUserPieceColor.current) return
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
            try {
                //checks if it is a valid move for the current user
                const tempChess = new Chess(chess?.fen())
                tempChess.move(move)
                socket.send(JSON.stringify(message))
            } catch (e) {
                setFrom(null)
            }
            console.log("setting user turn to FALSE inside Board")
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
                    const loserKing: boolean = gameStatus.gameOver === true &&
                        piece?.type === 'k' &&
                        (piece.color === 'w' ? 'white' : 'black') !== gameStatus.winner;
                    console.log("Lossers king", loserKing)
                    return (
                        <div
                            onClick={() => {
                                handleOnSelect(squarePosition, piece?.color)
                            }}
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-12 h-12 ${from === squarePosition ? selectedColor : squareColorClass} ${loserKing && "bg-red-400"} flex items-center justify-center`}
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