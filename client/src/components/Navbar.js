import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

import LandingPage from '../LandingPage';
import LadderPage from '../LadderPage';
import LaddersPage from '../LaddersPage';
import ContactPage from '../ContactPage';
import PlayersPage from '../PlayersPage';
import PlayerPage from '../PlayerPage';
import './Navbar.css';

function NavbarComponent() {
    return (
        <Router>
            <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
                <Navbar.Brand as={Link} to="/">Warzone Statistics</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/ladders">Ladders</Nav.Link>
                        <Nav.Link as={Link} to="/players">Players</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Switch>
                <Route exact path="/">
                    <LandingPage />
                </Route>
                <Route path="/ladders">
                    <LaddersPage />
                </Route>
                <Route path="/ladder">
                    <LadderPage />
                </Route>
                <Route path="/players">
                    <PlayersPage />
                </Route>
                <Route path="/player">
                    <PlayerPage />
                </Route>
                <Route path="/contact">
                    <ContactPage />
                </Route>
            </Switch>
        </Router>
    );
}

export default NavbarComponent;