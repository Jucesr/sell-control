import React from 'react'
import Form from '../components/CustomForm'
import PropTypes from 'prop-types'
import Yup from 'yup'

const require_message = 'This field is required'

export const NewPage = ({onSubmit}) => (
  <Form
    fields={{
      fist_name: '',
      last_name: '',
      address: '',
      email: '',
      phone: ''
    }}
    validationObject={Yup.object().shape({
      fist_name: Yup.string().required(require_message),
      last_name: Yup.string(),
      address: Yup.string().max(40),
      email: Yup.string().email().required(require_message),
      phone: Yup.string().min(8)
    })}
    onSubmit={(props) => {
      onSubmit(props).then(
        () => alert('Client added'),
        e => alert(e)
      );
    }}/>
)

NewPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}
