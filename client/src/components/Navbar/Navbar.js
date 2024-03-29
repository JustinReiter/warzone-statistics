import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

import LandingPage from '../../pages/LandingPage/LandingPage';
import LadderPage from '../../pages/LadderPage/LadderPage';
import LaddersPage from '../../pages/LaddersPage/LaddersPage';
import ContactPage from '../../pages/ContactPage/ContactPage';
import PlayersPage from '../../pages/PlayersPage/PlayersPage';
import PlayerPage from '../../pages/PlayerPage/PlayerPage';
import TriviaPage from '../../pages/TriviaPage/TriviaPage';
import './Navbar.css';

function NavbarComponent() {
    return (
        <Router>
            <Navbar variant="dark" expand="lg" fixed="top" style={{backgroundColor: "rgb(44, 47, 49)"}}>
                <Navbar.Brand as={Link} to="/">Warzone Statistics</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/ladders">Seasonal</Nav.Link>
                        <Nav.Link as={Link} to="/players">Players</Nav.Link>
                        <Nav.Link as={Link} to="/trivia">Trivia</Nav.Link>
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
                <Route path="/trivia">
                    <TriviaPage />
                </Route>
                <Route path="/contact">
                    <ContactPage />
                </Route>
            </Switch>
        </Router>
    );
}

export default NavbarComponent;