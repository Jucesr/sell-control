import React from 'react'
import ReactTable from "react-table"
import PropTypes from 'prop-types'

import {replaceNullWithBlank} from '../helpers/'

export const ListPage = ({clients, fetchClients, isFetching, onClickItemTable}) => (
  <div>
        <ReactTable
          data={clients}
          columns={[
            {
              Header: 'Fist name',
              accessor: 'fist_name',
              headerClassName: 'table_header',
              className: 'table_row'
              // Cell: row => (
              //   <div
              //     style={{
              //       width: '100%',
              //       height: '100%',
              //       backgroundColor: '#dadada',
              //       borderRadius: '2px'
              //     }}
              //   >
              //     {row.value}
              //   </div>
              //   )
            },{
              Header: 'Last name',
              accessor: 'last_name',
              headerClassName: 'table_header',
              className: 'table_row'
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
              return {
                className: 'table_row'
              }
            }}
          // getTheadThProps={(state, rowInfo, column, instance) => {
          //     console.log('state:', state)
          //     console.log('It was in this column:', column)
          //     console.log('It was in this row:', rowInfo)
          //     console.log('It was in this table instance:', instance)
          // }}
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
