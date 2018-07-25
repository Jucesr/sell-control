import {ObjectID} from 'mongodb'
import {log} from '../helpers'

export const add = (Model, fieldsToExclude) => {

  return (req, res, next) => {

    //Don't ever let user assign _id
    delete req.body._id

    if(fieldsToExclude){
      fieldsToExclude.map(field => {
        delete req.body[field]
      })
    }

    //No need to validate because I used authenticate and validate_company middleware.
    const entity = new Model({
      ...req.body
    })

    entity.save().then(
      doc => {
        res.send(doc)
        log(`${Model.modelName} was saved`)
    }).catch( e => next(e))
  }
}

export const remove = (Model) => {

  return (req, res, next) => {
    let id = req.params.id

    if(!ObjectID.isValid(id)){
      return next({
        message: 'ID has invalid format',
        html_code: 400
      })
    }

    // Model.findByIdAndRemove(id).then(
    //   doc => {
    //     if(!doc)
    //       return next({
    //         message: `${Model.modelName} was not found`,
    //         html_code: 404
    //       })
    //
    //     res.status(200).send(doc)
    //     log(`${Model.modelName} was removed`)
    //
    // }).catch( e => next(e) )

    Model.findOne({
      _id: id,
      company_id: req.user.selected_company_id
    }).then(
      doc => {
        if(!doc)
          return next({
            message: `${Model.modelName} was not found`,
            html_code: 404
          })
        return doc.remove()
    }).then(
      doc => {
        res.status(200).send(doc)
        log(`${Model.modelName} was removed`)
      }
    ).catch( e => next(e) )

  }
}

export const update = (Model, fieldsToExclude) => {

  return (req, res, next) => {

    let id = req.params.id

    if(!ObjectID.isValid(id))
      return next({
        message: 'ID has invalid format',
        html_code: 400
      })

    if(fieldsToExclude){
      fieldsToExclude.map(field => {
        delete req.body[field]
      })
    }

    Model.findOne( {
      _id: id,
      company_id: req.user.selected_company_id
    }).then(
      doc => {
        if(!doc)
          return next({
            error: `${Model.modelName} was not found`,
            html_code: 404
          })
        doc.set({
          ...req.body
        })
        return doc.save()

      }).then(
        doc => {
          res.status(200).send(doc)
          log(`${Model.modelName} was updated`)
        }
      ).catch( e => next(e) )


  }
}

export const getAll = (Model) => {

  return (req, res, next) => {
    const filter_id = Model.modelName == 'Company' ? req.user._id : req.user.selected_company_id
    Model.getAll(filter_id).then(
      (entities) => {
        res.send(entities)
        log(`${Model.modelName} were sent`)
      }, e => next(e)
    )
  }
}

export const getByID = (Model) => {

  return (req, res, next) => {

    const id = req.params.id

    if(!ObjectID.isValid(id))
      return next({
        message: 'ID has invalid format',
        html_code: 400
      })

      Model.findOne({
        _id: id,
        company_id: req.user.selected_company_id
      }).then(
        (doc) => {
          if(!doc)
            return next({
              message: `${Model.modelName} was not found`,
              html_code: 404
            })

            res.status(200).send(doc)
            log(`${Model.modelName} was sent`)
        }).catch( e => next(e) )
  }
}
