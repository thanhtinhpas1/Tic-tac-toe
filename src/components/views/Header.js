
import React, { Component } from 'react'
import { Navbar, NavDropdown, Image } from 'react-bootstrap'
import Cookies from 'universal-cookie'
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
        var userInfo;
        if (this.props.store) {
            const { name, avatar } = this.props.store
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

export default Header;