import React from 'react'
import ReactModal from 'react-modal'
import { connect } from 'react-redux'

import {closeModal} from '../actions/ui'

export const Modal = ({isOpen, title, message, category, closeModal}) => {
  if(isOpen){
    return (
        <ReactModal
          ariaHideApp={false}
          isOpen={isOpen}
          // onRequestClose={props.handleCloseModal}
          // contentLabel="Selected Option"
          closeTimeoutMS={200}
          className={`Modal Modal__${category}`}
        >
          {category == 'async' ? <img src="/img/loading.gif"></img> : <img src={`/img/${category}.png`}></img>}
          <h3 className="Modal__title">{title}</h3>
          {message && <p className = "Modal__body">{message}</p>}
          {category != 'async' && <button className="Modal__close_button" onClick={closeModal}>Close</button>}

        </ReactModal>
    )
  }else {
    return null
  }

}

const mapStateToProps = state => ({
  isOpen: !!state.ui.modal,
  title: state.ui.modal ? state.ui.modal.title : '',
  message: state.ui.modal ? state.ui.modal.message : '',
  category: state.ui.modal ? state.ui.modal.category : '',
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(Modal)
