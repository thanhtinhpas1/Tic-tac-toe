import calculateWinner from "../utils/WinnerUtils";
import { MOVE, MOVE_STEP, SORT, BOT_MOVE } from "../actions";
import {PLAY_AGAIN} from '../actions/socketAction'

export const initialState = {
    history: [
        {
            squares: Array(400).fill(null),
            position: []
        }
    ],
    isIncrease: true,
    xIsNext: true,
    status: "Next player: X",
    isWin: false,
    stepNumber: 0,
    squaresWin: [],
    isActive: -1,
    sortIncrease: true,
    yourTurn: true,
    isFull: false
};

export default function (state = initialState, action) {
    switch (action.type) {

        case BOT_MOVE: {
            const { history, isWin, xIsNext, stepNumber, yourTurn } = state;
            const cloneHistory = history.slice(0, stepNumber + 1);
            const current = cloneHistory[cloneHistory.length - 1];
            const squares = current.squares.slice();
            const positions = current.position.slice();
            var position = getPosition(squares)
            if (!squares[position] && !isWin) {
                squares[position] = xIsNext ? "X" : "O";
                const winner = calculateWinner(squares);
                if (winner) {
                    return {
                        ...state,
                        history: cloneHistory.concat([
                            {
                                squares,
                                position: positions.concat(String(position))
                            }
                        ]),
                        status: `Winner: ${squares[winner[0]]}`,
                        isWin: true,
                        squaresWin: winner,
                        stepNumber: cloneHistory.length
                    };
                }

                return {
                    ...state,
                    history: cloneHistory.concat([
                        {
                            squares,
                            position: positions.concat(String(position))
                        }
                    ]),
                    xIsNext: !xIsNext,
                    stepNumber: cloneHistory.length,
                    yourTurn: !yourTurn
                };
            }
            else {
                return state;
            }
        }

        case MOVE: {
            const { i } = action.payload;
            const { history, isWin, xIsNext, stepNumber, yourTurn } = state;
            const cloneHistory = history.slice(0, stepNumber + 1);
            const current = cloneHistory[cloneHistory.length - 1];
            const squares = current.squares.slice();
            const positions = current.position.slice();

            if (!squares[i] && !isWin && yourTurn) {
                squares[i] = xIsNext ? "X" : "O";
                const winner = calculateWinner(squares);
                if (winner) {
                    return {
                        ...state,
                        history: cloneHistory.concat([
                            {
                                squares,
                                position: positions.concat(String(i))
                            }
                        ]),
                        status: `Winner: ${squares[winner[0]]}`,
                        isWin: true,
                        squaresWin: winner,
                        stepNumber: cloneHistory.length
                    };
                }

                return {
                    ...state,
                    history: cloneHistory.concat([
                        {
                            squares,
                            position: positions.concat(String(i))
                        }
                    ]),
                    xIsNext: !xIsNext,
                    stepNumber: cloneHistory.length,
                    yourTurn: !yourTurn
                };
            }
            else {
                return state;
            }
        }

        case MOVE_STEP: {
            const { step } = action.payload;
            const { history, xIsNext } = state;
            const cloneHistory = history.slice(0, history.length);
            const current = cloneHistory[step];
            const squares = current.squares.slice();
            const winner = calculateWinner(squares);
            if (winner) {
                return {
                    ...state,
                    stepNumber: step,
                    xIsNext: step % 2 === 0,
                    status: `Winner: ${squares[winner[0]]}`,
                    isWin: true,
                    squaresWin: winner,
                    isActive: step,
                    yourTurn: true
                };
            }
            // active: step
            return {
                ...state,
                stepNumber: step,
                xIsNext: step % 2 === 0,
                status: `Next player: ${xIsNext ? "X" : "O"}`,
                isWin: false,
                squaresWin: [],
                isActive: step,
                yourTurn: true
            };
        }

        case SORT: {
            return {
                ...state,
                xIsNext: state.step % 2 === 0,
                history: state.history,
                isWin: false,
                squaresWin: [],
                isActive: state.isActive,
                sortIncrease: !state.sortIncrease
            };
        }

        case PLAY_AGAIN: {
            return initialState
        }

        default: {
            return state;
        }
    }
}

function getPosition(board) {
    var random = Math.floor(Math.random() * Math.floor(399));
    console.log(random)
    var start = random;
    while (board[random] === 'O' || board[random] === 'X') {
        random = (random + 1) % 400
        if (random === start) {
            return -1
        }
    }

    return random
}