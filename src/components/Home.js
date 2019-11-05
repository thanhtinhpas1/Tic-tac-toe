import React from 'react';
import Header from '../components/views/Header'
import { Image } from 'react-bootstrap'
import { Provider } from "react-redux";
import thunk from 'redux-thunk'
import { BrowserRouter as Router } from 'react-router-dom'
import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";
import { createLogger } from 'redux-logger'

// IMPORT COOKIE CHECK LOGIN
import Cookies from 'universal-cookie'
import Game from './Game';

const loggerMiddleware = createLogger()
const cookies = new Cookies()
const store = createStore(rootReducer, applyMiddleware(thunk, loggerMiddleware));

class Home extends React.Component {
    render() {
        if (cookies.get('token')) {
            return <Router exact path="/game">
                <Provider store={store}>
                    <Game />
                </Provider>
            </Router>
        }

        return (
            <Router>
                <div style={{ margin: '0' }}>
                    <Header />
                    <div className="text-center mt-5">
                        <Image src="./banner.jpg">
                        </Image>
                        <br></br>
                        <h3 className="text-white">Please login before play.</h3>
                        <a href="/login" className="btn btn-danger mt-3" variant="danger" size="lg" >Play now</a>
                    </div>
                </div>
            </Router>
        )
    }
}
export default Home;