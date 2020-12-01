import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { Container, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, Paper, Link, IconButton, Grid, TextField } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { FirstPage as FirstPageIcon, KeyboardArrowLeft, KeyboardArrowRight, LastPage as LastPageIcon } from '@material-ui/icons';
import PlayerCard from './components/PlayerCard';
import GamesTable from './components/GamesTable';
import HeadToHeadTable from './components/HeadToHeadTable';
import EnhancedTableHeader from './components/EnhancedTableHeader';
import { warzoneTemplateURL } from './Constants';
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

const headCells = [
  { id: 'season', numeric: false, disablePadding: false, label: 'Season' },
  { id: 'template', numeric: false, disablePadding: false, label: 'Template' },
  { id: 'wins', numeric: true, disablePadding: false, label: 'Wins' },
  { id: 'losses', numeric: true, disablePadding: false, label: 'Losses' },
  { id: 'elo', numeric: true, disablePadding: false, label: 'Elo' },
];

function descendingComparator(a, b, column) {
  if (column === "season") {
    return Number(a["lid"]) < Number(b["lid"]) ? 1 : -1;
  } else {
    return Number(a[column]) < Number(b[column]) ? 1 : -1;
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

  return array.filter((player) => {
      return headCells.filter((header) => new String(player[header.id]).toLowerCase().indexOf(searchString.trim().toLowerCase()) >= 0).length > 0;
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

function PlayerPage(props) {
    const classes = useStyles();
    const [player, setPlayer] = useState([]);
    const [games, setGames] = useState([]);
    const [standings, setStandings] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('season');
    const [search, setSearch] = useState("");

    const qs = queryString.parse(useLocation().search);
    const history = useHistory();

    useEffect(() => {
        if (!qs.pid || isNaN(qs.pid)) {
            history.push("/players");
        }

        console.log(qs.pid);
        getUserById(qs.pid).then((res) => {
            if (!res.data.users.length) {
                history.push("/players");
            }

            setPlayer(res.data.users[0]);
            setGames(res.data.games)
            setStandings(res.data.standings);
        });
    }, [history, qs.pid]);

    const seasonRows = ((standings && standings.map((record) => {
        return {lid: record.lid, season: record.season || record.lid, template: record.template, tid: record.tid, wins: record.wins, losses: record.losses, elo: record.elo};
    })) || []);
    
    const queriedSeasonRows = queryFilter(seasonRows, search);
    const emptyRows = 10 - Math.min(10, queriedSeasonRows.length - page * 10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    }

    return (
      <div className="players-page">
        <Container maxWidth="lg">
          <div className="PlayersTable">
              <PlayerCard player={player} games={games} standings={standings} />

              <Grid 
                container
                spacing={2}
                alignItems="flex-start"
              >
                  <Grid item xs={12} md={7}>
                    <Table component={Paper} width="100%" style={{backgroundColor: "rgb(24, 26, 27)"}}>
                        <colgroup>
                            <col width="32%" />
                            <col width="32%" />
                            <col width="10%" />
                            <col width="10%" />
                            <col width="16%" />
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell className="player-cell" colSpan={3}><h3>Season Results</h3></TableCell>
                                <TableCell className="player-cell" colSpan={2}><TextField id="seasons-search-field" label="Search" value={search} onChange={(event) => setSearch(event.target.value)} /></TableCell>
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
                        {seasonRows && (stableSort(queriedSeasonRows, getComparator(order, orderBy)).slice(page * 10, (page+1) * 10)).map((row) => (
                            <TableRow hover={true} key={row.lid}>
                                <TableCell className="player-cell" component="th" scope="row">
                                    <Link
                                        href={"/ladder?ladder=" + row.lid}
                                    >
                                        {row.season}
                                    </Link>
                                </TableCell>
                                <TableCell className="player-cell" component="th" scope="row">
                                    <Link
                                        href={warzoneTemplateURL + row.tid}
                                    >
                                        {row.template}
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
                                    colSpan={5}
                                    count={queriedSeasonRows.length}
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
                </Grid>
                <Grid item xs={12} md={5}>
                    <HeadToHeadTable games={games} player={player.pid} />
                </Grid>
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
