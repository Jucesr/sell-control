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
