import React, { useState, useEffect } from 'react';
import { Container } from '@material-ui/core';
import './LaddersPage.css';
import { getLadders, getSeasonal } from './api';
import Card from './components/Card';
import LadderTable from './components/LadderTable';

import { LaddersPageTitle, LaddersPageDescription } from './Constants';

function LadderPage(props) {
    let [ladders, setLadders] = useState([]);

    useEffect(() => {
        if (props.seasonal) {
            getSeasonal().then((res) => {
                setLadders(res.data.ladders);
            });
        } else {
            getLadders().then((res) => {
                setLadders(res.data.ladders);
            });
        }
    
    }, [props.seasonal]);

    return (
        <div className="ladders-page">
            <Container maxWidth="lg">
                <Card className="ladders-header" title={LaddersPageTitle} body={LaddersPageDescription} showTop5={true} />
                <LadderTable ladders={ladders || []} />
            </Container>
        </div>
    );
}

export default LadderPage;
