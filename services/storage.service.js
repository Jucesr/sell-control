const multer  = require('multer')
const fs = require('fs');
const path = require('path');
const {replaceAll} = require('../utils/utils')
// const mimetypes = require('../config/mimetypes');

const storage = multer.diskStorage({
  destination: function (req, body, cb) {
    const item_id = req.params.id
    const folder = path.join(__dirname, '..', 'storage', item_id)
    fs.access(folder, fs.constants.F_OK, (err) => {
      if(err){
        //  Does not exist
        fs.mkdir(folder, {recursive: true}, (err) => {
          if(!err){
            cb(null,  folder) 
          }
        })
      }else{
        //  It exists
        cb(null, folder)
      }
    });
  },
  filename: function (req, file,  cb) {
    const today =  new Date().toISOString().split('-').join('_').substr(0,10)
    const filename = today + '_' + replaceAll(file.originalname, ' ', '_')
    cb(null,  filename)
  }
})

const fileFilter = (req, file, cb) => {
 
  // To accept the file pass `true`, like so:
  //cb(null, file.mimetype == 'application/pdf')
  if(!mimetypes.includes(file.mimetype)){
    cb(null, false)
    cb({
      isCustomError: true,
      body: 'Solo se puede cargar PDF o Word',
    })
  }else{
    cb(null, true)
  }

  
  
 
}

const upload = multer({ 
    storage,
    // fileFilter,
    // limits: {
    //   fileSize: parseInt(process.env.LIMIT_FILE_SIZE) // 15mb
    // } 
})

module.exports = {
  // upload,
  upload: (entity) => {
    return multer({
      storage: multer.diskStorage({
        destination: function (req, body, cb) {
          const item_id = req.params.id
          const folder = path.join(__dirname, '..', 'storage', entity, item_id)
          fs.access(folder, fs.constants.F_OK, (err) => {
            if(err){
              //  Does not exist
              fs.mkdir(folder, {recursive: true}, (err) => {
                if(!err){
                  cb(null,  folder) 
                }
              })
            }else{
              //  It exists
              cb(null, folder)
            }
          });
        },
        filename: function (req, file,  cb) {
          const name_parts = file.originalname.split('.')
          const ext = name_parts[name_parts.length - 1]
          //console.log(ext)
          //const today =  new Date().toISOString().split('-').join('_').substr(0,10)
          //const filename = today + '_' + replaceAll(file.originalname, ' ', '_')
          cb(null, `item.${ext}`)
        }
      })
    })
  }
}