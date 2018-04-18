import React from 'react'
import Form from '../components/CustomForm'
import {assignValueToFields} from '../helpers/'
import PropTypes from 'prop-types'

export const NewPage = ({onAdd, formFields, validationSchema}) => (
  <Form
    fields={assignValueToFields(formFields)}
    validationSchema={validationSchema}
    onSubmit={onAdd}
    automaticReset={false}
    textSubmitButton="Add"
  />
)

NewPage.propTypes = {
  onAdd: PropTypes.func.isRequired,
  formFields: PropTypes.object.isRequired
}
