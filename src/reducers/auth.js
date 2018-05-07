const initialState = {
  _id: undefined,
  token: undefined,
  username: undefined,
  photoURL: undefined
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LOG_IN':
      return {
        _id: action._id,
        token: action.token,
        username: action.username,
        photoURL: action.photoURL
      };
    break;

    case 'SIGN_UP':
      return {
        _id: action.entity._id,
        token: action.entity.token,
        username: action.entity.username,
        email: action.entity.email,
        photoURL: action.entity.photoURL
      };
    break;

    case 'LOG_OUT':
      return {};
    break;
    default:
      return state;
  }
};
