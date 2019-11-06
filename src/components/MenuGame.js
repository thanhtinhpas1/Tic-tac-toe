import React, { Component } from 'react'
import Header from './views/Header'
import { Image } from 'react-bootstrap'

import { BrowserRouter as Router, withRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

// COMPONENT
import { applyMiddleware, createStore } from 'redux'
import { connect } from "react-redux";
import rootReducer from "../reducers";
import OnlineGame from './OnlineGame'
import BotGame from './BotGame'
import Cookies from 'universal-cookie'

import { me } from '../actions'

const cookies = new Cookies()
const io = require('socket.io-client')
const SOCKET_SERVER = "https://ttsocket.herokuapp.com"
const CLIENT_JOIN = "CLIENT_JOIN"
const CLIENT_WAIT = "CLIENT_WAIT"
var socket = undefined;

const store = createStore(rootReducer, applyMiddleware(thunk));

class MenuGame extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isShow: true,
            loading: false,
            connect: undefined,
            clientId: undefined,
            room: undefined,
            yourTurn: false,
            botMode: false
        }

        this.props.me(cookies.get('token'))
    }

    normalPlay() {
        io.set('*:*')
        socket = io.connect(SOCKET_SERVER)

        socket.on(CLIENT_JOIN, (rooms) => {
            // WAIT FOR PLAYER 
            console.log(CLIENT_JOIN + ": " + rooms)
            this.setState({
                isShow: false,
                loading: true,
                connect: socket,
                room: rooms[1],
                clientId: rooms[0]
            })
        })

        socket.on(CLIENT_WAIT, (rooms) => {
            // HAVE PLAYER JOIN
            console.log(CLIENT_WAIT + ": " + rooms)
            this.setState({
                isShow: false,
                loading: true,
                yourTurn: true
            })
        })
    }

    botPlay() {
        this.setState({
            botMode: true
        })
    }

    render() {

        const { isShow, loading, room, botMode } = this.state

        if (botMode) {
            // redirect to game with bot
            return <Router path="/bot">
                <Provider store={store}>
                    <BotGame />
                </Provider>
            </Router>
        }
        if (room) {
            // redirect to game online
            return <Router path="/online">
                <Provider store={store}>
                    <OnlineGame socket={this.state} />
                </Provider>
            </Router>
        }

        var options = isShow ? null : 'd-none'
        var load = loading ? null : 'd-none'
        return (
            <div style={{ margin: '0' }}>
                <Header />
                <div className="text-center mt-3">
                    <Image style={{ height: '450px', width: '550px' }} src="./banner.png">
                    </Image>
                    <div className={load}>
                        <h3 className="text-white mt-2">Waiting...</h3>
                        <img
                            alt=""
                            src="./loading.gif"
                            height="50px"
                        ></img>
                    </div>
                    <br></br>
                    <div className={options}>
                        <button onClick={() => this.botPlay()} style={{ width: '200px' }} className="btn btn-danger mt-3 mr-3 font-weight-bold pd-3" size="lg" >Play with bot</button>
                        <button onClick={() => this.normalPlay()} style={{ width: '200px' }} className="btn btn-primary mt-3 ml-3 font-weight-bold pd-3" size="lg" >Play normal</button>
                    </div>
                </div>
            </div >
        )
    }
}
const mapStateToProp = state => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProp, { me })(MenuGame))