export const toggleSidebar = () => ({
  type: 'TOGGLE_SIDEBAR'
})

export const openModal = ({category, title, message}) => ({
  type: 'OPEN_MODAL',
  category,
  title,
  message

})

export const closeModal = () => ({
  type: 'CLOSE_MODAL'
})
