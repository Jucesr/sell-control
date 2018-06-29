const express = require('express')
const {ObjectID} = require('mongodb')
const bodyParser = require('body-parser')
const router = express.Router()
const {Product} = require('../models/product')
const {Supplier} = require('../models/supplier')

const {authenticate} = require('../middleware/authenticate')
const {verify_company} = require('../middleware/verify_company')
const {add, remove, update, getByID, getAll} = require('./_base')

const verify_supplier = (req, res, next) => {
  if(!ObjectID.isValid(req.body.supplier_id)){
    return res.status(400).send({
      error: 'Supplier ID has invalid format'
    });
  }
  //VER POST MAN ERROR
  let company_id = req.body.company_id;
  let supplier_id = req.body.supplier_id;

  Supplier.findOne({
    _id: supplier_id,
    company_id
  }).then(
    (doc) => {
      if(!doc)
        return res.status(404).send({
          error: `Supplier was not found`
        });
        next();
    });

}

// middleware that is specific to this router
router.use(bodyParser.json())
router.use(authenticate)
router.use(verify_company)

router.post('/', verify_supplier, add(Product) );

router.delete('/:id', remove(Product));

router.patch('/:id',verify_supplier, update(Product));

router.get('/:id', getByID(Product));

router.get('/', getAll(Product));


module.exports = router
