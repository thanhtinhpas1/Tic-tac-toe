import { CLIENT_PLAY, CLIENT_INIT_PLAY, CLIENT_OTHER_PLAY, CLIENT_CHAT, PLAY_AGAIN, CLIENT_UNDO, CLIENT_RES_UNDO, CLIENT_ASK_PEACE, CLIENT_RES_PEACE, CLIENT_SURRENDER } from "../actions/socketAction";
import calculateWinner from "../utils/WinnerUtils";

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
    yourTurn: false,
    messages: [],
    wantUndo: false,
    isUndo: false,
    isUndoRes: undefined,
    isAskPeace: false,
    isResAskPeace: undefined,
    isSurrender: false
};


export default function (state = initialState, action) {
    switch (action.type) {
        case CLIENT_INIT_PLAY: {
            return {
                ...state,
                ...action.payload
            }
        }

        case CLIENT_SURRENDER: {
            const { type } = action.payload
            const { connect, clientId } = state
            if (!type) {
                connect.emit(CLIENT_SURRENDER, clientId)
                return {
                    ...state,
                    isSurrender: false
                }
            }
            return {
                ...state,
                isSurrender: true
            }
        }

        case CLIENT_ASK_PEACE: {
            const { clientId, connect } = state
            const { type } = action.payload
            if (!type) {
                connect.emit(CLIENT_ASK_PEACE, clientId)

                return {
                    ...state
                }
            }
            else {
                return {
                    ...state,
                    isAskPeace: true
                }
            }
        }

        case CLIENT_RES_PEACE: {
            const { clientId, connect } = state
            const { res, typeRes } = action.payload
            if (!typeRes) {
                connect.emit(CLIENT_RES_PEACE, clientId, res)
                return {
                    ...state,
                    isAskPeace: false,
                    isResAskPeace: undefined
                }
            }
            else {
                if (res) { // accepted
                    return {
                        ...state,
                        isResAskPeace: true,
                        isAskPeace: false
                    }
                }
                else {
                    return {
                        ...state,
                        isResAskPeace: false
                    }
                }
            }
        }

        case CLIENT_UNDO: {
            const { clientId, connect } = state
            const { type } = action.payload
            if (!type) {
                connect.emit(CLIENT_UNDO, clientId)
                return {
                    ...state
                }
            }
            else {
                return {
                    ...state,
                    isUndo: true
                }
            }
        }
        case CLIENT_RES_UNDO: {
            const { clientId, connect } = state
            const { res, typeRes } = action.payload
            if (!typeRes) {
                connect.emit(CLIENT_RES_UNDO, clientId, res)
                if (res) { // accept
                    return {
                        ...undo(state, action),
                        isUndo: false
                    }
                }
                else { // reject
                    return {
                        ...state,
                        isUndo: false
                    }
                }
            }

            // RECEIVE RESPONSE
            if (res) {
                return {
                    ...undo(state, action),
                    isUndoRes: true
                }
            }
            else {
                return {
                    ...state,
                    isUndoRes: false
                }
            }

        }

        case CLIENT_OTHER_PLAY: {
            const { history, isWin, xIsNext, stepNumber, yourTurn } = state;
            const { position } = action.payload
            const cloneHistory = history.slice(0, stepNumber + 1);
            const current = cloneHistory[cloneHistory.length - 1];
            const squares = current.squares.slice();
            const positions = current.position.slice();

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

        case PLAY_AGAIN: {
            return initialState
        }

        case CLIENT_PLAY: {
            const { history, isWin, xIsNext, stepNumber, yourTurn, clientId, connect } = state;
            const { position } = action.payload
            const cloneHistory = history.slice(0, stepNumber + 1);
            const current = cloneHistory[cloneHistory.length - 1];
            const squares = current.squares.slice();
            const positions = current.position.slice();

            if (!squares[position] && !isWin && yourTurn) {
                connect.emit(CLIENT_PLAY, clientId, position)

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

        case CLIENT_CHAT: {
            const { message, isRes } = action.payload
            const { clientId, connect, messages } = state
            var msg = messages.slice()
            msg.push(message)

            // send to other player
            if (isRes === false) connect.emit(CLIENT_CHAT, clientId, message)
            console.log(isRes)

            return {
                ...state,
                messages: msg
            }
        }

        // case MOVE_STEP: {
        //     const step = action.payload;
        //     const { history, xIsNext } = state;
        //     const cloneHistory = history.slice(0, history.length);
        //     const current = cloneHistory[step];
        //     const squares = current.squares.slice();
        //     const winner = calculateWinner(squares);
        //     if (winner) {
        //         return {
        //             ...state,
        //             stepNumber: step,
        //             xIsNext: step % 2 === 0,
        //             status: `Winner: ${squares[winner[0]]}`,
        //             isWin: true,
        //             squaresWin: winner,
        //             isActive: step
        //         };
        //     }
        //     // active: step
        //     return {
        //         ...state,
        //         stepNumber: step,
        //         xIsNext: step % 2 === 0,
        //         status: `Next player: ${xIsNext ? "X" : "O"}`,
        //         isWin: false,
        //         squaresWin: [],
        //         isActive: step
        //     };
        // }

        // case SORT: {
        //     return {
        //         ...state,
        //         xIsNext: state.step % 2 === 0,
        //         history: state.history,
        //         isWin: false,
        //         squaresWin: [],
        //         isActive: state.isActive,
        //         sortIncrease: !state.sortIncrease
        //     };
        // }

        default: {
            return state;
        }
    }
}

function undo(state, action) {
    const { stepNumber, history, xIsNext, yourTurn } = state;
    var step = stepNumber === 0 ? 0 : stepNumber - 1
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
            isActive: step
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
        yourTurn: !yourTurn
    };
}