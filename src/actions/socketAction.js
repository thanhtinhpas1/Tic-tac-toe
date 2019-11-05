export const CLIENT_PLAY = "CLIENT_PLAY"
export const CLIENT_CHAT = "CLIENT_CHAT"
export const CLIENT_UNDO = "CLIENT_UNDO"
export const CLIENT_RES_UNDO = "CLIENT_RES_UNDO"
export const CLIENT_SURRENDER = "CLIENT_SURRENDER"
export const CLIENT_ASK_PEACE = "CLIENT_ASK_PEACE"
export const CLIENT_RES_PEACE = "CLIENT_RES_PEACE"
export const CLIENT_INIT_PLAY = "CLIENT_INIT_PLAY"
export const CLIENT_OTHER_PLAY = "CLIENT_OTHER_PLAY"
export const PLAY_AGAIN = "PLAY_AGAIN"

export const clientPlay = (position) => ({
    type: CLIENT_PLAY,
    payload: {
        position
    }
})

export const otherPlay = (position) => ({
    type: CLIENT_OTHER_PLAY,
    payload: {
        position
    }
})

export const initPlay = (clientId, connect, yourTurn) => ({
    type: CLIENT_INIT_PLAY,
    payload: {
        clientId, connect, yourTurn
    }
})

export const clientChat = (msg, isRes) => ({
    type: CLIENT_CHAT,
    payload: {
        message: msg,
        isRes
    }
})

export const playAgain = () => {
    return {
        type: PLAY_AGAIN
    }
};

export const clientUndo = (type) => {
    return {
        type: CLIENT_UNDO,
        payload: {
            type
        }
    }
}

export const clientResUndo = (res, typeRes) => ({
    type: CLIENT_RES_UNDO,
    payload: {
        res, typeRes
    }
})

export const clientAskPeace = (type) => ({
    type: CLIENT_ASK_PEACE,
    payload: {
        type
    }
})

export const clientResPeace = (res, typeRes) => ({
    type: CLIENT_RES_PEACE,
    payload: {
        res, typeRes
    }
})

export const clientSurrender = (type) => ({
    type: CLIENT_SURRENDER,
    payload: {
        type
    }
})