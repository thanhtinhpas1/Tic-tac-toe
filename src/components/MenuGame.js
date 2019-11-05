import React, { Component } from 'react'
import Header from './views/Header'
import { Image, Card, Button } from 'react-bootstrap'

import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

// COMPONENT
import { createStore, applyMiddleware } from "redux";

import rootReducer from "../reducers/";
import OnlineGame from './OnlineGame'

const io = require('socket.io-client')
const SOCKET_SERVER = "http://localhost:8080"
const CLIENT_JOIN = "CLIENT_JOIN"
const CLIENT_LEAVE = "CLIENT_LEAVE"
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
            yourTurn: false
        }
    }

    normalPlay() {
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
            isShow: false,
            loading: true
        })
    }

    render() {
        console.log(this.props)

        const { isShow, loading, room } = this.state

        if (room) {
            // redirect to game online
            return <Router>
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
                    <Image style={{height: '450px', width: '550px'}} src="./banner.png">
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

export default MenuGame;