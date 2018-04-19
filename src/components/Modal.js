import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import { connect } from 'react-redux'

import {closeModal} from '../actions/ui'

export const Modal = ({isOpen, title, message, category, closeModal, onYes}) => {
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


          <div className="Modal__buttons">
            {category == 'question' &&
              [<button key="1" className="Modal__button Modal__button_yes" onClick={() => {
                onYes();
                closeModal();
              }}>Yes</button>,
               <button key="2" className="Modal__button Modal__button_no" onClick={closeModal}>No</button>
              ]
            }

            {category != 'async' && category != 'question' && <button className="Modal__close_button" onClick={closeModal}>Close</button>}
          </div>


        </ReactModal>
    )
  }else {
    return null
  }

}

// Modal.displayName = 'Modal';
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  category: PropTypes.oneOf(['info', 'async', 'error', 'success', 'question']),
  closeModal: PropTypes.func.isRequired,
  onYes: PropTypes.func
}


const mapStateToProps = state => ({
  isOpen: !!state.ui.modal,
  title: state.ui.modal ? state.ui.modal.title : '',
  message: state.ui.modal ? state.ui.modal.message : '',
  category: state.ui.modal ? state.ui.modal.category : 'info',
  onYes: state.ui.modal ? state.ui.modal.onYes : () => {},
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(Modal)
