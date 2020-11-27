import React from 'react';
import { Card } from 'react-bootstrap';
import { Grid, Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Paper, Link, createMuiTheme } from '@material-ui/core';
import './LaddersCard.css';

const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
    },
});

function LaddersCard(props) {

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
                            <Card.Text>Total Games: {props.stats.games && Number(props.stats.games[0].count).toLocaleString()}</Card.Text>
                        </Grid>
                        <Grid item xs={12}>
                            <Card.Text>Games Today: {props.stats.gamesToday && Number(props.stats.gamesToday[0].count).toLocaleString()}</Card.Text>
                        </Grid>
                        <Grid item xs={12}>
                            <Card.Text>Total Boots: {props.stats.boots && Number(props.stats.boots[0].count).toLocaleString()}</Card.Text>
                        </Grid>
                        <Grid item xs={12}>
                            <Card.Text>Total Players: {props.stats.players && Number(props.stats.players[0].count).toLocaleString()}</Card.Text>
                        </Grid>
                        <Grid item xs={12}>
                            <Card.Text>Average Turns: {props.stats.avgTurns && Math.round(props.stats.avgTurns[0].avg * 100) / 100}</Card.Text>
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
                                <Table size="small" aria-label="a dense table"  style={{backgroundColor: "rgb(24, 26, 27)"}}>
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
                        spacing={1}
                        alignItems="flex-start"
                        direction="column"
                        justify="flex-start"
                        xs={12} md={4}
                    >
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table"  style={{backgroundColor: "rgb(24, 26, 27)"}}>
                                    <TableHead>
                                    <TableRow>
                                        <TableCell className="top-players-header" >Top 5</TableCell>
                                        <TableCell className="top-players-header" align="right">Seasonals</TableCell>
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