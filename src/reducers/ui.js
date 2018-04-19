const initialState = {
  sidebar_open: false,
  modal: undefined
}

export default (state = initialState, action) => {

  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebar_open: !state.sidebar_open
      }
    case 'OPEN_MODAL':
      return {
        ...state,
        modal: {
          title: action.title,
          message: action.message,
          category: action.category
        }
      }
    case 'CLOSE_MODAL':
      return {
        ...state,
        modal: undefined
      }
    default:
      return state
  }
}
