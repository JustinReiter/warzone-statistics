import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import { Container } from '@material-ui/core';
import './LaddersPage.css';
import { getLadders } from './api';
import Card from './components/Card';
import LadderTable from './components/LadderTable';

import { LaddersPageTitle, LaddersPageDescription } from './Constants';

function LaddersPage() {
    let [ladders, setLadders] = useState([]);

    useEffect(() => {
        getLadders().then((res) => {
            setLadders(res.data.ladders);
            console.log(res.data);
        });
    }, []);

    return (
        <div className="App">
        
        <header className="App-header">
        <Container maxWidth="sm">
                <Card title={LaddersPageTitle} body={LaddersPageDescription} />
                <LadderTable ladders={ladders} />
        </Container>

            <img src={logo} className="App-logo" alt="logo" />
            <p>
            Edit <code>src/App.js</code> and save to reload test.
            </p>
            <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            >
            Learn React
            </a>
        </header>
        </div>
    );
}

export default LaddersPage;
