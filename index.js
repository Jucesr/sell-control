require('dotenv').config()

//  Third party libraries
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const dbService = require('./services/db.service');
const {terminalLog} = require('./services/log.service')

const main = async () => {
  //  App configuration
  const port = process.env.port

  //  --------------------------Database connection----------------------------------.

  await dbService()

  //  --------------------------Server configurationn----------------------------------.

  const app = express();  

  // allow cross origin requests, configure to only allow requests from certain origins
  app.use(cors());

  // secure express app
  app.use(helmet({
      dnsPrefetchControl: false,
      frameguard: false,
      ieNoOpen: false,
  }));

  // parsing the request bodys
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(express.static('storage'))

  //  Set root request

  app.get('/', (req, res) => {
      res.send({
          name: 'sell-controll-api',
          version: '1.0'
      })
  })

  //  Controllers
  const controllers = require('./controllers/_index')()

  Object.keys(controllers).forEach(controller => {
      app.use(`/api/${controller}`, controllers[controller]);
      console.log(`/${controller}`);
  })
  
  app.listen(port,
      () => {
      console.log(`Listening on port ${port}`)
      }
  )

  return app;
}

main().then(app => {
  terminalLog('La aplicación ha iniciado correctamente')
}).catch(e => {
  terminalLog('No ha iniciado la aplicación debido a un error')
  console.log(e)
})

