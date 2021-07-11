import React from 'react';
import { TableCell, TableHead, TableRow, TableSortLabel } from '@material-ui/core';
import './EnhancedTableHeader.css';

const defaultClasses = {
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
}

function EnhancedTableHeader(props) {
  const { classes, order, orderBy, onRequestSort, headerCells } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  let combinedClasses = {...defaultClasses, ...classes};

  return (
    <TableHead>
      <TableRow>
        {headerCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            className="game-header"
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
        { props.padEmptyCell && <TableCell/> }
      </TableRow>
    </TableHead>
  );
}

export default EnhancedTableHeader;
