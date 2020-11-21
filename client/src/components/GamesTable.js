import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, Paper, Link, IconButton } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { FirstPage as FirstPageIcon, KeyboardArrowLeft, KeyboardArrowRight, LastPage as LastPageIcon } from '@material-ui/icons';
import { warzoneGameUrl } from '../Constants';
import './GamesTable.css';

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

function GamesTable(props) {
    // const classes = useStyles();
    const [games, setGames] = useState([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        setGames(props.games);
    }, [props.games]);

    const gameRows = ((games && games.map((game) => {
        let winnerId = game['player' + game.winner + '_id'];
        let winnerName = game['player' + game.winner + '_name'];
        winnerName = winnerName || "winner";
        let loserId = winnerId === game.player0_id ? game.player1_id : game.player0_id;
        let loserName = winnerId === game.player0_id ? game.player1_name : game.player0_name;
        loserName = loserName || "loser";

        return {winnerId, winnerName, loserId, loserName, gid: Number(game.gid), turns: Number(game.turns), startDate: new Date(game.start_date).toLocaleString().slice(0, -3).replace(",", ""), endDate: new Date(game.end_date).toLocaleString().slice(0, -3).replace(",", "")};
    })) || []);

    const emptyRows = 10 - Math.min(10, gameRows.length - page * 10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    return (
        <div className="GamesTable">
            <h3>Recent Games</h3>
            <Table component={Paper}>
                <colgroup>
                    <col width="25%" />
                    <col width="25%" />
                    <col width="20%" />
                    <col width="20%" />
                    <col width="5%" />
                    <col width="5%" />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>Winner</TableCell>
                        <TableCell>Loser</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell align="right">Turns</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {gameRows && (gameRows.slice(page * 10, (page+1) * 10)).map((row) => (
                    <TableRow hover={true} key={row.gid}>
                        <TableCell className="game-cell" component="th" scope="row">
                            <Link
                                href={"/player?pid=" + row.winnerId}
                            >
                                {row.winnerName}
                            </Link>
                        </TableCell>
                        <TableCell className="game-cell">
                            <Link
                                href={"/player?pid=" + row.loserId}
                            >
                                {row.loserName}
                            </Link>
                        </TableCell>
                        <TableCell className="game-cell">{row.startDate}</TableCell>
                        <TableCell className="game-cell">{row.endDate}</TableCell>
                        <TableCell className="game-cell" align="right">{row.turns}</TableCell>
                        <TableCell align="right">
                          <Link
                              target="_blank"
                              rel="noopener noreferrer"
                              href={warzoneGameUrl + row.gid}
                          >
                              {"Link"}
                          </Link>
                        </TableCell>
                    </TableRow>
                ))}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={5} />
                  </TableRow>
                )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[10]}
                            colSpan={6}
                            count={gameRows.length}
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
            <p>* Note: -1 turn games end before picks; 0 turn games end after picks</p>
        </div>
    );
}

export default GamesTable;
