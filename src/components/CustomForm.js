import React from 'react'
import {Form, Field, Formik} from 'formik'

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

const formatText = (text) => {
  return capitalizeFirstLetter(text.replaceAll('_', ' '))
}

const CustomField = (props) => (
  <div className="form_field">
    <label>{props.label}</label>
    <Field disabled={props.enable} className="field_input" type="text" name={props.name}  />
    {props.touched && props.error && <div>{props.error}</div>}
  </div>
)
const CustomForm = ({
  validationObject,
  onSubmit,
  onCancel,
  fields,
  buttons,
  disabledForm,
  textSubmitButton = 'Ok',
  textCancelButton = 'Cancel',
  cancelButton = true
}) => (
  <Formik
    initialValues={{
        ...fields
      }}
    validationSchema={validationObject}
    onSubmit={
      (values, { resetForm, setErrors, setSubmitting}) => {
        onSubmit(values);
        resetForm();
      }}
    render={({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        handleReset,
        isValid
      }) => (
        <Form>
          {
            Object.keys(fields).map(function(key, index) {
              return (
                <CustomField
                  key={index}
                  label={formatText(key)}
                  name={key}
                  error={errors[key]}
                  enable={disabledForm}
                  touched={touched[key]}
                />
              )
            })
          }
          <button disabled={disabledForm}>{textSubmitButton}</button>

          {
            buttons &&
            Object.keys(buttons).map(function(key, index) {
              return (
                <button
                  key={index}
                  disabled={disabledForm}
                  onClick={(e) => {
                    e.preventDefault();
                    buttons[key](e);
                  }}
                >
                  {key}
                </button>
              )
            })
          }
          {cancelButton && <button disabled={disabledForm} onClick={onCancel || handleReset} type="reset">{textCancelButton}</button>}
        </Form>
      )}

  />
);

export {CustomForm as default}
