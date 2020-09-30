import React from 'react'
import { Box, withStyles } from '@material-ui/core'
import MaterialTable, { MTableCell, MTableBodyRow, Column } from 'material-table'

const StyledTableRow = withStyles({
  root: {
    backgroundColor: 'transparent',
    boxShadow: '0 0 0 1px #385989',
    // border: 'solid 1px #DFECFF',
    marginBottom: '20px',
    borderRadius: '4px',
  },
})(MTableBodyRow)

const StyledCell = withStyles({
  root: {
    border: 'none',
    fontSize: '14px'
  }
})(MTableCell)

const StyledTable = withStyles({
  root: {
    borderCollapse: 'separate',
    borderSpacing: '0 20px',
  }
})(MaterialTable)

const StyledBox = withStyles({
  root: {
    '& table.MuiTable-root': {
      padding: '2px',
      borderCollapse: 'separate',
      borderSpacing: '0 20px',
    }
  }
})(Box)

export default function BaseTable({
  data,
  columns,
  overrides = {}
}: {
  data: Array<any>,
  columns: Array<Column<{}>>,
  overrides?: Object
}) {
  return (
    <StyledTable
      data={data}
      columns={columns}
      components={{
        Container: StyledBox,
        Row: StyledTableRow,
        Cell: StyledCell,
      }}
      options={{
        pageSize: 10,
        showTitle: false,
        toolbar: false,
        search: false,
        headerStyle: {
          color: '#333333',
          fontWeight: 'bold',
          backgroundColor: 'transparent',
        }
      }}
      {...overrides}
    />
  )
}
