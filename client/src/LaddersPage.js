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
        });
    }, []);

    return (
        <div className="ladders-page">
            <Container maxWidth="lg">
                <Card className="ladders=header" title={LaddersPageTitle} body={LaddersPageDescription} showTop5={true} />
                <LadderTable ladders={ladders} />
            </Container>
        </div>
    );
}

export default LadderPage;
