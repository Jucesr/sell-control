const _ = require('lodash');
const fs = require('fs');

module.exports = () => {


    let files = fs.readdirSync(__dirname)

    files = _.pull(files, '_index.js', '_crud.js')
    
    let controllers = {}
    
    files.forEach(file => {
        const filename = file.substring(0, file.length - 3)
        controllers[filename] = require(`./${file}`)
    })

    return controllers

}