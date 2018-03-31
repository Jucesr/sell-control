const initialState = {
  sidebar_open: false
}

export default (state = initialState, action) => {

  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebar_open: !state.sidebar_open
      }
    default:
      return state
  }
}
