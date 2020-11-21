import React, { Fragment } from 'react';
import { Badge, Card } from 'react-bootstrap';
import { CardActionArea, Grid, Table, TableHead, TableCell, TableBody, TableRow, Paper, Link } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { warzoneProfileUrl } from '../Constants';
import './PlayerCard.css';

const formatDateString = (date) => {
    return new Date(date).toLocaleString().slice(0, 10);
};

const formatDateTimeString = (date) => {
    return new Date(date).toLocaleString().slice(0, 17).replace(",", "");
};

// Render the card container dependent on if card should be clickable
const renderCardContainer = (props) => {
    if (props.clickable) {
        return (
            <CardActionArea>
                { renderCardText(props) }
            </CardActionArea>
        );
    } else {
        return renderCardText(props);
    }
}

const renderRightGrid = (props) => {
    if (props.showStats) {
        return (
            <Fragment>
                <Grid item xs={12}>
                    <Card.Text>Games Today: {Number(props.ladder.stats.gamesToday[0].count).toLocaleString()}</Card.Text>
                </Grid>
                <Grid item xs={12}>
                    <Card.Text>Players: {Number(props.ladder.stats.players[0].count).toLocaleString()}</Card.Text>
                </Grid>
                <Grid item xs={12}>
                    <Card.Text>Boots: {Number(props.ladder.stats.boots[0].count).toLocaleString()}</Card.Text>
                </Grid>
                <Grid item xs={12}>
                    <Card.Text>Avg. Turns: {Math.round(Number(props.ladder.stats.avgTurns[0].avg) * 100) /100}</Card.Text>
                </Grid>
            </Fragment>
        )
    } else {
        return (
            <Grid item xs={12}>
                <Table size="small" aria-label="Top 5 Players by Wins" width="100%" component={Paper}>
                    <colgroup>
                        <col width="80%" />
                        <col width="10%" />
                        <col width="10%" />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell>Top 5</TableCell>
                            <TableCell align="right">Wins</TableCell>
                            <TableCell align="right">Losses</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.ladder.stats.top5.map((player) => (
                            <TableRow key={player.name}>
                                <TableCell className="top-player-cell" component="th" scope="row">{player.name}</TableCell>
                                <TableCell className="top-player-cell" align="right">{player.wins}</TableCell>
                                <TableCell className="top-player-cell" align="right">{player.losses}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Grid>
        )
    }
}

const renderTemplateName = (props) => {
    if (props.clickable) {
        return props.ladder.template_name;
    } else {
        return (
            <Link 
                target="_blank" 
                rel="noopener noreferrer" 
                href={props.ladder.tid}
            >
                {props.ladder.template_name}
            </Link>
        )
    }
}

// Render card text into the component
const renderCardText = (props) => {
    
    return (
        <Fragment>
            <Card.Header>{props.player.name} <Link target="_blank" rel="noopener noreferrer" href={warzoneProfileUrl + props.player.pid}>(Warzone Profile)</Link> </Card.Header>
            <Card.Body>
            <Grid
                container
                spacing={1}
                alignItems="center"
                direction="row"
                justify="space-between"
            >
                <Grid
                    item
                    spacing={1}
                    alignItems="flex-start"
                    direction="column"
                    justify="flex-start"
                    xs={12} md={6}
                >
                    <Grid item xs={12}>
                        <Card.Text>Games: {Number(props.games && props.games.length).toLocaleString()}</Card.Text>
                    </Grid>
                    <Grid item xs={12}>
                        <Card.Text>Seasons: { Number(props.results && props.results.length).toLocaleString() }</Card.Text>
                    </Grid>
                    <Grid item xs={12}>
                        <Card.Text>Wins: {}</Card.Text>
                    </Grid>
                    <Grid item xs={12}>
                        <Card.Text>Losses: {}</Card.Text>
                    </Grid>
                </Grid>

                <Grid
                    item
                    spacing={1}
                    alignItems="flex-start"
                    direction="column"
                    justify="flex-start"
                    xs={12} md={6}
                >
                    { props.player.stats && renderRightGrid(props) }
                </Grid>
            </Grid>
            </Card.Body>
        </Fragment>
    )
};

function PlayerCard(props) {
    const history = useHistory();

    return (
        <Card key={props.player.pid} className="ladder-card" >
            { renderCardContainer(props) }
        </Card>
    );
}

export default PlayerCard;