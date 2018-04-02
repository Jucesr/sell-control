require('./config/config');
require('./db/mongoose');

const path = require('path')
const express = require('express')
const clients = require('./routers/clients');
const suppliers = require('./routers/supplier');

const app = express()
const port = process.env.PORT || 3000
const publicPath = path.join(__dirname,'..','public')



app.use(express.static(publicPath))

app.use('/api/client', clients);
app.use('/api/supplier', suppliers);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(publicPath, 'index.html'))
// })

app.listen(port, ()=> {
  console.log(`Server runing in ${port}`)
})
