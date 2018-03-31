export default () => {
  const initialState = {
    isFetching: false,
    items: []
  }

  return (state = initialState, action) => {

    switch (action.type) {
      case 'CREATE_CLIENT':
        return {
          ...state,
          items: [
            ...state.items,
            action.entity
          ]
        }

      case 'DELETE_CLIENT':
        return {
          ...state,
          items: state.items.filter( (client) => action.entity._id != client._id)
        }

      case 'REQUEST_CLIENT':
        return {
          ...state,
          isFetching: true
        }

      case 'FETCH_CLIENT':
        return {
          ...state,
          isFetching: false,
          items: action.entity
        }

      case 'UPDATE_CLIENT':
        return {
          ...state,
          items: state.items.map(client => {
            if(client._id == action.entity._id){
              return action.entity;
            }
            return client;
          })
        }

      default:
        return state
    }


  }
}
