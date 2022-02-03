import React, { useMemo } from 'react'
import { useTable, useSortBy } from 'react-table';
import BTable from 'react-bootstrap/Table';

export default function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data }, useSortBy)

    return (
        <BTable bordered hover size="sm" {...getTableProps()} className='table'>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())} className='text-center' title={column?.title}>
                                <div className='img-container-th'>{column.render('Header')}</div>
                                <span>
                                    {column.isSorted
                                        ? column.isSortedDesc
                                            ? <i className="bi bi-caret-down-fill"></i>
                                            : <i className="bi bi-caret-up-fill"></i>
                                        : ''}
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} className={row.original?.rowClass}>
                            {row.cells.map(cell => {
                                return (
                                    <td {...cell.getCellProps()} className='align-middle'>{cell.render('Cell')}</td>
                                )
                            })}
                        </tr>
                    )
                }
                )}
            </tbody>
        </BTable>
    )
}