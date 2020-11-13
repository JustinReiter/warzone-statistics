import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Paper, Link, IconButton } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { FirstPage as FirstPageIcon, KeyboardArrowLeft, KeyboardArrowRight, LastPage as LastPageIcon } from '@material-ui/icons';
import { warzoneProfileUrl } from '../Constants';
import './PlayersTable.css';

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

function PlayersTable(props) {
    // const classes = useStyles();
    const [players, setPlayers] = useState([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
      setPlayers(props.players);
    }, props.players);

    const playerRows = (players && players.map((player) => {
        return {player: player.name, id: player.pid, wins: player.wins, losses: player.losses, elo: player.elo};
    }) || []);

    const emptyRows = 10 - Math.min(10, playerRows.length - page * 10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    return (
        <div className="PlayersTable">
            <h3>Player Standings</h3>
            <TableContainer component={Paper}>
                <colgroup>
                    <col width="60%" />
                    <col width="10%" />
                    <col width="10%" />
                    <col width="20%" />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>Player</TableCell>
                        <TableCell align="right">Wins</TableCell>
                        <TableCell align="right">Losses</TableCell>
                        <TableCell align="right">Elo Rating</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {playerRows && (playerRows.slice(page * 10, (page+1) * 10)).map((row) => (
                    <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                            <Link
                                target="_blank"
                                rel="noopener noreferrer"
                                href={warzoneProfileUrl + row.id}
                            >
                                {row.player}
                            </Link>
                        </TableCell>
                        <TableCell align="right">{row.wins}</TableCell>
                        <TableCell align="right">{row.losses}</TableCell>
                        <TableCell align="right">{row.elo}</TableCell>
                    </TableRow>
                ))}
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
                {/* <p>* Note: Elo Rating is independent of Warzone Rating</p> */}
            </TableContainer>
        </div>
    );
}

export default PlayersTable;
