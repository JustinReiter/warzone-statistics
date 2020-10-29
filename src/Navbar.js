import React from 'react';
import logo from './logo.svg';
import { Button } from '@material-ui/core';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

import LandingPage from './LandingPage';
import ContactPage from './ContactPage';
import './Navbar.css';

function Navbar() {
    return (
        <Router>
            <div className="header">
                <Button component={Link} to="/"><img src={logo} className="header-logo header-option" alt="Logo" /></Button>
                <Button component={Link} to="/">Home</Button>
                <Button component={Link} to="/Ladders">Ladders</Button>
                <Button component={Link} to="/Contact">Contact</Button>

                <Switch>
                    <Route exact path="/">
                        <LandingPage />
                    </Route>
                    <Route path="/ladders">
                        <LandingPage />
                    </Route>
                    <Route path="/contact">
                        <ContactPage />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default Navbar;