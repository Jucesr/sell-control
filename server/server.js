const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'..','public');

// app.use(express.static(publicPath));

app.use(express.static(publicPath));

const clients = [{
  id: 1,
  fist_name: 'Julio',
  last_name: 'Ojeda',
  address: 'Oviedo #1081, Gran venecia',
  email: 'jcom.94m@gmail.com',
  phone: '6861449471'
},{
  id: 2,
  fist_name: 'Ericka',
  last_name: 'Corral',
  address: 'Mar chiquita',
  email: 'eri.12.13@gmail.com',
  phone: '686144546'
},{
  id: 3,
  fist_name: 'Susana',
  last_name: 'Magdaleno',
  address: 'Parma #1081, Gran venecia',
  email: 'susy3223@gmail.com',
  phone: '6865349434'
}]

app.get('/api/clients', bodyParser.json(),  (req, res) => {
  console.log(clients);
  res.send(clients);


});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(publicPath, 'index.html'));
// });

app.listen(port, ()=> {
  console.log(`Server runing in ${port}`);
});
