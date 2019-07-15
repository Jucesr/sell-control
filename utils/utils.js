const errors = require('../config/errors');

const validateRequiredFields = (obj, fieldsToInclude) => {
    let new_entity = {};

    //  Prepare the new entity with all the required fields
    for (let index = 0; index < fieldsToInclude.length; index++) {
        
        let field = fieldsToInclude[index]

        if (obj.hasOwnProperty(field)) {
            new_entity[ field ] = obj[ field ]
        }else{
            throw {
                isCustomError: true,
                body: errors.MISSING_PROPERTY.replace('@PROPERTY', field)
            }
        }

    }

    return new_entity;
}

const replaceAll = (text, search, replacement) => {
    text = text.replace(new RegExp(search, 'g'), replacement);
    return text;
  };

module.exports = {
    validateRequiredFields,
    replaceAll
}