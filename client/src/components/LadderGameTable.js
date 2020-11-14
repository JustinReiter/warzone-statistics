import React from 'react';
import { Card as BootstrapCard } from 'react-bootstrap';
import { Grid } from '@material-ui/core';
import LadderCard from './LadderCard';
import './LadderTable.css';

function LadderTable(props) {
    // const classes = useStyles();
    return (
        <div className="LadderTable">
            <Grid
                container
                spacing={1}
            >
                { props.ladders.map((ladder) => {
                    return (
                    <Grid item xs={6}>
                        <LadderCard ladder={ladder} />
                    </Grid>
                );})}
            </Grid>
        </div>
    );
}

export default LadderTable;