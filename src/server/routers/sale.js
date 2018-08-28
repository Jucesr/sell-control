import express from 'express'
import bodyParser from 'body-parser'
import {Sale} from '../models/sale'
import {Client} from '../models/client'
import {Product} from '../models/product'

import {authenticate} from '../middleware/authenticate'
import {validate_company} from '../middleware/validate_company'
import {add, remove, update, getByID, getAll} from './_base'
import {error_handler} from '../middleware/error_handler'

const router = express.Router()

router.use(bodyParser.json())
router.use(authenticate)
router.use(validate_company)

//  Middlware especific to this route.

const validate_data = (req, res, next) => {
  //  This function validate that client_id is valid on the database.
  //  It also validate that all the products in sale_details are on the database as well.
  //  Plus, If all products are valid it will attached unit rate and code to the sale object.

  req.body.user_id = req.user._id

  const {company_id, client_id, sale_details} = req.body

  //  A promise to validate client_id, it could be undefined but if defined it will check its on the database
  const validateClientId = new Promise(async (resolve, reject) => {
    if(!!client_id){

      const doc = await Client.findOne({
        _id: client_id,
        company_id
      })

      if(!doc)
        reject({
          message: `Client was not found`,
          http_code: '404'
        })
      resolve()
    }else{
      resolve()
    }

  })

  //  A promise that validates each product in sale_details, the property cannot be empty 
  const validateSaleDetail = new Promise(async (resolve, reject) => {
    
    if(!!sale_details){
      //  An array of promises that search the product in the database.
      let proms = sale_details.map(
        sale_detail => {
          
          return Product.findOne({
            _id: sale_detail.product_id,
            company_id
          }).then(product => {
            if(product){
              sale_detail.unit_rate = product.price
              sale_detail.code = product.code
              return sale_detail
            }else{
              return null
            }
          }).catch(e => {
            return null
          })

          
        }
      )
        
      let results = await Promise.all(proms)

      //  All promise's result have to be defined
      if(results.every(i => !!i)){
        //  It attached the new sale_details with unit_rate and code
        req.body.sale_details = results
        resolve() 
      }else{
        reject({
          message: `A product was not found`,
          http_code: '404'
        })
      }
    }else{
      // It means sale_details is not defined
      reject({
        message: `Sale details cannot be empty`,
        http_code: '400'
      })
    }
  })

  Promise.all([validateClientId, validateSaleDetail])
    .then( () => next())
    .catch( e => next(e))
}

router.post('/', validate_data, add(Sale) )

router.delete('/:id', remove(Sale))

router.patch('/:id', update(Sale))

router.get('/:id', getByID(Sale))

router.get('/', getAll(Sale))

router.use(error_handler('Sale'))

export default router
