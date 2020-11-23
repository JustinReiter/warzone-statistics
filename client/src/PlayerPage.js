import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { Container, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, Paper, Link, IconButton, Grid } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { FirstPage as FirstPageIcon, KeyboardArrowLeft, KeyboardArrowRight, LastPage as LastPageIcon } from '@material-ui/icons';
import PlayerCard from './components/PlayerCard';
import GamesTable from './components/GamesTable';
import { getUserById } from './api';
import './PlayerPage.css';

const useStyles1 = makeStyles((theme) => ({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  })
);

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onChangePage(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onChangePage(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onChangePage(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <div className={classes.root}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
}

function PlayerPage(props) {
    // const classes = useStyles();
    const [player, setPlayer] = useState([]);
    const [games, setGames] = useState([]);
    const [standings, setStandings] = useState([]);
    const [page, setPage] = useState(0);

    const qs = queryString.parse(useLocation().search);
    const history = useHistory();

    useEffect(() => {
        if (!qs.pid || isNaN(qs.pid)) {
            history.push("/players");
        }
        getUserById(qs.pid).then((res) => {
            if (!res.data.users.length) {
                history.push("/players");
            }

            setPlayer(res.data.users[0]);
            setGames(res.data.games)
            setStandings(res.data.standings);
        });
    }, [history, qs.pid]);

    const playerRows = ((standings && standings.map((record) => {
        return {lid: record.lid, season: record.season || record.lid, wins: record.wins, losses: record.losses, elo: record.elo};
    })) || []);
    
    const emptyRows = 10 - Math.min(10, playerRows.length - page * 10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    return (
      <div className="players-page">
        <Container maxWidth="lg">
          <div className="PlayersTable">
              <PlayerCard player={player} games={games} standings={standings} />
              <h3>Season Results</h3>
              <Table component={Paper} width="100%">
                  <colgroup>
                      <col width="50%" />
                      <col width="15%" />
                      <col width="15%" />
                      <col width="20%" />
                  </colgroup>
                  <TableHead>
                      <TableRow>
                          <TableCell>Season</TableCell>
                          <TableCell align="right">Wins</TableCell>
                          <TableCell align="right">Losses</TableCell>
                          <TableCell align="right">Elo</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                  {playerRows && (playerRows.slice(page * 10, (page+1) * 10)).map((row) => (
                      <TableRow hover={true} key={row.id}>
                          <TableCell className="player-cell" component="th" scope="row">
                              <Link
                                  href={"/ladder?ladder=" + row.lid}
                              >
                                  {row.season}
                              </Link>
                          </TableCell>
                          <TableCell className="player-cell" align="right">{row.wins}</TableCell>
                          <TableCell className="player-cell" align="right">{row.losses}</TableCell>
                          <TableCell className="player-cell" align="right">{row.elo}</TableCell>
                      </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={4} />
                    </TableRow>
                  )}
                  </TableBody>
                  <TableFooter>
                      <TableRow>
                          <TablePagination
                              rowsPerPageOptions={[10]}
                              colSpan={4}
                              count={playerRows.length}
                              page={page}
                              rowsPerPage={10}
                              SelectProps={{
                                  inputProps: { 'aria-label': 'rows per page'},
                                  native: true
                              }}
                              onChangePage={handleChangePage}
                              ActionsComponent={TablePaginationActions}
                          />
                      </TableRow>
                  </TableFooter>
              </Table>
              <p>* Note: Elo Rating is independent of Warzone Rating</p>

              <Grid 
                container
                spacing={3}
                alignItems="flex-start"
            >
                <Grid item xs={12}>
                    <GamesTable games={games} showSeason={true} playerId={player.pid} />
                </Grid>
            </Grid>
          </div>
        </Container>
      </div>
    );
}

export default PlayerPage;
