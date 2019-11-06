import React from 'react';
import { connect, Provider } from 'react-redux'
import { createStore, applyMiddleware } from "redux";
import { Card, Container, Form, Button, FormText } from 'react-bootstrap'
import { BrowserRouter as Router, withRouter } from 'react-router-dom'
import thunk from 'redux-thunk'

// REDUCER & ACTION
import { login, me } from "../actions/";
import rootReducer from "../reducers";

// LOGIN FACEBOOK & GOOGLE
import FacebookLogin from 'react-facebook-login'
import GoogleLogin from 'react-google-login'

// COMPONENT
import Header from '../components/views/Header'
import MenuGame from "../components/MenuGame";
import Cookies from 'universal-cookie';

const cookies = new Cookies()
const store = createStore(rootReducer, applyMiddleware(thunk));

// FACEBOOK & GOOGLE 
const appId = "2266181740128243"
// const appSecret = "f7775684d7ef1c2c9c1d59208b2d5760"
const ggAppId = "765752489833-jmk0drmof9m2r6ikomq22kc8hq50ve8b.apps.googleusercontent.com"
// const ggAppSecret = "LrYoLj6uy1OSFhKNToMTpalq"


class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    handleSubmit(e) {
        e.preventDefault();

        let username = e.currentTarget[0].value;
        let password = e.currentTarget[1].value;
        this.props.login(username, password)
        this.props.history.push('/game')
    }

    render() {

        const { isAuth, error } = this.props.user;

        if (isAuth || cookies.get('token') !== undefined) {
            return <Router path="/game">
                <Provider store={store}>
                    <MenuGame />
                </Provider>
            </Router>
        }

        // LOGIN FACEBOOK & GOOGLE RESPONSE
        const responseFacebook = (response) => {
            console.log(response)
            this.setState({
                ...response,
                username: response.name,
                isAuth: true
            })
        }

        const responseGoogle = (response) => {
            console.log(response)
            if (response) {
                cookies.set('token', response.accessToken)
                cookies.set('name', response.w3.ig)
                cookies.set('avatar', response.w3.Paa)
                this.setState({
                    isAuth: true
                })
            }
        }

        return (
            <Router>
                <Header />
                <Container>
                    <Card className="mt-5" style={{ width: '30rem', margin: 'auto' }}>
                        <Card.Header className="text-center" as="h3">
                            LOGIN
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={e => this.handleSubmit(e)}>
                                <FormText style={{ fontSize: '18px', color: 'red', marginBottom: '5px' }}>{error}</FormText>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control name="username" type="text" placeholder="*Username" required />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control name="password" type="password" placeholder="*Password" required />
                                </Form.Group>
                                <Form.Group controlId="btnSubmit" className="text-center">
                                    <Button style={{ width: '60%' }} size="lg" variant="primary" type="submit">
                                        SUBMIT
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                        <Card.Footer>
                            <div className="text-center">
                                <FacebookLogin
                                    buttonStyle={{
                                        marginRight: '10px',
                                        padding: '10px', width: '173px', height: '43px', fontSize: '12px', borderRadius: '2px',
                                        boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.24)'
                                    }}
                                    size="small"
                                    appId={appId}
                                    fields="name"
                                    callback={responseFacebook}
                                ></FacebookLogin>
                                <GoogleLogin
                                    style={{ marginLeft: '10px' }}
                                    clientId={ggAppId}
                                    buttonText="Login with Google"
                                    onSuccess={responseGoogle}
                                    onFailure={responseGoogle}
                                >
                                </GoogleLogin>
                            </div>
                            <Card.Text className="mt-3">
                                Do you have any account? Please
                            <a href="/register"> register.</a>
                            </Card.Text>
                        </Card.Footer>
                    </Card>
                </Container >
            </Router >
        )
    }
}

const mapStateToProps = state => {
    return {
        game: state.game,
        user: state.user
    };
}

export default withRouter(connect(mapStateToProps, { login, me })(Login))