import React, { useState, useEffect } from 'react';
import { Container } from '@material-ui/core';
import './LaddersPage.css';
import { getLadders } from './api';
import Card from './components/Card';
import LadderTable from './components/LadderTable';

import { LaddersPageTitle, LaddersPageDescription } from './Constants';

function LadderPage() {
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
                    <Card className="Page-Header" title={LaddersPageTitle} body={LaddersPageDescription} />
                    <LadderTable ladders={ladders} />
                </Container>
            </header>
        </div>
    );
}

export default LadderPage;
