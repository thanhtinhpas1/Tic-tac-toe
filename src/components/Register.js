import React from 'react';
import { Card, Container, Form, Button } from 'react-bootstrap'
import { BrowserRouter as Router, withRouter } from 'react-router-dom'
import { Provider, connect } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk'

import { register } from '../actions'
import Header from '../components/views/Header'
import Login from './Login';
import rootReducer from "../reducers";

const store = createStore(rootReducer, applyMiddleware(thunk));

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    handleSubmit(e) {
        e.preventDefault()
        var user = {};
        user.username = e.currentTarget[0].value;
        user.name = e.currentTarget[1].value;
        user.password = e.currentTarget[2].value;
        user.email = e.currentTarget[3].value;

        this.props.register(user)
        this.props.history.push('/login')
    }

    render() {
        console.log(this.props)
        const { isRegistered } = this.props.user
        if (isRegistered) {
            return <Router path="/login">
                <Provider store={store}>
                    <Login />
                </Provider>
            </Router>
        }
        return (
            <div style={{ margin: '0' }}>
                <Header />
                <Container>
                    <Card className="mt-5" style={{ width: '30rem', margin: 'auto' }}>
                        <Card.Header as="h3" className="text-center">
                            Register
                    </Card.Header>
                        <Card.Body>
                            <Form onSubmit={e => this.handleSubmit(e)}>
                                <Form.Group controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" placeholder="*Username" required />
                                </Form.Group>
                                <Form.Group controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" placeholder="*Username" required />
                                </Form.Group>
                                <Form.Group controlId="name">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="*Name" required />
                                </Form.Group>
                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="*Password" required />
                                </Form.Group>
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="*Email" required />
                                </Form.Group>
                                <Form.Group className="text-center mt-5">
                                    <Button style={{ width: '60%' }} variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </div >

        )
    }
}

const mapStateToProps = state => {
    return {
        game: state.game,
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps, { register })(Register))