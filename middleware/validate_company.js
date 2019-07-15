const Company = require('../models/company');
const async_handler = require('express-async-handler')

const validate_company = async_handler (async (req, res, next) => {
    const user = req.user;
    if(!user.selected_company_id || user.selected_company_id == null){
      return next({
        message: 'User does not belong to any company',
        http_code: 401
      })
    }
    Company.findById(user.selected_company_id).then(
      doc => {
        if(!doc){
          user.removeCompany(user.selected_company_id);
          return next({
            message: 'Company does not exists anymore',
            http_code: 404
          });
        }
        let result = doc.users.find(u => u.equals(user._id))
        if(!result){
          return next({
            message: 'User does not belong to that company',
            http_code: 401
          });
        }
        req.body.company_id = user.selected_company_id;
        req.company = doc;
        next();
      }
    );
})


module.exports = validate_company;
