import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {NewPage} from '../components/NewPage'
import {ListPage} from '../components/ListPage'
import {EditPage} from '../components/EditPage'
import {openModal, closeModal} from '../actions/ui'

import {capitalizeFirstLetter, assignValueToFields} from '../helpers'

class Page extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      active_page: 'new',
      fields: this.props.fields
    }
  }

  componentDidMount() {
    this.props.fetchItems();
  }

  componentWillReceiveProps(nextProps) {
  // You don't have to do this check first, but it can help prevent an unneeded render
  if (nextProps.fields !== this.state.fields) {
    this.setState({ fields: nextProps.fields });
  }
}

  changePage = (e) => {
    let page = e.target.id
    this.setState(() => ({
      active_page: page
    }))
  }

  onSearch = (entity, resetForm, setErrors) => {
    let target = entity[this.props.searchField]
    this.props.showMessage({
      category: 'async',
      title: `Searching ${this.props.entity}...`
    })

    const searchEntity = this.props.entities.filter(item => item[this.props.searchField] == target)[0];

    if(searchEntity){

      this.props.closeMessage();

      this.setState((prevState) => ({
          fields: {
            ...assignValueToFields(prevState.fields, searchEntity),
            _id: {
              value: searchEntity._id,
              render: false
            }
          }
      }))

    }else{
      //TODO: Search in Database.
      this.props.showMessage({
        category: 'error',
        title: `${capitalizeFirstLetter(this.props.entity)} was not found`
      })
      setErrors({[this.props.searchField]: `${capitalizeFirstLetter(this.props.entity)} was not found`})
    }
  }

  onAdd = (entity, resetForm, setErrors) => {

    let target = entity[this.props.searchField]

    this.props.showMessage({
      category: 'async',
      title: `Adding ${this.props.entity}...`
    })

    const search = this.props.entities.filter(item => item[this.props.searchField] == target);
    if(search.length == 0){
      this.props.addEntity(entity).then(
        (message) => {
          if(message.error){
            this.props.showMessage({
              category: 'error',
              title: `${capitalizeFirstLetter(this.props.entity)} could not be added`,
              message: message.error
            })

          }else{
            this.props.showMessage({
              category: 'success',
              title: `${capitalizeFirstLetter(this.props.entity)} added`
            })
          }

        }
      ).then(resetForm)
    }else{
      this.props.showMessage({
        category: 'error',
        title: `Opps`,
        message: `The ${this.props.searchField} is alredy taken`
      })
      setErrors({[this.props.searchField]: `The ${this.props.searchField} is alredy taken`})
    }

  }

  onDelete = (entity) => {

    entity = {
      ...entity,
      _id: this.state.fields._id.value
    }

    this.props.showMessage({
      category: 'question',
      title: 'Are you sure to delete it?',
      onYes: () => {
        this.props.removeEntity(entity).then(
          action => {

            if(!action.type.includes('ERROR')){
              this.props.showMessage({
                category: 'success',
                title: `${capitalizeFirstLetter(this.props.entity)} deleted`
              })
            }else{
              this.props.showMessage({
                category: 'error',
                title: 'Opps',
                message: action.error
              })
            }

          }
        ).then(() => this.onCancelEdit());
      }
    })

  }

  onEdit = (updatedEntity, resetForm, setErrors) => {

    updatedEntity = {
      ...updatedEntity,
      _id: this.state.fields._id.value
    }

    const search = this.props.entities.filter(item => (item[this.props.searchField] == updatedEntity[this.props.searchField] && item._id != updatedEntity._id));

    if(search.length == 0){
      this.props.updateEntity(updatedEntity).then(
        action => {

          if(!action.type.includes('ERROR')){
            this.props.showMessage({
              category: 'success',
              title: `${capitalizeFirstLetter(this.props.entity)} saved`
            })
            this.onCancelEdit();
          }else{
            this.props.showMessage({
              category: 'error',
              title: 'Opps',
              message: action.error
            })
          }
        }
      )
    }else{
      this.props.showMessage({
        category: 'error',
        title: `Opps`,
        message: `The ${this.props.searchField} is alredy taken`
      })
      setErrors({[this.props.searchField]: `The ${this.props.searchField} is alredy taken`})
    }
  }

  onCancelEdit = () => {
    let newFields = assignValueToFields(this.state.fields);
    delete newFields._id
    this.setState((prevState) => ({
        fields: newFields
    }));
  }

  onClickItemTable = (entity) => {

    this.setState((prevState) => ({
        fields: {
          ...assignValueToFields(prevState.fields, entity),
          _id: {
            value: entity._id,
            render: false
          }
        },
        active_page: 'edit'
    }))
  }

  render(){
    return (
      <div className ={`Page ${this.props.sidebar_open ? 'Page__open': 'Page__closed'}`}>
        <div className= 'Page__title'><h2> {`${capitalizeFirstLetter(this.props.entity)}s`} </h2></div>

        <div className="Page__actions">
          <button className={this.state.active_page == 'list' ? 'Page__button_page_active' : 'Page__button_page'} id="list" onClick={this.changePage}>List</button>
          <button className={this.state.active_page == 'new' ? 'Page__button_page_active' : 'Page__button_page'} id="new" onClick={this.changePage}>New</button>
          <button className={this.state.active_page == 'edit' ? 'Page__button_page_active' : 'Page__button_page'} id="edit" onClick={this.changePage}>Edit</button>
        </div>

        <div className="Page__content_wrapper">
          <div className="Page__content">
            { this.state.active_page == 'list' &&
              <ListPage
                columns={this.props.columns}
                items={this.props.entities}
                loading={this.props.isFetching}
                onClickItemTable={this.onClickItemTable}
              />
            }

            { this.state.active_page == 'new' &&
              <NewPage
                formFields={this.state.fields}
                onAdd={this.onAdd}
                validationSchema={this.props.fieldValidation}
              />
            }

            { this.state.active_page == 'edit' &&
              <EditPage
                editForm={{
                  fields: this.state.fields,
                  validationSchema: this.props.fieldValidation
                }}
                searchForm={{
                  fields: {
                    [this.props.searchField]: {}
                  },
                  validationSchema: this.props.searchValidation
                }}
                onSave={this.onEdit}
                onDelete={this.onDelete}
                onCancel={this.onCancelEdit}
                onSearch={this.onSearch}
                disabledForm={this.state.fields.hasOwnProperty('_id')}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  sidebar_open: state.ui.sidebar_open
})

const mapDispatchToProps = dispatch => ({
  showMessage: (data) => dispatch(openModal(data)),
  closeMessage: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(Page)
