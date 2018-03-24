import React from 'react'
import ReactTable from "react-table"
import PropTypes from 'prop-types'

export const ListPage = ({clients, fetchClients, isFetching}) => (
  <div>

    {isFetching ?
      <p>Loading...</p> :
      clients.length > 0 ? (
        <ReactTable
          data={clients}
          columns={[
            {
              Header: 'Fist name',
              accessor: 'fist_name'
            },{
              Header: 'Last name',
              accessor: 'last_name'
            },{
              Header: 'Address',
              accessor: 'address'
            },{
              Header: 'Email',
              accessor: 'email'
            },{
              Header: 'Phone',
              accessor: 'phone'
            }

          ]}
        />

      ) : 'No Clients'}

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
