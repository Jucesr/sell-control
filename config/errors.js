/**
 * @file 
 * Contains all the error messages in the application. 
 */

module.exports = {
    ENTITY_NOT_FOUND: 'Id: @ID -> @ENTITY_NAME no se ha encontrado.',
    FIELD_DUPLICATED: '@VALUE ya existe',
    INTERNAL_ERROR: 'Error interno del servidor, por favor contacta al administrador.',
    INCORRECT_PASSWORD: 'La contraseña o el usuario son incorrectos.',
    MISSING_PROPERTY: 'La propiedad @PROPERTY es obligatoria.',
    MISSING_TOKEN: 'Su sesión ha expidado',
    INVALID_TOKEN: 'Su sesión ha expidado',
    EXPEDIENTE_DUPLICATED: 'El elemento ya existe',
    LIMIT_FILE_SIZE: 'El archivo debe ser menor a 15MB'
}