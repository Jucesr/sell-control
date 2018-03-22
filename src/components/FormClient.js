import React from 'react'
import {Form, Field, withFormik} from 'formik'

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

const formatText = (text) => {
  return capitalizeFirstLetter(text.replaceAll('_', ' '))
}

const CustomField = (props) => (
  <div className="form_field">
    <label>{props.label}</label>
    <Field className="field_input" type="text" name={props.name}  />
    {props.error && <div>{props.error}</div>}
  </div>
)

const F = ({
  values,
  fields,
  errors,
  touched,
  isSubmitting,
  setFieldValue,
  setErrors,
  handleReset
}) => (
  <Form>
    {

      Object.keys(fields).map(function(key, index) {
        return (
          <CustomField key={index} label={formatText(key)} name={key} error={errors[key]}/>
        )
      })
    }
    <button>Ok</button>
    <button onClick={handleReset} type="reset">Cancel</button>
  </Form>
)

const formikConfig = {
  mapPropsToValues({fields}){
    return {
      ...fields
    }
  },
  validationSchema: ({validationObject}) => validationObject,
  handleSubmit(values, {props, resetForm, setErrors, setSubmitting}) {
    props.onSubmit(values)
  }
}



export default withFormik(formikConfig)(F)
