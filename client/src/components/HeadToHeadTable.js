import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, Paper, Link, IconButton, TextField } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { FirstPage as FirstPageIcon, KeyboardArrowLeft, KeyboardArrowRight, LastPage as LastPageIcon } from '@material-ui/icons';
import EnhancedTableHeader from './EnhancedTableHeader';
import './HeadToHeadTable.css';

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
  { id: 'name', numeric: false, disablePadding: false, label: 'Opponent' },
  { id: 'wins', numeric: true, disablePadding: false, label: 'Wins' },
  { id: 'losses', numeric: true, disablePadding: false, label: 'Losses' },
  { id: 'games', numeric: true, disablePadding: false, label: 'Games' },
];

function descendingComparator(a, b, column) {
  if (column === 'name') {
    return a[column] > b[column] ? 1 : -1;
  } else {
    return a[column] < b[column] ? 1 : -1;
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

function HeadToHeadTable(props) {
    const classes = useStyles();
    const [games, setGames] = useState([]);
    const [player, setPlayer] = useState("");
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('games');
    const [search, setSearch] = useState("");

    useEffect(() => {
        setGames(props.games);
    }, [props.games]);

    useEffect(() => {
      setPlayer(props.player);
    }, [props.player]);

    const handleSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    }

    const headToHeadObj = {};

    for (const game of games) {
        let playerIndex = Number(game['player0_id']) === Number(player) ? 0 : 1;
        let didPlayerWin = Number(game.winner) === playerIndex;

        for (let i = 0; i < 4; i++) {
          if (i == playerIndex || !game['player' + i + "_id"]) {
            continue;
          }

          if (!(game['player' + i + "_id"] in headToHeadObj)) {
            headToHeadObj[game['player' + i + "_id"]] = {name: game['player' + i + "_name"], wins: 0, losses: 0};
          }

          headToHeadObj[game['player' + i + "_id"]].wins += didPlayerWin;
          headToHeadObj[game['player' + i + "_id"]].losses += !didPlayerWin;
        }
    }

    const headToHeadArr = Object.entries(headToHeadObj).map((entry) => { return {name: entry[1].name, id: Number(entry[0]), wins: entry[1].wins, losses: entry[1].losses, games: entry[1].wins + entry[1].losses};});

    const queriedHeadToHeadRows = queryFilter(headToHeadArr, search);
    const emptyRows = 10 - Math.min(10, queriedHeadToHeadRows.length - page * 10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <div>
            <Table component={Paper} classes={classes} style={{backgroundColor: "rgb(24, 26, 27)"}}>
                <colgroup>
                    <col width="70%" />
                    <col width="10%" />
                    <col width="10%" />
                    <col width="10%" />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell className="game-cell" colSpan={2}><h3>H2H Results</h3></TableCell>
                        <TableCell className="game-cell" colSpan={2}><TextField id="game-search-field" label="Search" value={search} onChange={(event) => setSearch(event.target.value)} /></TableCell>
                    </TableRow>
                </TableHead>
                <EnhancedTableHeader
                  classes={classes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleSort}
                  headerCells={headCells}
                  padEmptyCell={false}
                />
                <TableBody>
                {stableSort(queriedHeadToHeadRows, getComparator(order, orderBy))
                  .slice(page * 10, (page+1) * 10)
                  .map((row, index) => {
                    return (
                      <TableRow hover={true} key={row.gid} style={{backgroundColor: row.colour}}>
                        <TableCell className="game-cell" component="th" scope="row">
                            <Link
                                href={"/player?pid=" + row.id}
                            >
                                {row.name}
                            </Link>
                        </TableCell>
                        <TableCell className="game-cell" align="right" >{row.wins}</TableCell>
                        <TableCell className="game-cell" align="right" >{row.losses}</TableCell>
                        <TableCell className="game-cell" align="right" >{row.games}</TableCell>
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
                            colSpan={4}
                            count={queriedHeadToHeadRows.length}
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
        </div>
    );
}

export default HeadToHeadTable;
