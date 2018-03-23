require('./config/config');
require('./db/mongoose');

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')
const app = express()
const port = process.env.PORT || 3000
const publicPath = path.join(__dirname,'..','public')

const {Client} = require('./models/client');

app.use(express.static(publicPath))
// app.use(bodyParser.json())

app.post('/api/clients', bodyParser.json(), (req, res) => {
  const client = new Client({
    ...req.body
  });

  client.save().then(
    doc => {
      res.send(doc);
      console.log('A client was saved');
    }, e => {
      res.status(400).send(e);
      console.log('Error has occurred');
    }
  )
});

app.delete('/api/clients/:id', bodyParser.json(), (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send('ID has invalid format');
  }

  Client.findOneAndRemove({
    _id: id,
  }).then( (doc) => {

    if(!doc)
      return res.status(404).send('No client was found');

    res.status(200).send(doc);
    console.log('A client was deleted');

  }).catch( (e) => res.status(404).send(e));

});

app.patch('/api/clients/:id', bodyParser.json(), (req, res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id))
    return res.status(404).send('ID has invalid format');

  Client.findOneAndUpdate( {
    _id: id
  }, { $set: req.body}, { new: true }).then(
    (doc) => {
      if(!doc)
        return res.status(404).send('No client was found');
      res.status(200).send(doc);
    }).catch( (e) => {
    res.status(404).send(e);
  } );


});

app.get('/api/clients',  (req, res) => {

  Client.getAll().then(
    (clients) => {
      res.send(clients);
      console.log('Clients were sent');
    }, e => {
      res.status(404).send(e);
      console.log('Error has occurred');
    }
  );
});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(publicPath, 'index.html'))
// })

app.listen(port, ()=> {
  console.log(`Server runing in ${port}`)
})
