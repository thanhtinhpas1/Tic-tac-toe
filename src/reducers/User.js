import { LOGIN, ME, UPDATE, REGISTER } from "../actions";
import Cookies from 'universal-cookie'
const cookies = new Cookies()

const initialState = {
    username: '',
    password: '',
    email: '',
    isAuth: false,
    token: '',
    error: '',
    isUpdated: false,
    isRegistered: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN: {
            var res = action.payload;
            if (res.code === 200) {
                cookies.set('token', res.token)
                return {
                    ...state,
                    token: res.token,
                    isAuth: true
                }
            }
            else {
                return {
                    ...res.message,
                    isAuth: false
                }
            }
        }

        case REGISTER: {
            var regis = action.payload
            if (regis.code === 200) {
                return {
                    ...state,
                    isRegistered: true
                }
            }
            else return state
        }

        case ME: {
            var me = action.payload
            if (me.code === 200) {
                return {
                    ...state,
                    ...me.message,
                    isAuth: true
                }
            }
            else return state
        }

        case UPDATE: {
            let res = action.payload
            console.log(res)
            if (res.code === 200) {
                return {
                    ...state,
                    isUpdated: true
                }
            }
            else {
                return state
            }
        }
        default:
            return state
    }
}