require('./config/config');
require('./db/mongoose');

const path = require('path')
const express = require('express')
const companies = require('./routers/company')
const clients = require('./routers/client')
const suppliers = require('./routers/supplier')
const products = require('./routers/product')
const users = require('./routers/user')
const sales = require('./routers/sale')

const app = express()
const port = process.env.PORT || 3000
const publicPath = path.join(__dirname,'..','public')



app.use(express.static(publicPath))

app.use('/api/company', companies);
app.use('/api/client', clients);
app.use('/api/supplier', suppliers);
app.use('/api/product', products);
app.use('/api/user', users);
app.use('/api/sale', sales);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(publicPath, 'index.html'))
// })

if (process.env.NODE_ENV !== 'jest') {
  app.listen(port, ()=> {
    console.log(`Server runing in ${port}`)
  })
}
// const server = app.listen(port, ()=> {
//   console.log(`Server runing in ${port}`)
// })

module.exports = {app}
