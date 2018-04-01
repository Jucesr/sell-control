import React from 'react'
import Form from '../components/CustomForm'
import PropTypes from 'prop-types'

const require_message = 'This field is required';
const invalid_email = 'Invalid email';

export const EditPage = ({editForm, searchForm, onSave, onSearch, onCancel, onDelete, disabledForm}) => (
  <div>
    <Form
      fields={searchForm.fields}
      cancelButton={false}
      disabledForm={disabledForm}
      textSubmitButton="Search"
      validationSchema={searchForm.validationSchema}
      onSubmit={(props) => {
        onSearch(props).then(
          null,
          e => alert(e)
        );
      }}

    />
    { disabledForm &&
      <Form
        textSubmitButton="Save"
        onCancel={onCancel}
        fields={editForm.fields}
        buttons={{
          Delete: onDelete
        }}
        validationSchema={editForm.validationSchema}
        onSubmit={onSave}
      />
    }
  </div>
)

EditPage.propTypes = {
  editForm: PropTypes.object.isRequired,
  searchForm: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}
