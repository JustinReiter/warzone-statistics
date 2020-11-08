import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Container } from '@material-ui/core';
import queryString from 'query-string';
import './LadderPage.css';
import { getLadder } from './api';
import LadderOverview from './components/LadderOverview';

function LaddersPage(props) {
    let [ladder, setLadder] = useState({});
    const qs = queryString.parse(useLocation().search);
    const history = useHistory();

    console.log(props);
    useEffect(() => {
        if (!qs.ladder || isNaN(qs.ladder)) {
            history.push("/ladders");
        }
        getLadder(qs.ladder).then((res) => {
            if (res.data.ladder.length === 0) {
                history.push("/ladders");
            }

            setLadder(res.data);
        });
    }, [history, qs.ladder]);

    return (
        <div className="App">
            <header className="App-header">
                <Container maxWidth="md">
                    <LadderOverview ladder={(ladder.ladder && ladder.ladder[0]) || {}} standings={ladder.standings} games={ladder.games} />
                    {/* <Card className="Page-Header" title={LaddersPageTitle} body={LaddersPageDescription} />
                    <LadderTable ladders={ladders} /> */}
                </Container>
            </header>
        </div>
    );
}

export default LaddersPage;
