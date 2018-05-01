
import React from 'react'
import {Form, Field, Formik} from 'formik'
import Cleave from 'cleave.js/react';
import Select from 'react-select';
import 'cleave.js/dist/addons/cleave-phone.mx';

import {replaceAll, extractValueFromFields, capitalizeFirstLetter, addPropertiesToFields, assignValueToFields} from '../helpers/'


const CleaveCurrency = ({field, form, ...props}) => (
  <Cleave
    {...field}
    className={props.className}
    onChange={e => form.setFieldValue(field.name, e.target.rawValue)}
    options={{
      numeral: true,
      rawValueTrimPrefix: true,
      prefix: '$'}
    }
  />
)

const CleavePhone = ({field, form, ...props}) => (
  <Cleave
    {...field}
    className={props.className}
    onChange={e => form.setFieldValue(field.name, e.target.rawValue)}
    options={{
      phone: true,
      phoneRegionCode: 'MX'
      }
    }
  />
)

const Combo = ({field, form, ...props}) => {
//console.log(field);
 // console.log(props);
return (
  <Select
    {...field}
    className={props.className}
    id={field.name}
    value={form.values[field.name]}
    placeholder={`Select a ${field.name}`}
    clearable={false}
    onChange={value => {
      form.setFieldValue(field.name, value.value)
    }}
    options={props.combo_data}
  />
)
}


const CustomField = (props) => {

  if(props.type == 'currency'){
    return (
      <div className="CustomForm__form_field">
        <label>{props.label}</label>
        <Field disabled={props.disabled} className="CustomForm__form_field_input" name={props.name} component={CleaveCurrency}/>
        {props.message && <p>{props.message}</p>}
        {props.touched && props.error && <div className="CustomForm__form_field_error">{props.error}</div>}
      </div>
    )
  }else if(props.type == 'phone'){
    return (
      <div className="CustomForm__form_field">
        <label>{props.label}</label>
        <Field disabled={props.disabled} className="CustomForm__form_field_input" name={props.name} component={CleavePhone}/>
        {props.message && <p>{props.message}</p>}
        {props.touched && props.error && <div className="CustomForm__form_field_error">{props.error}</div>}
      </div>
    )
  }else if(props.type == 'combo'){
    return (
      <div className="CustomForm__form_field">
        <label>{props.label}</label>
        <Field disabled={props.disabled} className="CustomForm__form_field_combo" name={props.name} combo_data={props.combo_data} component={Combo}/>
        {props.message && <p>{props.message}</p>}
        {props.touched && props.error && <div className="CustomForm__form_field_error">{props.error}</div>}
      </div>
    )
  }

    return (
    <div className="CustomForm__form_field">
      <label>{props.label}</label>
      <Field type={props.type} className="CustomForm__form_field_input" disabled={props.disabled} name={props.name}/>
      {props.message && <p>{props.message}</p>}
      {props.touched && props.error && <div className="CustomForm__form_field_error">{props.error}</div>}
    </div>
  )
}


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
    initialValues={extractValueFromFields(fields)}
    validationSchema={validationSchema}
    onSubmit={
      (values, { resetForm, setErrors, setSubmitting, setValues}) => {
        onSubmit(values, resetForm, setErrors);
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
        isValid,
        setValues,
        resetForm
      }) => {

        fields = addPropertiesToFields(fields);
        return (
          <Form>
          {
            Object.keys(fields).map( (key, index) => {
              if(fields[key]['render']){
                return (
                  <CustomField
                    key={index}
                    type={fields[key]['type']}
                    label={fields[key]['label']}
                    message={fields[key]['message']}
                    combo_data={fields[key]['combo_data']}
                    name={key}
                    error={errors[key]}
                    disabled={disabledForm}
                    touched={touched[key]}

                  />
                )
              }
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
                      buttons[key](values);
                    }}
                  >
                    {key}
                  </button>
                )
              })
            }
            {cancelButton && <button disabled={disabledForm} onClick={e => {
                resetForm(extractValueFromFields(assignValueToFields(fields)));
              if(onCancel)
                onCancel(e)
            }} type="reset">{textCancelButton}</button>}
          </div>

        </Form>
      )}}

  />
);

export {CustomForm as default}
