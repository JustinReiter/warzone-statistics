import React, { useState, useEffect }  from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Label, Legend, Line } from 'recharts';
import LadderCard from './LadderCard';
import GamesTable from './GamesTable';
import PlayersTable from './PlayersTable';
import './LadderTable.css';

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


    console.log(`standings:\n${JSON.stringify(standings,null,4)}`);
    return (
        <div className="LadderTable">
            <LadderCard clickable={false} ladder={props.ladder || {}} />
            
            <div className="GamesChart">
                <h4>Number of Games Completed by Day</h4>
                <LineChart data={standings || [{name: "hi", games: 5}]}
                    margin={{top: 5, right: 30, left: 20, bottom: 100}}
                    width={800} height={500}
                >
                    <Label value="Number of Games Completed by Day" offset={0} position="top" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis angle={-45} textAnchor='end' dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="games" stroke="#8884d8" />
                </LineChart>
            </div>

            <GamesTable games={games} />
            <PlayersTable players={players}/>
        </div>
    );
}

export default LadderOverview;