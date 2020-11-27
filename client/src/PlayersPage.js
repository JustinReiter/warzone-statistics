import React, { useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, Paper, Link, IconButton } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { FirstPage as FirstPageIcon, KeyboardArrowLeft, KeyboardArrowRight, LastPage as LastPageIcon } from '@material-ui/icons';
import { getUsers } from './api';
import './PlayersPage.css';

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

function PlayersPage(props) {
    // const classes = useStyles();
    const [players, setPlayers] = useState([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
      getUsers().then((players) => {
        console.log(players);
        setPlayers(players.data.users);
      });
    }, []);

    console.log(players);
    const playerRows = ((players && players.map((player) => {
        return {player: player.name, id: player.pid, wins: player.wins, losses: player.losses, count: player.count};
    })) || []);

    const emptyRows = 10 - Math.min(10, playerRows.length - page * 10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    return (
      <div className="players-page">
        <Container maxWidth="lg">
          <h3>Player Standings</h3>
          <Table component={Paper} width="100%" style={{backgroundColor: "rgb(24, 26, 27)"}}>
              <colgroup>
                  <col width="50%" />
                  <col width="15%" />
                  <col width="15%" />
                  <col width="20%" />
              </colgroup>
              <TableHead>
                  <TableRow>
                      <TableCell className="player-header" >Player</TableCell>
                      <TableCell className="player-header" align="right">Wins</TableCell>
                      <TableCell className="player-header" align="right">Losses</TableCell>
                      <TableCell className="player-header" align="right">Seasons Played</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
              {playerRows && (playerRows.slice(page * 10, (page+1) * 10)).map((row) => (
                  <TableRow hover={true} key={row.id}>
                      <TableCell className="player-cell" component="th" scope="row">
                          <Link
                              href={"/player?pid=" + row.id}
                          >
                              {row.player}
                          </Link>
                      </TableCell>
                      <TableCell className="player-cell" align="right">{row.wins}</TableCell>
                      <TableCell className="player-cell" align="right">{row.losses}</TableCell>
                      <TableCell className="player-cell" align="right">{row.count}</TableCell>
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
                          style={{color: "rgba(232, 230, 227, 0.87)"}}
                      />
                  </TableRow>
              </TableFooter>
          </Table>
          <p>* Note: Elo Rating is independent of Warzone Rating</p>
        </Container>
      </div>
    );
}

export default PlayersPage;
