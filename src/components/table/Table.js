import React from 'react'
import { useTable, usePagination } from 'react-table'
import PropTypes from 'prop-types'

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }
    },
    usePagination
  )

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button
          type="submit"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {'<<'}
        </button>{' '}
        <button
          type="submit"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {'<'}
        </button>{' '}
        <button
          type="submit"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {'>'}
        </button>{' '}
        <button
          type="submit"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {'>>'}
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
      </div>
    </>
  )
}
Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired
}
export default Table
