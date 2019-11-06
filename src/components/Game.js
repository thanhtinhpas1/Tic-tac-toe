import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

// REDUCER & ACTION
import { move, moveStep, sort, me, login } from "../actions";
import rootReducer from "../reducers";
import { createStore, applyMiddleware } from "redux";
import Board from "./Board";

// COMPONENT
import Header from '../components/views/Header'
import Login from "./Login";

import Cookies from 'universal-cookie'
const cookies = new Cookies()

const store = createStore(rootReducer, applyMiddleware(thunk));

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    };

    handleClick(i) {
        this.props.move(i);
    }

    jumpTo(step) {
        this.props.moveStep(step);
    }

    sort() {
        this.props.sort();
    }

    render() {
        const { username } = this.props.user
        if (!username) {
            var mtoken = cookies.get('token')
            if (mtoken) this.props.me(mtoken)
            else {
                return <Router>
                    <Provider store={store}>
                        <Router path='/login'>
                            <Login />
                        </Router>
                    </Provider>
                </Router>
            }
        }

        const {
            history,
            stepNumber,
            status,
            squaresWin,
            sortIncrease,
            isActive
        } = this.props.game;

        const current = history[stepNumber];
        let desc;
        let moves;

        moves = history.map((step, move) => {
            desc = move ? `Go to move #${move} Position:#` : "Go to game start";
            return (
                <li key={step.position}>
                    <button
                        type="button"
                        style={{ width: '80%' }}
                        className={isActive === move ? "active mt-3 btn btn-danger" : "mt-3 btn btn-primary"}
                        onClick={() => this.jumpTo(move)}
                    >
                        {desc} {step.position[move - 1]}
                    </button>
                </li>
            );
        });

        if (!sortIncrease) {
            moves = moves.reverse();
        }

        return (
            <div>
                <Header store={this.props.user}>
                </Header>
                <div className="game" style={{ marginTop: '10px' }}>
                    <div className="game-info">
                        <div className="status">
                            {status}
                            <div className="step">
                                <button className="btn btn-primary" type="button" onClick={() => this.sort()}>
                                    Sort
                                </button>
                            </div>
                        </div>
                        <ol>{moves}</ol>
                    </div>
                    <div className="game-board">
                        <Board
                            squares={current.squares}
                            squaresWin={squaresWin}
                            onClick={i => this.handleClick(i)}
                        />
                    </div>
                </div>
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        game: state.game,
        user: state.user
    }
}

export default connect(mapStateToProps, { move, moveStep, sort, me, login })(Game);
