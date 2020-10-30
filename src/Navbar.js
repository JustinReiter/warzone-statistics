import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

import LandingPage from './LandingPage';
import ContactPage from './ContactPage';
import './Navbar.css';

function NavbarComponent() {
    return (
        <Router>
            <div className="header">
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand as={Link} to="/">Warzone Statistics</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/Ladders">Ladders</Nav.Link>
                            <Nav.Link as={Link} to="/Players">Players</Nav.Link>
                            <Nav.Link as={Link} to="/Contact">Contact</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Switch>
                    <Route exact path="/">
                        <LandingPage />
                    </Route>
                    <Route path="/Ladders">
                        <LandingPage />
                    </Route>
                    <Route path="/Players">
                        <LandingPage />
                    </Route>
                    <Route path="/Contact">
                        <ContactPage />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default NavbarComponent;