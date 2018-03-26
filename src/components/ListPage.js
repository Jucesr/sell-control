import React from 'react'
import ReactTable from "react-table"
import PropTypes from 'prop-types'

export const ListPage = ({clients, fetchClients, isFetching}) => (
  <div>
        <ReactTable
          data={clients}
          columns={[
            {
              Header: 'Fist name',
              accessor: 'fist_name',
              headerClassName: 'table_header'
            },{
              Header: 'Last name',
              accessor: 'last_name',
              headerClassName: 'table_header'
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
          // getTdProps={(state, rowInfo, column, instance) => {
          //     return {
          //       onClick: (e, handleOriginal) => {
          //         console.log('A Td Element was clicked!')
          //         console.log('it produced this event:', e)
          //         console.log('It was in this column:', column)
          //         console.log('It was in this row:', rowInfo)
          //         console.log('It was in this table instance:', instance)
          //
          //         // IMPORTANT! React-Table uses onClick internally to trigger
          //         // events like expanding SubComponents and pivots.
          //         // By default a custom 'onClick' handler will override this functionality.
          //         // If you want to fire the original onClick handler, call the
          //         // 'handleOriginal' function.
          //         if (handleOriginal) {
          //           handleOriginal()
          //         }
          //       }
          //     }
          //   }}
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
