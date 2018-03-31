export default (entity) => {
  entity = entity.toUpperCase();
  const initialState = {
    isFetching: false,
    items: []
  }

  return (state = initialState, action) => {

    switch (action.type) {
      case `CREATE_${entity}`:
        return {
          ...state,
          items: [
            ...state.items,
            action.entity
          ]
        }

      case `DELETE_${entity}`:
        return {
          ...state,
          items: state.items.filter( (item) => action.entity._id != item._id)
        }

      case `REQUEST_${entity}`:
        return {
          ...state,
          isFetching: true
        }

      case `FETCH_${entity}`:
        return {
          ...state,
          isFetching: false,
          items: action.entity
        }

      case `UPDATE_${entity}`:
        return {
          ...state,
          items: state.items.map(item => {
            if(item._id == action.entity._id){
              return action.entity;
            }
            return item;
          })
        }

      default:
        return state
    }


  }
}
