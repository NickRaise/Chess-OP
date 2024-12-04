import { Square, PieceSymbol, Color } from "chess.js";

export type boardType = ({ square: Square; type: PieceSymbol; color: Color; } | null)[][];
export const INIT_GAME = "init_game"
export const MOVE = "move"
export const GAME_OVER = "game_over"
