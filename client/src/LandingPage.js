import React, { useState, useEffect } from 'react';
import { getLadders, getColours } from './api';
import { Container, Grid } from '@material-ui/core';
import { ResponsiveContainer, LineChart, Label, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar } from 'recharts';
import './LandingPage.css';
import Card from './components/Card';
import LadderTable from './components/LadderTable';
import LaddersCard from './components/LaddersCard';
import { LandingPageTitle, LandingPageDescription, LandingPageSeasonalTitle, LandingPageSeasonalDescription, colourMapping } from './Constants';

function LandingPage() {

    const [ ladders, setLadders ] = useState([]);
    const [ stats, setStats ] = useState({});
    const [ games, setGames ] = useState([]);
    const [ players, setPlayers ] = useState([]);
    const [ colours, setColours ] = useState([]);

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

        getColours().then((res) => {
            let intermediateColourData = res.data.colourData.map((colour) => {
                return {
                    Colour: colourMapping[colour.colour.toLowerCase()],
                    Wins: colour.wins,
                    Losses: colour.losses
                };
            });
            intermediateColourData.sort((a, b) => {
                return a.Colour > b.Colour ? 1 : -1;
            });
            setColours(intermediateColourData);
        });
    }, []);

    return (
        <div className="App">
            <Container maxWidth="lg">
                <Card title={LandingPageTitle} body={LandingPageDescription} showContact={true} />
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

                <Grid item xs={12} style={{paddingTop: "2%"}}>
                    <div className="games-graph">
                        <h4 className="games-chart-title">Seasonal-Wide Colour Results</h4>
                        <ResponsiveContainer width="100%" height={600}>
                            <BarChart width={1000} height={250} data={colours}
                                margin={{top: 10, right: 20, left: 20, bottom: 60}}
                                barGap={3}
                                barCategoryGap={6}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#3e4446" />
                                <XAxis stroke="rgb(168, 160, 149)" axisLine={{ stroke: "#6a6357"}} angle={-60} textAnchor='end' interval={0} dataKey="Colour" />
                                <YAxis stroke="rgb(168, 160, 149)" axisLine={{ stroke: "#6a6357"}} />
                                <Tooltip cursor={{fill: "#35393b"}} contentStyle={{backgroundColor: "rgb(32, 35, 42)", color: "rgba(232, 230, 227, 0.87)"}} />
                                <Legend wrapperStyle={{top: 10, color: "rgba(232, 230, 227, 0.87)"}}/>
                                <Bar dataKey="Wins" fill="#8884d8" />
                                <Bar dataKey="Losses" fill="#82ca9d" />
                            </BarChart>
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
