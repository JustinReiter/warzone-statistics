import React, { useState, useEffect }  from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Label, Legend, Line } from 'recharts';
import { Grid } from '@material-ui/core';
import LadderCard from './LadderCard';
import GamesTable from './GamesTable';
import PlayersTable from './PlayersTable';
import './LadderOverview.css';

function LadderOverview(props) {
    let [standings, setStandings] = useState([]);
    let [games, setGames] = useState([]);
    let [players, setPlayers] = useState([]);

    useEffect(() => {
        setStandings(props.standings && props.standings.map((day) => {
            return {
                name: day.date.slice(0, 10),
                games: day.games
            };
        })
        );
    }, [props.standings]);

    useEffect(() => {
        setGames(props.games);
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
                <Grid item xs={6}>
                    <LadderCard clickable={false} ladder={props.ladder || {}} />
                </Grid>
                <Grid item xs={6}>
                    <div className="games-graph">
                        <h4 className="games-chart-title">Number of Games Completed by Day</h4>
                        <ResponsiveContainer width="100%" height={500}>
                            <LineChart data={standings || [{name: "hi", games: 5}]}
                                margin={{top: 10, right: 20, left: 20, bottom: 30}}
                                width={500} height={500}
                            >
                                <Label value="Number of Games Completed by Day" offset={0} position="top" />
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis angle={-45} textAnchor='end' dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend wrapperStyle={{top: 10}}/>
                                <Line type="monotone" dataKey="games" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Grid>
            </Grid>
            
            <Grid 
                container
                spacing={1}
                alignItems="center"
            >
                <Grid item xs={8}>
                    <GamesTable games={games} />
                </Grid>
                <Grid item xs={4}>
                    <PlayersTable players={players}/>
                </Grid>
            </Grid>
        </div>
    );
}

export default LadderOverview;