import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Container, Card, Form, Button } from 'react-bootstrap'
import Header from './views/Header'
import { me, updateProfile } from '../actions'
import { connect } from 'react-redux'

// IMPORT COOKIES
import Cookies from 'universal-cookie'
const cookies = new Cookies()

class UpdateProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    handleSubmit(e) {
        e.preventDefault()
        var user = {}
        user.name = e.currentTarget[0].value
        user.password = e.currentTarget[1].value
        user.email = e.currentTarget[2].value

        const { username } = this.props.user
        user.username = username
        this.props.updateProfile(user, cookies.get('token'))

    }

    render() {
        console.log(this.props)
        const { name, email } = this.props.user
        var token = cookies.get('token')
        if (email === '' && token) {
            this.props.me(token)
        }

        // check
        const { isUpdated } = this.props.game
        if (isUpdated) {
            alert("Update success!")
        }

        return (
            <Router>
                <Header store={this.props.user} />
                <Container>
                    <Card className="mt-5" style={{ width: '30rem', margin: 'auto' }}>
                        <Card.Header as="h3" className="text-center">
                            Update profile
                    </Card.Header>
                        <Card.Body>
                            <Form onSubmit={e => this.handleSubmit(e)}>
                                <Form.Group controlId="username">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control defaultValue={name} type="text" placeholder="*Name" required />
                                </Form.Group>
                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="*Password" required />
                                </Form.Group>
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control defaultValue={email} type="email" placeholder="*Email" required />
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
            </Router>
        )
    }
}

const mapStateToProps = state => {
    return {
        game: state.game,
        user: state.user
    }
}

export default connect(mapStateToProps, { updateProfile, me })(UpdateProfile)