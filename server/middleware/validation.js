var {Client} = require('../models/client');

export const validateClientEmail = function(req, res, next){
  Client.findOne({
    email: req.body.email,
    company_id: req.user.default_company_id
  }).then(
    doc => {
      if(doc){
        res.status(400).send({
          error: 'Duplicated email'
        })
      }else{
        next();
      }

    }
  )
}
