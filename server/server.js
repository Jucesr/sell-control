require('./config/config');
require('./db/mongoose');

const path = require('path')
const express = require('express')
const clients = require('./routers/client');
const suppliers = require('./routers/supplier');
const products = require('./routers/product');

const app = express()
const port = process.env.PORT || 3000
const publicPath = path.join(__dirname,'..','public')



app.use(express.static(publicPath))

app.use('/api/client', clients);
app.use('/api/supplier', suppliers);
app.use('/api/product', products);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(publicPath, 'index.html'))
// })

app.listen(port, ()=> {
  console.log(`Server runing in ${port}`)
})

// import fetch from 'cross-fetch'
//
// const client = {
//   fist_name: 'Julio',
//   last_name: 'Ojeda',
//   address: 'Asti 1411 gran venecia',
//   email: 'jcom.94m@gmail.com',
//   phone: '696839404'
// }
//
// const requestObj = {
//       headers: {
//         'content-type': 'application/json'
//       },
//       method: 'POST',
//       body: client
//     }
//
// fetch('https://localhost:3000/api/client', requestObj)
//   .then(response => response.json())
//   .then(client => console.log(client))
//   .catch(e => console.log(e))
