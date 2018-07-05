var {User} = require('../models/user');
var {Company} = require('../models/company');

export const verify_company = (req, res, next) => {
  const user = req.user;

  if(!user.selected_company_id){
      res.status(401).send({
        error: 'User does not belong to a company'
      });
  }else{
    Company.findById(user.selected_company_id).then(
      doc => {
        if(!doc){
          res.status(404).send({
            error: 'Company does not exists'
          });
        }
        let result = doc.users.find(u => u.equals(user._id))
        if(result){
          req.body.company_id = user.selected_company_id
          next();
        }else{
          res.status(401).send({
            error: 'User does not belong to a company'
          });
        }
      }
    );
  }
};
