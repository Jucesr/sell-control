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
        _id: action.user._id,
        token: action.user.token,
        username: action.user.username,
        email: action.user.email,
        photoURL: action.user.photoURL
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
