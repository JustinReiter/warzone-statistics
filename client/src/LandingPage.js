import React, { useState, useEffect } from 'react';
import { getLadders } from './api';
import { Container, Grid } from '@material-ui/core';
import './LandingPage.css';
import Card from './components/Card';
import LadderTable from './components/LadderTable';
import LaddersCard from './components/LaddersCard';
import { LandingPageTitle, LandingPageDescription } from './Constants';

function LandingPage() {

    const [ ladders, setLadders ] = useState([]);
    const [ stats, setStats ] = useState({});

    useEffect(() => {
        getLadders().then((res) => {
            setLadders(res.data.ladders);
            setStats(res.data.stats);
        });
    }, []);

    return (
        <div className="App">
            <Container maxWidth="lg">
                <Card title={LandingPageTitle} body={LandingPageDescription} />
                <LaddersCard stats={stats || {}} />
                <LadderTable ladders={ladders} />
            </Container>
        </div>
    );
}

export default LandingPage;
