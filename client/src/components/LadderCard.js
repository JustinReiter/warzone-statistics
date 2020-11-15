import React, { Fragment } from 'react';
import { Badge, Card } from 'react-bootstrap';
import { CardActionArea, Grid, Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Paper, Link } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { warzoneProfileUrl } from '../Constants';
import './LadderCard.css';

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
        console.log("Stats");
        console.log(props);
        return (
            <Fragment>
                <Grid item xs={12}>
                    <Card.Text>Games Today: {props.ladder.stats.gamesToday[0].count}</Card.Text>
                </Grid>
                <Grid item xs={12}>
                    <Card.Text>Players: {props.ladder.stats.players[0].count}</Card.Text>
                </Grid>
                <Grid item xs={12}>
                    <Card.Text>Boots: {props.ladder.stats.boots[0].count}</Card.Text>
                </Grid>
                <Grid item xs={12}>
                    <Card.Text>Avg. Turns: {Math.round(Number(props.ladder.stats.avgTurns[0].avg) * 100) /100}</Card.Text>
                </Grid>
            </Fragment>
        )
    } else {
        return (
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
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
                                <TableCell component="th" scope="row">{player.name}</TableCell>
                                <TableCell align="right">{player.wins}</TableCell>
                                <TableCell align="right">{player.losses}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        )
    }
}

// Render card text into the component
const renderCardText = (props) => {
    
    return (
        <Fragment>
            <Card.Header>{props.ladder.ladder_name}</Card.Header>
            <Card.Body>
            <Grid
                container
                spacing={1}
                alignItems="center"
                direction="row"
                justify="space-between"
            >
                <Grid
                    container
                    spacing={1}
                    alignItems="flex-start"
                    direction="column"
                    justify="flex-start"
                    xs={12} md={6}
                >
                    <Grid item xs={12}>
                        <Card.Text>Games: {props.ladder.game_count}</Card.Text>
                    </Grid>
                    <Grid item xs={12}>
                        <Card.Text>Template: {props.ladder.template_name}</Card.Text>
                    </Grid>
                    <Grid item xs={12}>
                        <Card.Text>Start Date: {formatDateString(props.ladder.start_date)}</Card.Text>
                    </Grid>
                    <Grid item xs={12}>
                        <Card.Text>End Date: {formatDateString(props.ladder.end_date)}</Card.Text>
                    </Grid>
                </Grid>

                <Grid
                    container
                    spacing={1}
                    alignItems="flex-start"
                    direction="column"
                    justify="flex-start"
                    xs={12} md={6}
                >
                    { props.ladder.stats && renderRightGrid(props) }
                </Grid>
            </Grid>
                
                
                
                
            </Card.Body>
            <Card.Footer className="text-muted footer-row">
                <Card.Text>Last Updated: {formatDateTimeString(props.ladder.last_updated)}</Card.Text>
                <Card.Subtitle className="active-badge">{props.ladder.active ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Inactive</Badge> }</Card.Subtitle>
            </Card.Footer>
        </Fragment>
    )
};

function LadderCard(props) {
    const history = useHistory();

    return (
        <Card key={props.ladder.lid} className="ladder-card" onClick={() => {props.clickable && history.push("/ladder?ladder=" + props.ladder.lid)}}>
            { renderCardContainer(props) }
        </Card>
    );
}

export default LadderCard;