//TODO: BUSCA UNA MANERA DE LIMPIAR EL FORMULARIO DESDE AQUI, ES DECIR QUE TODOS LOS CAMPOS SE PONGAN EN BLANCO

import React from 'react'
import {Form, Field, Formik} from 'formik'

import {replaceAll} from '../helpers/'

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

const formatText = (text) => {
  return capitalizeFirstLetter(replaceAll(text, '_', ' '))
}

const cleanForm = (values) => Object.keys(values).map(key => values[key] = '');

const CustomField = (props) => (
  <div className="CustomForm__form_field">
    <label>{props.label}</label>
    <Field disabled={props.enable} className="field_input" type="text" name={props.name}  />
    {props.touched && props.error && <div>{props.error}</div>}
  </div>
)
const CustomForm = ({
  validationSchema,
  onSubmit,
  onCancel,
  fields,
  buttons,
  disabledForm,
  automaticReset = true,
  textSubmitButton = 'Submit',
  textCancelButton = 'Cancel',
  cancelButton = true
}) => (
  <Formik
    initialValues={{
        ...fields
      }}
    validationSchema={validationSchema}
    onSubmit={
      (values, { resetForm, setErrors, setSubmitting, setValues}) => {
        onSubmit(values, resetForm, setErrors);
        // if(automaticReset){
        //   cleanForm(values);
        // }
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
          <div className="CustomForm__buttons" >
            <button
              className="CustomForm__submit_button"
              disabled={disabledForm}>
              {textSubmitButton}
            </button>

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
          </div>

        </Form>
      )}

  />
);

export {CustomForm as default}
