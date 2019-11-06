
import React, { Component } from 'react'
import { Navbar, NavDropdown, Image } from 'react-bootstrap'
import Cookies from 'universal-cookie'
import { connect } from 'react-redux'
import { me } from '../../actions/index'

const cookies = new Cookies()

class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    logout() {
        cookies.remove('token')
    }

    render() {
        var token = cookies.get('token')
        var name = cookies.get('name')
        var avatar = cookies.get('avatar')
        if (avatar === undefined) {
            avatar = './banner.png'
        }
        var userInfo = undefined
        if (token) {
            userInfo = (
                <div id="brand">
                    <Image id="avatar" src={avatar} />
                    <NavDropdown id="nav-dropdown" title={name} className="float-right mr-5">
                        <NavDropdown.Item href="/profile">Update profile</NavDropdown.Item>
                        <NavDropdown.Item onClick={e => this.logout()} href="/login">Logout</NavDropdown.Item>
                    </NavDropdown>
                </div>
            )
        }
        else {
            userInfo = (
                <></>
            )
        }


        return (
            <>
                <Navbar bg="dark" variant="dark" style={{ display: 'block' }}>
                    <Navbar.Brand href="/">
                        <img
                            alt=""
                            src="./favicon.ico"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />
                        &nbsp;Tic Tac Toe
                </Navbar.Brand>
                    {userInfo}
                </Navbar>

            </>
        );
    }
}

const mapStateToProp = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProp, { me })(Header);