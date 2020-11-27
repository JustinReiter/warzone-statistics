import React, { useState, useEffect } from 'react';
import { getLadders } from './api';
import { Container, Grid, createMuiTheme } from '@material-ui/core';
import { ResponsiveContainer, LineChart, Label, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import './LandingPage.css';
import Card from './components/Card';
import LadderTable from './components/LadderTable';
import LaddersCard from './components/LaddersCard';
import { LandingPageTitle, LandingPageDescription, LandingPageSeasonalTitle, LandingPageSeasonalDescription } from './Constants';

const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
    },
  });

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
                        <h4 className="games-chart-title">Number of Games by Season</h4>
                        <ResponsiveContainer width="100%" height={500}>
                            <LineChart data={games || []}
                                margin={{top: 30, right: 20, left: 20, bottom: 50}}
                                width={500} height={500}
                            >
                                <Label value="Number of Games by Seasonal" offset={0} position="top" />
                                <CartesianGrid strokeDasharray="3 3" stroke="#3e4446" />
                                <XAxis stroke="rgb(168, 160, 149)" axisLine={{ stroke: "#6a6357"}} angle={-60} textAnchor='end' dataKey="Seasonal" />
                                <YAxis stroke="rgb(168, 160, 149)" axisLine={{ stroke: "#6a6357"}} />
                                <Tooltip cursor={{stroke: "#6a6357"}} contentStyle={{backgroundColor: "rgb(32, 35, 42)", color: "rgba(232, 230, 227, 0.87)"}} />
                                <Legend wrapperStyle={{top: 10, color: "rgba(232, 230, 227, 0.87)"}}/>
                                <Line type="monotone" dataKey="Games" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Grid>
                <Grid item xs={12} style={{paddingTop: "2%"}}>
                    <div className="games-graph">
                        <h4 className="games-chart-title">Number of Players by Season</h4>
                        <ResponsiveContainer width="100%" height={500}>
                            <LineChart data={players || []}
                                margin={{top: 30, right: 20, left: 20, bottom: 50}}
                                width={500} height={500}
                            >
                                <Label value="Number of Players by Seasonal" offset={0} position="top" />
                                <CartesianGrid strokeDasharray="3 3" stroke="#3e4446" />
                                <XAxis stroke="rgb(168, 160, 149)" axisLine={{ stroke: "#6a6357"}} angle={-60} textAnchor='end' dataKey="Seasonal" />
                                <YAxis stroke="rgb(168, 160, 149)" axisLine={{ stroke: "#6a6357"}} />
                                <Tooltip cursor={{stroke: "#6a6357"}} contentStyle={{backgroundColor: "rgb(32, 35, 42)", color: "rgba(232, 230, 227, 0.87)"}} />
                                <Legend wrapperStyle={{top: 10, color: "rgba(232, 230, 227, 0.87)"}}/>
                                <Line type="monotone" dataKey="Players" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Grid>

                <Card title={LandingPageSeasonalTitle} body={LandingPageSeasonalDescription} />
                <LadderTable ladders={ladders.slice(0, 4)} />
            </Container>
        </div>
    );
}

export default LandingPage;
