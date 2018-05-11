export const verify_company = (req, res, next) => {
  const user = req.user;

  if(!user.default_company_id){
      res.status(401).send({
        error: 'User does not belong to a company'
      });
  }else{
    req.body.company_id = user.default_company_id
    next();
  }
};
