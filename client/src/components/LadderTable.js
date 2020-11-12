import React from 'react';
import { Grid } from '@material-ui/core';
import LadderCard from './LadderCard';
import './LadderTable.css';

function LadderTable(props) {
    // const classes = useStyles();
    console.log(props);
    return (
        <div className="LadderTable">
            <Grid
                container
                spacing={1}
            >
                { props.ladders.map((ladder) => {
                    return (
                    <Grid item xs={6}>
                        <LadderCard clickable={true} ladder={ladder} />
                    </Grid>
                );})}
            </Grid>
        </div>
    );
}

export default LadderTable;