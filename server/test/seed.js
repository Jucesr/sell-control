const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Client} = require('../models/client');
// const {User} = require('../models/user');

const clientOneID = new ObjectID();
const clientTwoID = new ObjectID();

const clients = [{
    _id: clientOneID,
    fist_name: 'Julio',
    last_name: 'Ojeda',
    address: 'Oviedo #1081, Gran venecia',
    email: 'jcom.94m@gmail.com',
    company_id: "001",
    phone: '6861449471'
  },{
    _id: clientTwoID,
    fist_name: 'Ericka',
    last_name: 'Corral',
    address: 'Mar chiquita',
    email: 'eri.12.13@gmail.com',
    company_id: "001",
    phone: '686144546'
  }]

// const users = [{
//     _id: userOneId,
//     email: 'julio@example.com',
//     password: 'mypassword',
//     tokens: [{
//       access: 'auth',
//       token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
//       }]
//   }, {
//     _id: userTwoId,
//     email: 'cesar@example.com',
//     password: 'myotherpassword',
//     tokens: [{
//       access: 'auth',
//       token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
//       }]
//     }
//   ]
//
// const todos = [{
//   _id: new ObjectID(),
//   text: "First test todo",
//   _creator: userOneId
//   },{
//   _id: new ObjectID(),
//   text: "Second test todos",
//   completed: true,
//   completedAt: 333,
//   _creator: userTwoId
// }];

const populateClients = done =>{
  Client.remove({
  }).then( () => {
    return Client.insertMany(clients);
  }).then( () => {
    done();
  }).catch( (e) => {
    done(e);
  });
};

// const populateUsers = (done) =>{
//   User.remove({}).then( () =>{
//     var userOne = new User(users[0]).save();
//     var userTwo = new User(users[1]).save();
//
//     return Promise.all([userOne, userTwo]);
//   }).then( () => done() );
// }

module.exports = {
  clients,
  populateClients
  // populateUsers
}
