const async_handler = require('express-async-handler');
const logService = require('../services/log.service');
const utils = require('../utils/utils');

module.exports = (options) => {

    let {
        model: Model,
        router,
        fields,
        middleware,
        exclude = {}
    } = options;

    let fieldsToInclude
    let fieldsToUpdate

    const {
        create: exCreate = false,
        update: exUpdate = false,
        delete: exDelete = false,
        getByID: exGetByID = false,
        getAll: exGetAll = false
    } = exclude

    if(fields){
        fieldsToInclude = fields.toAdd
        fieldsToUpdate = fields.toUpdate
    }
    

    const _create = () => {

        return async_handler(async (req, res, next) => {
 
            let new_entity = fieldsToInclude ? utils.validateRequiredFields(req.body, fieldsToInclude) : req.body;
    
            let stored_entity = await Model._create(new_entity);
    
            res.send(stored_entity);
    
            logService.log(`An ${Model.collection.collectionName} was saved - ${stored_entity._id}`)
    
        })
    };
    
    
    const _delete = () => {
    
        return async_handler(async (req, res, next) => {
            let id = req.params.id;
    
            //  Search entity by ID
            let entity = await Model._delete(id);
    
            res.status(200).send(entity);
            logService.log(`${Model.collection.collectionName} was removed - ${id}`)
    
        })
    };
    
    const _update = () => {
        return async_handler(async (req, res, next) => {
    
            let id = req.params.id;
            let new_entity = {};
            
            if(fieldsToUpdate){
                //  Prepare the new entity only with the fields that can be included
                for (let index = 0; index < fieldsToUpdate.length; index++) {
        
                    let field = fieldsToUpdate[index];
        
                    if (req.body.hasOwnProperty(field)) {
                        new_entity[field] = req.body[field]
                    }
        
                }
            }else{
                new_entity = req.body;
            }
            
    
            let entity = await Model._update(id, new_entity);
    
            res.status(200).send(entity);
            logService.log(`${Model.collection.collectionName} was updated - ${id}`)
    
        })
    };
    
    const _getAll = () => {
    
        return async_handler(async (req, res, next) => {
    
            let entities = await Model._findAll(req);
    
            res.send(entities);
            logService.log(`${Model.collection.collectionName} were sent`)
    
        })
    };
    
    const _getByID = () => {
    
        return async_handler(async (req, res, next) => {
    
            const id = req.params.id;
    
            let entity = await Model._findById(id);
    
            res.status(200).send(entity);
            logService.log(`${Model.collection.collectionName} was sent - ${id}`)
    
        })
    };


    // Overwrite if middleware was provided

    if (middleware != undefined) {

        if (typeof middleware !== "object") {
            throw new Error('Expected middleware to be an Object')
        }

        const operations = ['create', 'delete', 'update', 'getByID', 'getAll']
        Object.keys(middleware).forEach(key => {
            if(!operations.includes(key)){
                throw new Error(`'${key}' is not a valid crud operation, Must use one of \[ ${operations.toString()} \]`)  
            }
        })

        //  Apply it
        !exCreate && router.post('/', middleware.create != undefined ? ([...middleware.create, _create()]) : _create() )
        !exDelete && router.delete('/:id', middleware.delete != undefined ? ([...middleware.delete, _delete()]) : _delete() )
        !exUpdate && router.patch('/:id', middleware.update != undefined ? ([...middleware.update, _update()]) : _update() )
        !exGetByID && router.get('/:id', middleware.getByID != undefined ? ([...middleware.getByID, _getByID()]) : _getByID() )
        !exGetAll && router.get('/', middleware.getAll != undefined ? ([...middleware.getAll, _getAll()]) : _getAll() )

    }else{
        //  No middleware was provided

        !exCreate && router.post('/', _create());

        !exDelete && router.delete('/:id', _delete());

        !exUpdate && router.patch('/:id', _update());

        !exGetByID && router.get('/:id', _getByID());

        !exGetAll && router.get('/', _getAll())
    }


    return router;

};  
