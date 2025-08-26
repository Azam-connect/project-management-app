import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import NoDataFound from './NoDataFound';

export default function ReportTable({ columns, rows }) {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns?.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: '#4F46E5',
                  }}
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    borderBottom: '2px solid #4338ca',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows && rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={`row-${rowIndex}`}
                >
                  {columns.map((column, columnIndex) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={`cell-${rowIndex}-${columnIndex}`}
                        align={column.align}
                      >
                        {column?.format
                          ? column.format(value, rowIndex, row)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <NoDataFound colSpan={columns.length} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
