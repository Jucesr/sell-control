const express = require('express')
const {ObjectID} = require('mongodb')
const bodyParser = require('body-parser')
const router = express.Router()
const {Product} = require('../models/product')
const {Supplier} = require('../models/supplier')

const {authenticate} = require('../middleware/authenticate')
const {verify_company} = require('../middleware/verify_company')
const {add, remove, update, getByID, getAll} = require('./_base')

// middleware that is specific to this router
router.use(bodyParser.json())
router.use(authenticate)
router.use(verify_company)

router.post('/', (req, res, next) => {

  if(!ObjectID.isValid(req.body.supplier_id)){
    return res.status(400).send({
      error: 'Supplier ID has invalid format'
    });
  }
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

}, add(Product) );

router.delete('/:id', remove(Product));

router.patch('/:id',(req, res, next) => {

  if(req.body.supplier_id){
    if(!ObjectID.isValid(req.body.supplier_id)){
      console.log('Invalid id');
      return res.status(400).send({
        error: 'Supplier ID has invalid format'
      });
    }

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
  }else{
    next();
  }

}, update(Product));

router.get('/:id', getByID(Product));

router.get('/', getAll(Product));


module.exports = router
