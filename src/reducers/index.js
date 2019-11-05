import { combineReducers } from 'redux'
import game from './Game'
import user from './User'
import onlineGame from './OnlineGame'

const reducer = combineReducers({
    game,
    user,
    onlineGame
})

export default reducer;