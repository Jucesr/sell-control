import './config/config.js'
import './db/mongoose'

import path from 'path'
import express from 'express'
import companies from './routers/company'
import clients from './routers/client'
import suppliers from './routers/supplier'
import products from './routers/product'
import users from './routers/user'
import sales from './routers/sale'

const app = express()
const port = process.env.PORT || 3000
const publicPath = path.join(__dirname,'..','public')

app.use(express.static(publicPath))

app.use('/api/company', companies)
app.use('/api/client', clients)
app.use('/api/supplier', suppliers)
app.use('/api/product', products)
app.use('/api/user', users)
app.use('/api/sale', sales)

// app.get('*', (req, res) => {
//   res.sendFile(path.join(publicPath, 'index.html'))
// })

if (process.env.NODE_ENV !== 'jest') {
  app.listen(port, ()=> {
    console.log(`Server runing in ${port}`)
  })
}
// import server = app.listen(port, ()=> {
//   console.log(`Server runing in ${port}`)
// })


module.exports = app
