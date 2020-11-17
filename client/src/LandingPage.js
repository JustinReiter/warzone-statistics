import React, { useState, useEffect } from 'react';
import { getLadders } from './api';
import { Container, Grid } from '@material-ui/core';
import { ResponsiveContainer, LineChart, Label, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import './LandingPage.css';
import Card from './components/Card';
import LadderTable from './components/LadderTable';
import LaddersCard from './components/LaddersCard';
import { LandingPageTitle, LandingPageDescription, LandingPageSeasonalTitle, LandingPageSeasonalDescription } from './Constants';

function LandingPage() {

    const [ ladders, setLadders ] = useState([]);
    const [ stats, setStats ] = useState({});
    const [ games, setGames ] = useState([]);
    const [ players, setPlayers ] = useState([]);

    useEffect(() => {
        getLadders().then((res) => {
            setLadders(res.data.ladders);
            setStats(res.data.stats);

            let gamesData = res.data.ladders.map((ladder) => {
                return {Seasonal: ladder.ladder_name, Games: ladder.game_count};
            }).reverse();
            setGames(gamesData);

            let playersData = res.data.ladders.map((ladder) => {
                return {Seasonal: ladder.ladder_name, Players: ladder.stats.players[0].count};
            }).reverse();
            setPlayers(playersData);
        });
    }, []);

    return (
        <div className="App">
            <Container maxWidth="lg">
                <Card title={LandingPageTitle} body={LandingPageDescription} />
                <LaddersCard stats={stats || {}} />

                <Grid item xs={12} style={{paddingTop: "2%"}}>
                    <div className="games-graph">
                        <h4 className="games-chart-title">Number of Games by Seasonal</h4>
                        <ResponsiveContainer width="100%" height={500}>
                            <LineChart data={games || []}
                                margin={{top: 30, right: 20, left: 20, bottom: 30}}
                                width={500} height={500}
                            >
                                <Label value="Number of Games by Seasonal" offset={0} position="top" />
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis angle={-45} textAnchor='end' dataKey="Seasonal" />
                                <YAxis />
                                <Tooltip />
                                <Legend wrapperStyle={{top: 10}}/>
                                <Line type="monotone" dataKey="Games" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Grid>
                <Grid item xs={12} style={{paddingTop: "2%"}}>
                    <div className="games-graph">
                        <h4 className="games-chart-title">Number of Players by Seasonal</h4>
                        <ResponsiveContainer width="100%" height={500}>
                            <LineChart data={players || []}
                                margin={{top: 30, right: 20, left: 20, bottom: 30}}
                                width={500} height={500}
                            >
                                <Label value="Number of Players by Seasonal" offset={0} position="top" />
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis angle={-45} textAnchor='end' dataKey="Seasonal" />
                                <YAxis />
                                <Tooltip />
                                <Legend wrapperStyle={{top: 10}}/>
                                <Line type="monotone" dataKey="Players" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Grid>

                <Card title={LandingPageSeasonalTitle} body={LandingPageSeasonalDescription} />
                <LadderTable ladders={ladders} />
            </Container>
        </div>
    );
}

export default LandingPage;
