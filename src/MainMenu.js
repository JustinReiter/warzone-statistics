import React from 'react';
import logo from './logo.svg';
import { Button } from '@material-ui/core';
import './MainMenu.css';

function MainMenu() {
    return (
        <div className="header">
            <img src={logo} className="header-logo header-option" alt="Logo" />
            <Button>Home</Button>
        </div>
    );
}

export default MainMenu;