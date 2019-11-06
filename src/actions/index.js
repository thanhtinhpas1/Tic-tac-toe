import { PLAY_AGAIN } from "./socketAction"

export const LOGIN = "LOGIN"
export const REGISTER = "REGISTER"
export const ME = "ME"
export const UPDATE = "UPDATE"
export const LOGOUT = "LOGOUT"
export const MOVE = "MOVE"
export const MOVE_STEP = "MOVE_STEP"
export const SORT = "SORT"
export const BOT_MOVE = "BOT_MOVE"

// const HOST = "http://localhost:3001"
const HOST = "http://ptudwnc06.herokuapp.com"

export const move = (i) => ({
    type: MOVE,
    payload: {
        i
    }
});

export const botMove = () => ({
    type: BOT_MOVE,
    payload: {

    }
})

export const moveStep = (step) => ({
    type: MOVE_STEP,
    payload: {
        step
    }
});

export const sort = () => ({
    type: SORT
})

async function callLogin(username, password) {
    var res = await fetch(HOST + '/user/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    return res.json()
}

const callLoginRes = (data) => {
    return {
        type: LOGIN,
        payload: data
    }
}

export const login = (username, password) => {
    return (dispatch) => {
        return callLogin(username, password).then(res => {
            dispatch(callLoginRes(res))
        })
    }
}

async function callMe(token) {
    console.log('================> ' + token)
    const callMe = await fetch(HOST + '/me', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    return callMe.json()
}

const callMeRes = (res) => {
    return {
        type: ME,
        payload: res
    }
}

export const me = (token) => {
    return (dispatch => {
        return callMe(token).then(res => {
            dispatch(callMeRes(res))
        })
    })
}

async function callRegister(user) {
    const callRegister = await fetch(HOST + '/user/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    return callRegister.json()
}

function callRegisterRes(res) {
    return {
        type: REGISTER,
        payload: res
    }
}

export const register = (user) => {
    return (dispatch => {
        return callRegister(user).then(res => {
            dispatch(callRegisterRes(res))
        })
    })
}

async function callUpdate(user, token) {
    const callUpdate = await fetch(HOST + '/user/update-profile', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(user)
    })
    return callUpdate.json()
}

const callUpdateRes = res => {

    return {
        type: UPDATE,
        payload: res
    }
}

export const updateProfile = (user, token) => {
    return (dispatch => {
        return callUpdate(user, token).then(res => {
            dispatch(callUpdateRes(res))
        })
    })
}

export const playAgain = () => ({
    type: PLAY_AGAIN
})