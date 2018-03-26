
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

    case 'REMOVE_CLIENT':
      return {
        ...state,
        items: state.items.filter( (client) => action._id != client._id)
      }

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

    case 'UPDATE_CLIENT':
      return {
        ...state,
        items: state.items.map(client => {
          if(client._id == action.client._id){
            return action.client;
          }
          return client;
        })
      }

    default:
      return state
  }


}
