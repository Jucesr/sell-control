
const initialState = []

export default (state = initialState, action) => {

  switch (action.type) {
    case 'ADD_CLIENT':
      return [
        ...state,
        action.client
      ];

    case 'DELETE_CLIENT':
      return state.filter( (client) => action.id != client.id);
    default:
      return state;
  }


}
