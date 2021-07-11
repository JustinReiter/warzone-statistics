import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Paper, Link, IconButton, TextField } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { FirstPage as FirstPageIcon, KeyboardArrowLeft, KeyboardArrowRight, LastPage as LastPageIcon } from '@material-ui/icons';
import EnhancedTableHeader from './EnhancedTableHeader';
import './PlayersTable.css';

const useStyles1 = makeStyles((theme) => ({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
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
  })
);

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
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
  { id: 'player', numeric: false, disablePadding: false, label: 'Player' },
  { id: 'wins', numeric: true, disablePadding: false, label: 'Wins' },
  { id: 'losses', numeric: true, disablePadding: false, label: 'Losses' },
  { id: 'elo', numeric: true, disablePadding: false, label: 'Rating' },
];

function descendingComparator(a, b, column) {
  if (column === "player") {
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
      return headCells.filter((header) => game[header.id].toString().toLowerCase().indexOf(searchString.toLowerCase()) >= 0).length > 0;
  });
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  }
}));

function PlayersTable(props) {
    const classes = useStyles();
    const [players, setPlayers] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('wins');
    const [search, setSearch] = useState("");

    useEffect(() => {
      setPlayers(props.players);
    }, [props.players]);

    const handleSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    }

    const playerRows = ((players && players.map((player) => {
        return {player: player.name, id: player.pid, wins: Number(player.wins), losses: Number(player.losses), elo: Number(player.elo)};
    })) || []);

    const queriedPlayerRows = queryFilter(playerRows, search);
    const emptyRows = 10 - Math.min(10, queriedPlayerRows.length - page * 10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    return (
        <div className="PlayersTable">
          <TableContainer component={Paper}>
            <Table width="100%" style={{backgroundColor: "rgb(24, 26, 27)"}}>
                <colgroup>
                    <col width="50%" />
                    <col width="15%" />
                    <col width="15%" />
                    <col width="20%" />
                </colgroup>
                <TableHead>
                <TableRow>
                    <TableCell className="player-cell" colSpan={2}><h3>Standings</h3></TableCell>
                    <TableCell className="player-cell" colSpan={2}><TextField id="player-search-field" label="Search" value={search} onChange={(event) => setSearch(event.target.value)} /></TableCell>
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
                {playerRows && (stableSort(queriedPlayerRows, getComparator(order, orderBy)).slice(page * 10, (page+1) * 10)).map((row) => (
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
                        <TableCell className="player-cell" align="right">{props.isSeasonX ? row.elo : Math.round(row.elo)}</TableCell>
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
                            count={queriedPlayerRows.length}
                            page={page}
                            rowsPerPage={10}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page'},
                                native: true
                            }}
                            onPageChange={handleChangePage}
                            ActionsComponent={TablePaginationActions}
                            style={{color: "rgba(232, 230, 227, 0.87)"}}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
          </TableContainer>
            <p>* Note: Elo Rating is independent of Warzone Rating
            <br/>** All seasons (except Season X) use Elo (μ=1500)
            <br/>*** Season X uses TrueSkill (μ=25; σ=25/3)</p>
        </div>
    );
}

export default PlayersTable;
