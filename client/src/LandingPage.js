import React, { useState, useEffect } from 'react';
import { getLadders } from './api';
import logo from './logo.svg';
import { Container } from '@material-ui/core';
import './LandingPage.css';
import Card from './components/Card';
import LadderTable from './components/LadderTable';
import { LandingPageTitle, LandingPageDescription } from './Constants';

function LandingPage() {

    const [ ladders, setLadders ] = useState([]);

    useEffect(() => {
        getLadders().then((res) => {
            setLadders(res.data.ladders);
        });
    }, []);

    return (
        <div className="App">
            <Container maxWidth="md">
                <Card title={LandingPageTitle} body={LandingPageDescription} />
                <LadderTable ladders={ladders} />
            </Container>
        </div>
    );
}

export default LandingPage;
