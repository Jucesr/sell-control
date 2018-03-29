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

export const ListPage = ({clients, fetchClients, isFetching, onClickItemTable}) => (
  <div>
        <ReactTable
          data={clients}
          filterable={true}
          defaultFilterMethod={filterCaseInsensitive}
          columns={[
            {
              Header: 'Fist name',
              accessor: 'fist_name',
              headerClassName: 'table_header'
            },{
              Header: 'Last name',
              accessor: 'last_name',
              headerClassName: 'table_header',
            },{
              Header: 'Address',
              accessor: 'address',
              headerClassName: 'table_header'
            },{
              Header: 'Email',
              accessor: 'email',
              headerClassName: 'table_header'
            },{
              Header: 'Phone',
              accessor: 'phone',
              headerClassName: 'table_header'
            }
          ]}
          loading={isFetching}
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
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      // id: PropTypes.string.isRequired,
      fist_name: PropTypes.string.isRequired,
      last_name: PropTypes.string,
      address: PropTypes.string,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
    }).isRequired
  ).isRequired,
}
