import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, Paper, Link, IconButton, TextField } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { FirstPage as FirstPageIcon, KeyboardArrowLeft, KeyboardArrowRight, LastPage as LastPageIcon } from '@material-ui/icons';
import EnhancedTableHeader from './EnhancedTableHeader';
import { warzoneGameUrl, seasonMapping } from '../Constants';
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

const headCells = [
  { id: 'winnerName', numeric: false, disablePadding: false, label: 'Winner' },
  { id: 'loserName', numeric: false, disablePadding: false, label: 'Loser' },
  { id: 'startDate', numeric: true, disablePadding: false, label: 'Start Date' },
  { id: 'endDate', numeric: true, disablePadding: false, label: 'End Date' },
  { id: 'turns', numeric: true, disablePadding: false, label: 'Turns' },
];

function descendingComparator(a, b, column) {
  if (column.indexOf('Date') >= 0) {
    return new Date(a[column]) > new Date(b[column]) ? 1 : -1;
  } else if (column === 'turns') {
    return a[column] < b[column] ? 1 : -1;
  } else {
    return a[column] > b[column] ? 1 : -1;
  }
}

function getComparator(order, column) {
  if (order === "desc") {
    return (a, b) => descendingComparator(a, b, column);
  } else {
    return (a, b) => -descendingComparator(a, b, column);
  }
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function queryFilter(array, searchString) {
    if (!searchString || !searchString.trim()) {
        return array;
    }

    return array.filter((game) => {
        return headCells.filter((header) => new String(game[header.id]).toLowerCase().indexOf(searchString.trim().toLowerCase()) >= 0).length > 0;
    });
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  }
}));

function GamesTable(props) {
    const classes = useStyles();
    const [games, setGames] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('endDate');
    const [search, setSearch] = useState("");

    useEffect(() => {
        setGames(props.games);
    }, [props.games]);

    useEffect(() => {
      if (props.showSeason) {
        headCells.splice(0, 0, { id: 'season', numeric: false, disablePadding: false, label: 'Season' })
      }
    }, [props.showSeason]);

    const handleSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    }

    const gameRows = ((games && games.map((game) => {
        let winnerId = game['player' + game.winner + '_id'];
        let winnerName = game['player' + game.winner + '_name'];
        winnerName = winnerName || "winner";
        let loserId = winnerId === game.player0_id ? game.player1_id : game.player0_id;
        let loserName = winnerId === game.player0_id ? game.player1_name : game.player0_name;
        loserName = loserName || "loser";

        let colour;
        if (props.playerId) {
          colour = winnerId === props.playerId ? "#3d511d" : "#410808";
        }

        return {lid: game.lid, season: seasonMapping[Number(game.lid)], colour, winnerId, winnerName, loserId, loserName, gid: Number(game.gid), turns: Number(game.turns), startDate: new Date(game.start_date).toLocaleString().slice(0, -3).replace(",", ""), endDate: new Date(game.end_date).toLocaleString().slice(0, -3).replace(",", "")};
    })) || []);

    const queriedGameRows = queryFilter(gameRows, search);
    const emptyRows = 10 - Math.min(10, queriedGameRows.length - page * 10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    let nameWidths = props.showSeason ? "20%" : "25%";
    let dateWidths = props.showSeason ? "15%" : "20%";

    return (
        <div className="GamesTable">
            <Table component={Paper} classes={classes} style={{backgroundColor: "rgb(24, 26, 27)"}}>
                <colgroup>
                    { props.showSeason && <col width="20" /> }
                    <col width={nameWidths} />
                    <col width={nameWidths} />
                    <col width={dateWidths} />
                    <col width={dateWidths} />
                    <col width="5%" />
                    <col width="5%" />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell className="game-cell" colSpan={props.showSeason ? 4 : 3}><h3>Recent Games</h3></TableCell>
                        <TableCell className="game-cell" colSpan={3}><TextField id="game-search-field" label="Search" value={search} onChange={(event) => setSearch(event.target.value)} /></TableCell>
                    </TableRow>
                </TableHead>
                <EnhancedTableHeader
                  classes={classes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleSort}
                  headerCells={headCells}
                  padEmptyCell={true}
                />
                <TableBody>
                {stableSort(queriedGameRows, getComparator(order, orderBy))
                  .slice(page * 10, (page+1) * 10)
                  .map((row, index) => {
                    return (
                      <TableRow hover={true} key={row.gid} style={{backgroundColor: row.colour}}>
                        {
                          props.showSeason &&
                          <TableCell className="game-cell">
                            <Link
                              href={"/ladder?ladder=" + row.lid}
                            >
                              {row.season || row.lid}
                            </Link>
                          </TableCell>
                        }
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
                    );
                })}

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
                            colSpan={props.showSeason ? 7 : 6}
                            count={queriedGameRows.length}
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
            <p>* Note: -1 turn games end before picks; 0 turn games end after picks</p>
        </div>
    );
}

export default GamesTable;
