import React, { useState, useEffect } from 'react';
import { getLadders } from './api';
import logo from './logo.svg';
import { Container } from '@material-ui/core';
import './LandingPage.css';
import Card from './components/Card';
import LadderTable from './components/LadderTable';

function LandingPage() {

    const [ ladders, setLadders ] = useState([]);

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
            <Card title={"HI"} body={"Test"} />
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

export default LandingPage;
