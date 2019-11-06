import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import thunk from 'redux-thunk'

// GAME
import './Game.css'
import './index.css'
import rootReducer from "./reducers";

// COMPONENT
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import UpdateProfile from "./components/UpdateProfile";
import { createLogger } from 'redux-logger'

const loggerMiddleware = createLogger()

const store = createStore(rootReducer, applyMiddleware(thunk, loggerMiddleware));
const rootElement = document.getElementById("root");

ReactDOM.render(
    <Router>
        <Switch>
            <Router exact path="/login">
                <Provider store={store}>
                    <Login />
                </Provider>
            </Router>
            <Router exact path="/profile">
                <Provider store={store}>
                    <UpdateProfile />
                </Provider>
            </Router>
            <Router exact path="/register">
                <Provider store={store}>
                    <Register />
                </Provider>
            </Router>
            <Router path="/">
                <Provider store={store}>
                    <Home />
                </Provider>
            </Router>
        </Switch>
    </Router>
    , rootElement
);
