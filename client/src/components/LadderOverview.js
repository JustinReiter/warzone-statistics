import React from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import LadderCard from './LadderCard';
import './LadderTable.css';

function LadderOverview(props) {

    let daily_standings = props.standings && props.standings.map((day) => {
        return {
            name: day.date.slice(0, 10),
            games: day.games
        };
    });
    console.log("Standings");
    console.log(daily_standings);

    return (
        <div className="LadderTable">
            <LadderCard ladder={props.ladder || {}} />
            <LineChart data={daily_standings || [{name: "hi", games: 5}]}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="games" stroke="#8884d8" />
            </LineChart>
        </div>
    );
}

export default LadderOverview;