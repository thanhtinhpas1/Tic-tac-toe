import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, withRouter } from 'react-router-dom'

// REDUCER & ACTION
import { move, moveStep, sort, me, botMove, playAgain } from "../actions";
import Board from "./Board";

// COMPONENT
import Header from '../components/views/Header'
import { Card, Button } from "react-bootstrap";
import MenuGame from "./MenuGame";

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playAgain: false
        }
    };

    handleClick(i) {
        const { history, stepNumber, yourTurn } = this.props.game;
        const cloneHistory = history.slice(0, stepNumber + 1);
        const current = cloneHistory[cloneHistory.length - 1];
        const squares = current.squares.slice();

        if (!squares[i] && yourTurn) {
            this.props.move(i);
            this.props.botMove()
        }
    }

    botMove() {
        this.props.botMove()
    }

    jumpTo(step) {
        this.props.moveStep(step);
    }

    sort() {
        this.props.sort();
    }

    playAgain() {
        this.props.playAgain();
        this.setState({
            playAgain: true
        })
    }

    render() {
        const {
            history, stepNumber, status, squaresWin, sortIncrease, isActive, isWin, yourTurn
        } = this.props.game;

        const { playAgain } = this.state
        if (playAgain) {
            if (playAgain) {
                // redirect to menu
                return <Router path="/menu">
                    <MenuGame />
                </Router>
            }
        }

        const current = history[stepNumber];
        let desc;
        let moves;


        var imgBanner = './banner.jpg'
        var title = "Your turn"
        var descript = ""
        if (isWin) {
            title = status
            imgBanner = "https://media.giphy.com/media/2gtoSIzdrSMFO/giphy.gif"
            if (yourTurn) {
                title = "You win"
                descript = "Congratule! Keep going ^^"
            }
            else {
                title = "You loose"
                descript = "Do not be discouraged!"
            }
        }

        if (!yourTurn) {
            title = "Wait for bot play!"
            imgBanner = "./loading.gif"
        }

        moves = history.map((step, move) => {
            desc = `Go to move #${move} Position:#`
            if (move % 2 === 1 && move > 0) {
                return (
                    <li key={step.position}>
                        <button
                            type="button"
                            className={isActive === move ? "active mt-3 btn btn-danger" : "mt-3 btn btn-primary"}
                            onClick={() => this.jumpTo(move)}
                        >
                            {desc} {step.position[move - 1]}
                        </button>
                    </li>
                );
            }
            return null
        });

        if (!sortIncrease) {
            moves = moves.reverse();
        }

        return (
            <div>
                <Header>
                </Header>
                <div className="game" style={{ marginTop: '10px' }}>
                    <div className="game-info col-3 text-center">
                        <div className="status">
                            <button className="btn btn-success" style={{width: '100%'}} type="button" onClick={() => this.sort()}>
                                Sort
                            </button>
                            <ol>{moves}</ol>
                        </div>
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
                                <Card.Title style={{ color: 'green' }}>{descript}</Card.Title>
                                <Button className="btn btn-danger mt-5" style={{ width: '100%' }} onClick={() => this.jumpTo(0)}>Play Again</Button>
                                <Button className="btn btn-primary mt-2" style={{ width: '100%' }} onClick={() => this.playAgain()}>Back to menu</Button>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        game: state.game,
        user: state.user,
    }
}

export default withRouter(connect(mapStateToProps, { move, moveStep, sort, botMove, me, playAgain })(Game));
