
const initialState = {
  isFetching: false,
  items: []
}

export default (state = initialState, action) => {

  switch (action.type) {
    case 'ADD_CLIENT':
      return {
        ...state,
        items: [
          ...state.items,
          action.client
        ]
      }

    case 'DELETE_CLIENT':
      return state.filter( (client) => action.id != client.id)

    case 'REQUEST_CLIENTS':
      return {
        ...state,
        isFetching: true
      }

    case 'RECEIVE_CLIENTS':
      return {
        ...state,
        isFetching: false,
        items: action.clients
      }

    default:
      return state
  }


}
