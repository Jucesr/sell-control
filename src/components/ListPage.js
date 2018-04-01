import React from 'react'
import ReactTable from "react-table"
import PropTypes from 'prop-types'

import {replaceNullWithBlank} from '../helpers/'

function filterCaseInsensitive(filter, row) {
	const id = filter.pivotId || filter.id;
	return (
		row[id] !== undefined ?
			String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
		:
			true
	);
}

export const ListPage = ({columns, items, loading, onClickItemTable}) => (
  <div>
        <ReactTable
          data={items}
          filterable={true}
          defaultFilterMethod={filterCaseInsensitive}
          columns={columns.map(column => ({
						...column,
						headerClassName: 'table_header'
					}))}
          loading={loading}
          getTdProps={(state, rowInfo, column, instance) => {
              return {
                onClick: (e, handleOriginal) => {
                  if(rowInfo){
                    onClickItemTable(replaceNullWithBlank(rowInfo.original));
                  }
                  if (handleOriginal) {
                    handleOriginal()
                  }
                }
              }
            }}
          getTrProps={(state, rowInfo, column, instance) => {
						return rowInfo ? {
                className: 'table_row'
            } : {}

            }}
          className="-striped -highlight"
        />
  </div>
)

ListPage.propTypes = {
	columns: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
	loading: PropTypes.bool.isRequired,
	onClickItemTable: PropTypes.func.isRequired
}
