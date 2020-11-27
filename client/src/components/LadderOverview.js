import React, { useState, useEffect }  from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Label, Legend, Line, BarChart, Bar } from 'recharts';
import { Grid } from '@material-ui/core';
import LadderCard from './LadderCard';
import GamesTable from './GamesTable';
import PlayersTable from './PlayersTable';
import { colourMapping } from '../Constants';
import './LadderOverview.css';

function LadderOverview(props) {
    let [standings, setStandings] = useState([]);
    let [games, setGames] = useState([]);
    let [players, setPlayers] = useState([]);
    let [colourData, setColourData] = useState([]);
    let [turnData, setTurnData] = useState([]);

    useEffect(() => {
        setStandings(props.standings && props.standings.map((day) => {
            return {
                name: day.date.slice(0, 10),
                Games: day.games
            };
        })
        );
    }, [props.standings]);

    useEffect(() => {
        if (props.colourData) {
            let intermediateColourData = props.colourData.map((colour) => {
                return {
                    Colour: colourMapping[colour.colour.toLowerCase()],
                    Wins: colour.wins,
                    Losses: colour.losses
                };
            });
            intermediateColourData.sort((a, b) => {
                return a.Colour > b.Colour ? 1 : -1;
            });
            setColourData(intermediateColourData);
        }
    }, [props.colourData]);

    useEffect(() => {
        setGames(props.games);
        
        if (props.games) {
            let turnMap = {};
            for (const game of props.games) {
                if (!(game.turns in turnMap)) {
                    turnMap[game.turns] = 1;
                } else {
                    turnMap[game.turns]++;
                }
            }

            let turnArr = [];
            for (const [turn, games] of Object.entries(turnMap)) {
                turnArr.push({Turns: Number(turn), Games: games});
            }
            turnArr.sort((a, b) => {
                return a.Turns > b.Turns ? 1 : -1;
            });
            setTurnData(turnArr);
        }
        
    }, [props.games]);

    useEffect(() => {
        setPlayers(props.players);
    }, [props.players]);


    return (
        <div className="ladder-table">
            <Grid
                container
                spacing={1}
                alignItems="center"
            >
                <Grid item xs={12} md={6}>
                    <LadderCard clickable={false} ladder={props.ladder || {}} showStats={true} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <div className="games-graph">
                        <h4 className="games-chart-title">Number of Games Completed by Day</h4>
                        <ResponsiveContainer width="100%" height={500}>
                            <LineChart data={standings || []}
                                margin={{top: 10, right: 20, left: 20, bottom: 30}}
                                width={500} height={500}
                            >
                                <Label value="Number of Games Completed by Day" offset={0} position="top" />
                                <CartesianGrid strokeDasharray="3 3" stroke="#3e4446" />
                                <XAxis stroke="rgb(168, 160, 149)" axisLine={{ stroke: "#6a6357"}} angle={-60} textAnchor='end' dataKey="name" />
                                <YAxis stroke="rgb(168, 160, 149)" axisLine={{ stroke: "#6a6357"}} />
                                <Tooltip cursor={{stroke: "#6a6357"}} contentStyle={{backgroundColor: "rgb(32, 35, 42)", color: "rgba(232, 230, 227, 0.87)"}} />
                                <Legend wrapperStyle={{top: 10, color: "rgba(232, 230, 227, 0.87)"}}/>
                                <Line type="monotone" dataKey="Games" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Grid>
            </Grid>
            
            <Grid 
                container
                spacing={3}
                alignItems="flex-start"
            >
                <Grid item xs={12} md={8}>
                    <GamesTable games={games} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <PlayersTable players={players}/>
                </Grid>

                <Grid item xs={12}>
                    <div className="games-graph">
                        <h4 className="games-chart-title">Results by Colour</h4>
                        <ResponsiveContainer width="100%" height={600}>
                            <BarChart width={1000} height={250} data={colourData}
                                margin={{top: 10, right: 20, left: 20, bottom: 50}}
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
                <Grid item xs={12}>
                    <div className="games-graph">
                        <h4 className="games-chart-title">Game Length Distribution</h4>
                        <ResponsiveContainer width="100%" height={600}>
                            <BarChart width={1000} height={250} data={turnData}
                                margin={{top: 10, right: 20, left: 20, bottom: 50}}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#3e4446" />
                                <XAxis stroke="rgb(168, 160, 149)" axisLine={{ stroke: "#6a6357"}} angle={-60} textAnchor='end' interval={0} dataKey="Turns" />
                                <YAxis stroke="rgb(168, 160, 149)" axisLine={{ stroke: "#6a6357"}} />
                                <Tooltip cursor={{fill: "#35393b"}} contentStyle={{backgroundColor: "rgb(32, 35, 42)", color: "rgba(232, 230, 227, 0.87)"}} />
                                <Legend wrapperStyle={{top: 10, color: "rgba(232, 230, 227, 0.87)"}}/>
                                <Bar dataKey="Games" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default LadderOverview;