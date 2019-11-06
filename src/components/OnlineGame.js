import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router } from 'react-router-dom'

// REDUCER & ACTION
import {
    clientPlay, initPlay, otherPlay, clientChat, playAgain, clientUndo, clientResUndo, clientAskPeace, clientResPeace,
    clientSurrender, CLIENT_PLAY, CLIENT_CHAT, CLIENT_UNDO, CLIENT_RES_UNDO, CLIENT_SURRENDER, CLIENT_ASK_PEACE, CLIENT_RES_PEACE
} from '../actions/socketAction'
import { me } from '../actions/index'
import Board from "./Board";

// COMPONENT
import Header from './views/Header'

import { Card, Button, Form } from "react-bootstrap";
import MenuGame from "./MenuGame";
import Cookies from "universal-cookie";
const cookies = new Cookies()

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playAgain: false,
            waitUndo: false,
            isPeace: false,
            waitPeace: false,
            acceptSurrender: false
        }

        this.props.me(cookies.get('token'))

        const { clientId, connect, yourTurn } = this.props.socket

        this.props.initPlay(clientId, connect, yourTurn)

        // LISTEN FOR OTHER PLAY
        connect.on(CLIENT_PLAY, position => {
            console.log("Other play at " + position)
            this.props.otherPlay(position)
        })

        // CLIENT CHAT WITH ME
        connect.on(CLIENT_CHAT, msg => {
            console.log("Other play chat with me: " + msg)
            this.props.clientChat(msg, true)
        })

        // CLIENT WANT UNDO
        connect.on(CLIENT_UNDO, () => {
            console.log("Other play want to undo")
            const { stepNumber } = this.props.onlineGame
            if (stepNumber > 0) this.props.clientUndo(true)
        })

        // CLIENT RES FOR REQUEST UNDO
        connect.on(CLIENT_RES_UNDO, (res) => {
            console.log("Other play response for request undo with: " + res)
            this.props.clientResUndo(res, true)
            this.setState({
                waitUndo: false
            })
        })

        // CLIENT ASK PEACE
        connect.on(CLIENT_ASK_PEACE, () => {
            console.log("Other play want to peace")
            this.props.clientAskPeace(true)
        })

        // CLIENT RES ASK PEACE
        connect.on(CLIENT_RES_PEACE, (res) => {
            console.log("Player response for ask peact")
            this.props.clientResPeace(res, true)
            this.setState({
                isAskPeace: false
            })
        })

        // CLIENT SURRENDER
        connect.on(CLIENT_SURRENDER, () => {
            this.props.clientSurrender(true)
        })
    };

    handleClick(i) {
        this.props.clientPlay(i)
        this.setState({
            waitPeace: false
        })
    }

    playAgain() {
        this.props.playAgain();
        this.setState({
            playAgain: true
        })
    }

    otherPlay(i) {
        this.props.clientPlay(i)
    }

    jumpTo(step) {
        this.props.moveStep(step);
    }

    chatSubmit(e) {
        e.preventDefault();
        var msg = e.currentTarget[0].value
        const { name } = this.props.user
        msg = name + ": " + msg
        this.props.clientChat(msg, false)
    }

    clientUndo() {
        this.props.clientUndo()
        this.setState({
            waitUndo: true
        })
    }

    undoResponse(res) {
        this.props.clientResUndo(res, false)
        this.setState({
            waitUndo: false
        })
    }

    clientSurrender() {
        this.props.clientSurrender(false)
        this.setState({
            acceptSurrender: true
        })
    }

    clientAskPeace() {
        console.log("Ask to peace")
        this.props.clientAskPeace(false)
        this.setState({
            waitPeace: true
        })
    }

    clietResAskPeace(res) {
        this.props.clientResPeace(res, false)

        if (res) this.setState({
            isPeace: true,
            waitPeace: false
        })
    }

    render() {
        const { history, stepNumber, status, squaresWin, isWin, yourTurn, messages, isUndo, isUndoRes,
            isAskPeace, isResAskPeace, isSurrender } = this.props.onlineGame
        const { playAgain, waitUndo, isPeace, waitPeace, acceptSurrender } = this.state
        if (playAgain) {
            // redirect to menu
            return <Router path="/menu">
                <MenuGame />
            </Router>
        }

        var imgBanner = './banner.jpg'
        var title = "Your turn"

        var showWin = isWin ? null : 'd-none'
        var titleWin = "You loose"
        var descWin = "Do not be discouraged! Start again >.<"

        if (isWin) {
            title = status
            imgBanner = "https://media.giphy.com/media/2gtoSIzdrSMFO/giphy.gif"
            if (yourTurn) {
                titleWin = "You win"
                descWin = "Congratule! Keep going ^^"
            }
        }

        // SET LOADING
        if (!yourTurn) {
            if (waitUndo) {
                title = "Waiting for replying..."
                imgBanner = './loading.gif'
            }
            else {
                imgBanner = './loading.gif'
                title = "Waiting for the other player turn"
            }
        }
        else {
            if (isUndoRes) {
                title = "Other play is accepted. Keep going"
            }
            else if (isUndoRes === false) {
                title = "Other play is rejected. But don't give up!"
                imgBanner = "./try.gif"
            }
        }
        // END SET LOADING

        // SETUP UNDO
        var titleUndo = "Undo"
        var desUndo = "Other player want undo. Do you agree?"
        var undoShow = isUndo ? null : "d-none"
        var ableUndo = yourTurn === false ? null : "d-none"
        ableUndo = waitUndo ? "d-none" : null

        const current = history[stepNumber];

        // setup chat messages
        var msg = messages.map((message, index) => {
            var chat = message.split(":")
            var name = chat[0]
            var msgg = chat[1]
            return <li key={index}>
                <b>{name}: </b>{msgg}
            </li>
        })

        var showAskPeace = isAskPeace ? null : "d-none"

        // SETUP ASK PEACE
        if (waitPeace) {
            title = "Waiting for other play reply!"
        }
        // END SETUP ASK PEACE

        // RESPONSE ASK PEACE
        if (isResAskPeace || isPeace) {
            titleWin = "PEACE!!!"
            descWin = "Other play accepted. Play other game!"
            showWin = null
        }
        else if (isResAskPeace === false && waitPeace) {
            title = "Other play rejected! Game continue!"
        }
        // END RESPONSE ASK PEACE

        // SET UP FOR SURRENDER
        if (acceptSurrender) {
            titleWin = "Don't be discourage!"
            descWin = "Keep going, you will be better!"
            showWin = null
        }

        if (isSurrender) {
            titleWin = "Other play accepted surrender!"
            descWin = "Play other game"
            showWin = null
        }

        // END SET UP FOR SURRENDER


        return (
            <div>
                <Header>
                </Header>
                <div style={{ marginTop: '10px' }}>
                    <Card className={showWin} style={{ position: 'fixed', top: '40%', left: '37%', zIndex: '999', width: '30%' }}>
                        <Card.Body className="text-center">
                            <Card.Title><h3 style={{ color: 'red' }}>{titleWin}</h3></Card.Title>
                            <Card.Text>
                                {descWin}
                            </Card.Text>
                            <Button onClick={() => this.playAgain()} className="btn btn-sucess" variant="primary">START AGAIN</Button>
                        </Card.Body>
                    </Card>

                    {/* CARD ASK PEACE */}
                    <Card className={showAskPeace} style={{ position: 'fixed', top: '40%', left: '37%', zIndex: '999', width: '30%' }}>
                        <Card.Body className="text-center">
                            <Card.Title><h3 style={{ color: 'red' }}>PEACE!</h3></Card.Title>
                            <Card.Text>
                                Player want to peace!
                            </Card.Text>
                            <Button onClick={() => this.clietResAskPeace(true)} className="btn btn-sucess mr-1" variant="success">ACCEPT</Button>
                            <Button onClick={() => this.clietResAskPeace(false)} className="btn btn-sucess mr-1" variant="danger">REJECT</Button>
                        </Card.Body>
                    </Card>

                    {/* CARD UNDO */}
                    <Card className={undoShow} style={{ position: 'fixed', top: '40%', left: '37%', zIndex: '999', width: '30%' }}>
                        <Card.Body className="text-center">
                            <Card.Title><h3 style={{ color: 'red' }}>{titleUndo}</h3></Card.Title>
                            <Card.Text>
                                {desUndo}
                            </Card.Text>
                            <Button onClick={() => this.undoResponse(true)} className="btn btn-sucess mr-1" variant="success">ACCEPT</Button>
                            <Button onClick={() => this.undoResponse(false)} className="btn btn-sucess mr-1" variant="danger">REJECT</Button>
                        </Card.Body>
                    </Card>

                    <div className="row">
                        <div className="col-3" style={{ margin: '0' }}>
                            <Card style={{ height: '100%' }}>
                                <Card.Img id="chatBanner" variant="top" src="./banner.png" />
                                <Card.Title className="text-center mt-2">
                                    <h3 id="chatTitle">Chat messenger</h3>
                                </Card.Title>
                                <hr />
                                <ul id="frmChat">
                                    {msg}
                                </ul>
                                <Card.Body>
                                    <div className="inputChat">
                                        <Form onSubmit={e => this.chatSubmit(e)}>
                                            <Form.Control id="inputText">
                                            </Form.Control>
                                            <Button id="inputIcon" type="sub" className="inputChat fas fa-paper-plane"></Button>
                                        </Form>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>

                        <div className="game text-center col-7" style={{ margin: '0' }}>
                            <div className="game-board" >
                                <Board
                                    squares={current.squares}
                                    squaresWin={squaresWin}
                                    onClick={i => this.handleClick(i)}
                                />
                            </div>
                        </div>

                        <div className="col-2 text-center" style={{ margin: '0' }}>
                            <Card style={{ height: '100%' }}>
                                <Card.Img variant="top" src={imgBanner} />
                                <Card.Body>
                                    <Card.Title style={{ color: 'red' }}>{title}</Card.Title>
                                    <Button onClick={() => this.clientUndo()} className={`mt-3 btn btn-success ` + ableUndo} style={{ width: '100%' }}>Undo</Button>
                                    <Button onClick={() => this.clientAskPeace()} className="mt-3 btn btn-warning" style={{ width: '100%' }}>Ask for peace</Button>
                                    <Button onClick={() => this.clientSurrender()} className="mt-3 btn btn-danger" style={{ width: '100%' }}>Surrender</Button>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        game: state.game,
        user: state.user,
        onlineGame: state.onlineGame
    }
}

export default connect(mapStateToProps, {
    playAgain, clientPlay, initPlay, otherPlay, clientChat, clientUndo, clientSurrender,
    clientResUndo, clientAskPeace, clientResPeace, me
})(Game);
