import { CardActionArea, Grid, Link, Paper, Table, TableContainer, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import React, { Fragment } from 'react';
import { Badge, Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { warzoneSeasonUrl, warzoneTemplateURL } from '../../../Constants';
import './LadderCard.css';

const formatDateString = (date) => {
    let interDate = new Date(date);
    return `${interDate.getFullYear()}/${interDate.getMonth()+1}/${interDate.getDate()}`;
};

const formatDateTimeString = (date) => {
    let interDate = new Date(date);
    return `${interDate.getFullYear()}/${interDate.getMonth()+1}/${interDate.getDate()} ${interDate.getHours()}:${("0" + interDate.getMinutes()).slice(-2)}`;
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
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="Top 5 Players by Wins" width="100%">
                        <colgroup>
                            <col width="80%" />
                            <col width="10%" />
                            <col width="10%" />
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell className="top-players-card-header">Top 5</TableCell>
                                <TableCell className="top-players-card-header" align="right">Wins</TableCell>
                                <TableCell className="top-players-card-header" align="right">Losses</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.ladder.stats.top5.map((player) => (
                                <TableRow key={player.name}>
                                    <TableCell className="top-players-card-cell" component="th" scope="row">{player.name}</TableCell>
                                    <TableCell className="top-players-card-cell" align="right">{player.wins}</TableCell>
                                    <TableCell className="top-players-card-cell" align="right">{player.losses}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        )
    }
}

const renderWinnerName = (props) => {
    if (props.clickable || !props.ladder.winner_name) {
        return props.ladder.winner_name || "In-Progress";
    } else {
        return (
            <Link 
                href={"/player?pid=" + props.ladder.winner}
            >
                {props.ladder.winner_name}
            </Link>
        )
    }
}

const renderTemplateName = (props) => {
    if (props.clickable || !props.ladder.template_name) {
        return props.ladder.template_name;
    } else {
        return (
            <Link 
                target="_blank" 
                rel="noopener noreferrer" 
                href={warzoneTemplateURL + props.ladder.tid}
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
            <Card.Header className="card-header"><h5>{ props.ladder.ladder_name }&nbsp;</h5> {!props.clickable && props.ladder.ladder_name && <Link target="_blank" rel="noopener noreferrer" href={warzoneSeasonUrl + props.ladder.lid}>(Season Page)</Link>}</Card.Header>
            <Card.Body>
            <Grid
                container
                spacing={1}
                alignItems="center"
                direction="row"
                justifyContent="space-between"
            >
                <Grid
                    container
                    item
                    spacing={1}
                    alignItems="flex-start"
                    direction="column"
                    justifyContent="flex-start"
                    xs={12} md={6}
                >
                    <Grid item xs={12}>
                        <Card.Text>Games: {Number(props.ladder.game_count).toLocaleString()}</Card.Text>
                    </Grid>
                    <Grid item xs={12}>
                        <Card.Text>Winner: {renderWinnerName(props)}</Card.Text>
                    </Grid>
                    <Grid item xs={12}>
                        <Card.Text>Template: { renderTemplateName(props) }</Card.Text>
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
                    item
                    spacing={1}
                    alignItems="flex-start"
                    direction="column"
                    justifyContent="flex-start"
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