import React from 'react';
import { Card } from 'react-bootstrap';
import { Grid, Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Paper, Link } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { warzoneProfileUrl } from '../Constants';
import './LaddersCard.css';


function LaddersCard(props) {
    const history = useHistory();

    return (
        <Card className="ladders-card">
            <Card.Header>Seasonal Statistics</Card.Header>
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
                        xs={12} md={4}
                    >
                        <Grid item xs={12}>
                            <Card.Text>Total Games: {props.stats.games && props.stats.games[0].count}</Card.Text>
                        </Grid>
                        <Grid item xs={12}>
                            <Card.Text>Games Today: {props.stats.gamesToday && props.stats.gamesToday[0].count}</Card.Text>
                        </Grid>
                        <Grid item xs={12}>
                            <Card.Text>Total Boots: {props.stats.boots && props.stats.boots[0].count}</Card.Text>
                        </Grid>
                        <Grid item xs={12}>
                            <Card.Text>Total Players: {props.stats.players && props.stats.players[0].count}</Card.Text>
                        </Grid>
                        <Grid item xs={12}>
                            <Card.Text>Average Game Length: {props.stats.avgTurns && props.stats.avgTurns[0].count} turns</Card.Text>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        spacing={1}
                        alignItems="flex-start"
                        direction="column"
                        justify="flex-start"
                        xs={12} md={4}
                    >
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
                                    {props.stats.top5 && props.stats.top5.map((player) => (
                                        <TableRow key={player.name}>
                                            <TableCell component="th" scope="row">
                                                <Link
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href={warzoneProfileUrl + player.pid}
                                                >
                                                    {player.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell align="right">{player.wins}</TableCell>
                                            <TableCell align="right">{player.losses}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        spacing={1}
                        alignItems="flex-start"
                        direction="column"
                        justify="flex-start"
                        xs={12} md={4}
                    >
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>Top 5</TableCell>
                                        <TableCell align="right">Seasonals</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {props.stats.active5 && props.stats.active5.map((player) => (
                                        <TableRow key={player.name}>
                                            <TableCell component="th" scope="row">
                                                <Link
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href={warzoneProfileUrl + player.pid}
                                                >
                                                    {player.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell align="right">{player.count}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Grid>
            </Card.Body>
        </Card>
    );
}

export default LaddersCard;