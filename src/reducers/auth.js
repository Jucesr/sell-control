const initialState = {
  _id: undefined,
  token: undefined,
  username: undefined,
  photoURL: undefined
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        _id: action._id,
        token: action.token,
        username: action.username,
        photoURL: action.photoURL
      };
    break;

    case 'LOGOUT':
      return {};
    break;
    default:
      return state;
  }
};
