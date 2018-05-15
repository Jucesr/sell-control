const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Client} = require('../models/client');
const {User} = require('../models/user');

const clientOneID = new ObjectID();
const clientTwoID = new ObjectID();
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();

const companyOneID = new ObjectID();
const companyTwoID = new ObjectID();

const clients = [{
    _id: clientOneID,
    first_name: 'Julio',
    last_name: 'Ojeda',
    address: 'Oviedo #1081, Gran venecia',
    email: 'jcom.94m@gmail.com',
    company_id: companyOneID,
    phone: '6861449471'
  },{
    _id: clientTwoID,
    first_name: 'Ericka',
    last_name: 'Corral',
    address: 'Mar chiquita',
    email: 'eri.12.13@gmail.com',
    company_id: companyTwoID,
    phone: '686144546'
  }]

const users = [{
    _id: userOneId,
    username: 'jucesr',
    email: 'julio@example.com',
    password: 'mypassword',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }],
    company_id: companyOneID
  }, {
    _id: userTwoId,
    username: 'cesarxd',
    email: 'cesar@example.com',
    password: 'myotherpassword',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },{
    _id: userThreeId,
    username: 'juanito',
    email: 'juanito@example.com',
    password: 'myotherpassword',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userThreeId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }],
    company_id: companyTwoID
    }
  ]

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

const populateUsers = (done) =>{
  User.remove({}).then( () =>{
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    var userThree = new User(users[2]).save();

    return Promise.all([userOne, userTwo, userThree]);
  }).then( () => done() );
}

module.exports = {
  users,
  populateUsers,
  clients,
  populateClients
  // populateUsers
}
