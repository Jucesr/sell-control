const {ObjectID} = require('mongodb')
const {log} = require('../helpers')

const error_handler = (e, res, entity) => {
  let error_message = e.message || e.errmsg;
    res.status(400).send({
      error: e.message
    });
  log(`Error has occurred ${entity} => ${error_message}`);
}

export const add = (Entity , fieldsToExclude) => {

  return (req, res) => {

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
      }, e => error_handler(e, res, Entity.modelName)
    )
  }
}

export const remove = (Entity) => {

  return (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
      return res.status(400).send({
        error: 'ID has invalid format'
      });
    }

    Entity.findOneAndRemove({
      _id: id,
    }).then( (doc) => {

      if(!doc)
        return res.status(404).send({
          error: `${Entity.modelName} was not found`
        });

      res.status(200).send(doc);
      log(`${Entity.modelName} was removed`);

    }).catch( e => error_handler(e, res, Entity.modelName) );

  }
}

export const update = (Entity, fieldsToExclude) => {

  return (req, res) => {

    var id = req.params.id;

    if(!ObjectID.isValid(id))
      return res.status(400).send({
        error: 'ID has invalid format'
      });

    if(fieldsToExclude){
      fieldsToExclude.map(field => {
        delete req.body[field];
      });
    }

    Entity.findOneAndUpdate( {
      _id: id,
      company_id: req.user.company_id
    }, { $set: req.body}, { new: true }).then(
      (doc) => {
        if(!doc)
          return res.status(404).send({
            error: `${Entity.modelName} was not found`
          });
          res.status(200).send(doc);
          log(`${Entity.modelName} was updated`);
      }).catch( e => error_handler(e, res, Entity.modelName) );


  }
}

export const getAll = (Entity) => {

  return (req, res) => {
    const filter_id = Entity.modelName == 'Company' ? req.user._id : req.user.company_id ;
    Entity.getAll(filter_id).then(
      (entities) => {
        res.send(entities);
        log(`${Entity.modelName} items were sent`);
      }, e => error_handler(e, res, Entity.modelName)
    );
  }
}

export const getByID = (Entity) => {

  return (req, res) => {

    const id = req.params.id;
    const filter_id = Entity.modelName == 'Company' ? req.user._id : req.user.company_id ;

    if(!ObjectID.isValid(id))
      return res.status(400).send({
        error: 'ID has invalid format'
      });

      Entity.findOne({
        _id: id,
        company_id: filter_id
      }).then(
        (doc) => {
          if(!doc)
            return res.status(404).send({
              error: `${Entity.modelName} was not found`
            });

            res.status(200).send(doc);
            log(`${Entity.modelName} item was sent`);
        }).catch( e => error_handler(e, res, Entity.modelName) );
  }
}
