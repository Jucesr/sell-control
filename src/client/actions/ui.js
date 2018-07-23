export const toggleSidebar = () => ({
  type: 'TOGGLE_SIDEBAR'
})

export const openModal = ({category, title, message, onYes}) => ({
  type: 'OPEN_MODAL',
  category,
  title,
  message,
  onYes

})

export const closeModal = () => ({
  type: 'CLOSE_MODAL'
})
