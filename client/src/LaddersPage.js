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
                <Container maxWidth="md">
                        <Card title={LaddersPageTitle} body={LaddersPageDescription} />
                        <LadderTable ladders={ladders} />
                </Container>
            </header>
        </div>
    );
}

export default LaddersPage;
