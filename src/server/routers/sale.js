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

const validate_clientID = (req, res, next) => {
  const {company_id, client_id} = req.body

  //  it could be undefined but if defined it will check its on the database
  
  if(!!client_id){

    Client.findOne({
        _id: client_id,
        company_id
      }
    ).then(
      doc => {
        if(!doc)
          next({
            message: `Client was not found`,
            http_code: '404'
          })
        next()
      }
    ).catch(
      e => next(e)
    )

  }else{
    next()
  }
}

const validate_sale_details = (req, res, next) => {
  //  It validates that sale details is not empty.
  //  it validates values are not negative.
  //  It validates all sale_details 
  //    * product is on the database
  //    * product is in stock
  //    * has positive quantity
  //    * has a valid discount
  const {company_id, sale_details} = req.body

  if(!sale_details){
    // It means sale_details is not defined
    return next({
      message: `Sale details cannot be empty`,
      http_code: '400'
    })
  }
  

  //  An array of promises that search the product in the database.
  let proms = sale_details.map(
    sale_detail => {
      
      return Product.findOne({
        _id: sale_detail.product_id,
        company_id
      }).then(product => {

        if(!product){
          return {
            message: `${sale_detail.product_id} was not found`
          }
        }

        if(sale_detail.quantity <= 0){
          return {
            message: `${sale_detail.product_id} has to have a positive quantity`
          }
        }

        if(sale_detail.discount < 0){
          return {
            message: `${sale_detail.product_id} has to have a positive or 0 discount`
          }
        }

        //  If stock is being track check that is not out of stock
        if(product.stock != -1 && product.stock - sale_detail.quantity < 0){
          return {
            message: `Error in product ${product.code}. Can not sell ${sale_detail.quantity}, only ${product.stock} in stock.`
          }
        }
        //  When product found it takes extra information
        sale_detail = {
          ...sale_detail,
          code: product.code,
          unit_rate: product.price,
          name: product.name,
          uom: product.uom,
          total: (product.price * sale_detail.quantity) - sale_detail.discount
        }
        
        return sale_detail
        
      }).catch(e => {
        return {
          message: `${sale_detail.product_id} was not found`
        }
      })

      
    }
  )
    
  Promise.all(proms).then(
    results => {
      //  Check if all promises were solved without errors
      results.forEach(sale_detail => {
        if(sale_detail.message){
          return next(sale_detail)
        }
      })
      
      //  It attaches the new sale_details with extra information
      req.body.sale_details = results

      //  It gets the final total 

      req.body.total = results.reduce((prev, current) => {
        return prev + current.total
      }, 0)

      next() 
      
    }
  )

}

const add_userID = (req, res, next) => {
  req.body.user_id = req.user._id
  next()
}

router.post('/', add_userID, validate_clientID, validate_sale_details, add(Sale) )

router.delete('/:id', remove(Sale))

router.patch('/:id', update(Sale))

router.get('/:id', getByID(Sale))

router.get('/', getAll(Sale))

router.use(error_handler('Sale'))

export default router
