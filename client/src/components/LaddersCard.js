import React from 'react';
import { Card } from 'react-bootstrap';
import { Grid, Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Paper, Link } from '@material-ui/core';
import './LaddersCard.css';

function LaddersCard(props) {

    return (
        <Card className="ladders-card">
            <Card.Header><h6>Seasonal Statistics</h6></Card.Header>
            <Card.Body>
                <Grid
                    container
                    spacing={1}
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-around"
                >
                    <Grid
                        container
                        item
                        spacing={1}
                        alignItems="flex-start"
                        direction="column"
                        justifyContent="center"
                        xs={12} md={4}
                        className="ladders-card-column"
                    >
                        <Grid item xs={12} md={12}>
                            <Card.Text>Total Games: {props.stats.games && Number(props.stats.games[0].count).toLocaleString()}</Card.Text>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Card.Text>Games Today: {props.stats.gamesToday && Number(props.stats.gamesToday[0].count).toLocaleString()}</Card.Text>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Card.Text>Total Boots: {props.stats.boots && Number(props.stats.boots[0].count).toLocaleString()}</Card.Text>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Card.Text>Total Players: {props.stats.players && Number(props.stats.players[0].count).toLocaleString()}</Card.Text>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Card.Text>Average Turns: {props.stats.avgTurns && Math.round(props.stats.avgTurns[0].avg * 100) / 100}</Card.Text>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        item
                        spacing={1}
                        alignItems="flex-start"
                        direction="column"
                        justifyContent="flex-start"
                        xs={12} md={4}
                        className="ladders-card-column"
                    >
                        <Grid item xs={12} md={12}>
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="Top 5 players by wins"  style={{backgroundColor: "rgb(24, 26, 27)"}}>
                                    <TableHead>
                                    <TableRow>
                                        <TableCell className="top-players-header" >Top 5</TableCell>
                                        <TableCell className="top-players-header" align="right">Wins</TableCell>
                                        <TableCell className="top-players-header" align="right">Losses</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {props.stats.top5 && props.stats.top5.map((player) => (
                                        <TableRow key={player.name}>
                                            <TableCell component="th" scope="row"className="top-players-cell" >
                                                <Link
                                                    href={"/player?pid=" + player.pid}
                                                >
                                                    {player.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="top-players-cell" align="right">{player.wins}</TableCell>
                                            <TableCell className="top-players-cell" align="right">{player.losses}</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        item
                        spacing={1}
                        alignItems="flex-start"
                        direction="column"
                        justifyContent="flex-start"
                        xs={12} md={4}
                        className="ladders-card-column"
                    >
                        <Grid item xs={12} md={12}>
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="Top 5 players by season count"  style={{backgroundColor: "rgb(24, 26, 27)"}}>
                                    <TableHead>
                                    <TableRow>
                                        <TableCell className="top-players-header" >Top 5</TableCell>
                                        <TableCell className="top-players-header" align="right">Seasons</TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {props.stats.active5 && props.stats.active5.map((player) => (
                                        <TableRow key={player.name}>
                                            <TableCell component="th" scope="row" className="top-players-cell" >
                                                <Link
                                                    href={"/player?pid=" + player.pid}
                                                >
                                                    {player.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="top-players-cell" align="right">{player.count}</TableCell>
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