const {ObjectID} = require('mongodb')
const {log} = require('../helpers')

export const add = (Entity , fieldsToExclude) => {

  return (req, res, next) => {

    //Don't ever let user assign _id
    delete req.body._id;

    if(fieldsToExclude){
      fieldsToExclude.map(field => {
        delete req.body[field];
      });
    }

    //No need to validate because I used authenticate and verify_company middleware.
    const entity = new Entity({
      ...req.body
    });

    entity.save().then(
      doc => {
        res.send(doc);
        log(`${Entity.modelName} was saved`);
    }).catch( e => next(e))
  }
}

export const remove = (Entity) => {

  return (req, res, next) => {
    let id = req.params.id;

    if(!ObjectID.isValid(id)){
      return next({
        message: 'ID has invalid format',
        html_code: 400
      });
    }

    Entity.findOneAndRemove({
      _id: id,
      company_id: req.user.selected_company_id
    }).then( (doc) => {
      if(!doc)
        return next({
          message: `${Entity.modelName} was not found`,
          html_code: 404
        });

      res.status(200).send(doc);
      log(`${Entity.modelName} was removed`);

    }).catch( e => next(e) );

  }
}

export const update = (Entity, fieldsToExclude) => {

  return (req, res, next) => {

    let id = req.params.id;

    if(!ObjectID.isValid(id))
      return next({
        message: 'ID has invalid format',
        html_code: 400
      });

    if(fieldsToExclude){
      fieldsToExclude.map(field => {
        delete req.body[field];
      });
    }

    Entity.findOne( {
      _id: id,
      company_id: req.user.selected_company_id
    }).then(
      doc => {
        if(!doc)
          return next({
            error: `${Entity.modelName} was not found`,
            html_code: 404
          });
        doc.set({
          ...req.body
        })
        return doc.save()

      }).then(
        doc => {
          res.status(200).send(doc);
          log(`${Entity.modelName} was updated`);
        }
      ).catch( e => next(e) );

  }
}

export const getAll = (Entity) => {

  return (req, res, next) => {
    const filter_id = Entity.modelName == 'Company' ? req.user._id : req.user.selected_company_id ;
    Entity.getAll(filter_id).then(
      (entities) => {
        res.send(entities);
        log(`${Entity.modelName} items were sent`);
      }, e => next(e)
    );
  }
}

export const getByID = (Entity) => {

  return (req, res, next) => {

    const id = req.params.id;
    const filter_id = Entity.modelName == 'Company' ? req.user._id : req.user.selected_company_id ;

    if(!ObjectID.isValid(id))
      return next({
        message: 'ID has invalid format',
        html_code: 400
      });

      Entity.findOne({
        _id: id,
        company_id: filter_id
      }).then(
        (doc) => {
          if(!doc)
            return next({
              message: `${Entity.modelName} was not found`,
              html_code: 404
            });

            res.status(200).send(doc);
            log(`${Entity.modelName} item was sent`);
        }).catch( e => next(e) );
  }
}
