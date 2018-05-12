const {ObjectID} = require('mongodb')

export const add = (Entity) => {

  return (req, res) => {
    const entity = new Entity({
      ...req.body
    });

    entity.save().then(
      doc => {
        res.send(doc);
        console.log(`${Entity.modelName} was saved`);
      }, e => {
        res.status(400).send(e);
        console.error(`Error has occurred while saving ${Entity.modelName}`, e);
      }
    )
  }
}

export const remove = (Entity) => {

  return (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
      return res.status(404).send({
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
      console.log(`${Entity.modelName} was removed`);

    }).catch( (e) => {
      console.error(`Error has occurred while deleting ${Entity.modelName}`, e);
      res.status(404).send(e)
    });

  }
}

export const getAll = (Entity) => {

  return (req, res) => {
    const filter_id = Entity.modelName == 'Company' ? req.user._id : req.user.company_id ;
    Entity.getAll(filter_id).then(
      (entities) => {
        res.send(entities);
        console.log(`${Entity.modelName} items were sent`);
      }, e => {
        res.status(404).send(e);
        console.error(`Error has occurred while sending ${Entity.modelName} items`, e);
      }
    );
  }
}
