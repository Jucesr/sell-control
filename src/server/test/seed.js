const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Client} = require('../models/client');
const {Supplier} = require('../models/supplier');
const {User} = require('../models/user');
const {Product} = require('../models/product');
const {Company} = require('../models/company');

const clientOneID = new ObjectID();
const clientTwoID = new ObjectID();
const supplierOneID = new ObjectID();
const supplierTwoID = new ObjectID();
const supplierThreeID = new ObjectID();
const productOneID = new ObjectID();
const productTwoID = new ObjectID();
const productThreeID = new ObjectID();

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();
const userFourId = new ObjectID();

const companyOneID = new ObjectID();
const companyTwoID = new ObjectID();

const expiredToken = jwt.sign({_id: new ObjectID(), access: 'auth'}, process.env.JWT_SECRET).toString();

const companies = [{
    _id: companyOneID,
    user_owner_id: userOneId,
    users: [userOneId, userThreeId, userFourId],
    max_users: 5,
    name: 'Addidas'
  },{
    _id: companyTwoID,
    user_owner_id: userThreeId,
    users: [userThreeId, userFourId],
    max_users: 2,
    name: 'Nike'
  }]

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

const suppliers = [{
    _id: supplierOneID,
    name: 'Vans',
    contact_name: 'Jesus Perez',
    address: '21st Hub Mall, Calexico CA',
    email: 'jesus.perez@vans.com',
    company_id: companyOneID,
    phone: '7748955822'
  },{
    _id: supplierTwoID,
    name: 'Nike',
    contact_name: 'Argelio Sanchez',
    address: '101 Olie Ave, Calexico CA',
    email: 'argelio.sanchez@nike.com',
    company_id: companyOneID,
    phone: '74487988955'
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
    selected_company_id: companyOneID,
    companies: [companyOneID]
  }, {
    _id: userTwoId,
    username: 'cesarxd',
    email: 'cesar@example.com',
    password: 'mypassword',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },{
    _id: userThreeId,
    username: 'juanito',
    email: 'juanito@example.com',
    password: 'mypassword',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userThreeId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }],
    selected_company_id: companyTwoID,
    companies: [companyOneID, companyTwoID]
  },{
    _id: userFourId,
    username: 'ericka',
    email: 'ericka@example.com',
    password: 'mypassword',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userFourId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }],
    selected_company_id: companyOneID,
    companies: [companyOneID, companyTwoID]
    }
  ]

const products = [{
    _id: productOneID,
    company_id: companyOneID,
    supplier_id: supplierOneID,
    code: '001',
    name: 'Black shoe',
    description: '',
    uom: 'pair',
    cost: 10.99,
    price: 34.99,
    stock: 0
  },{
    _id: productTwoID,
    company_id: companyOneID,
    supplier_id: supplierTwoID,
    code: '002',
    name: 'White shoe',
    description: '',
    uom: 'pair',
    cost: 15.99,
    price: 45.99,
    stock: 10
  },{
    _id: productThreeID,
    company_id: companyTwoID,
    supplier_id: supplierTwoID,
    code: '004',
    name: 'T-shirt blue',
    description: '',
    uom: 'pair',
    cost: 15.99,
    price: 45.99,
    stock: 10
  }]

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

const populateSuppliers = done =>{
  Supplier.remove({
  }).then( () => {
    return Supplier.insertMany(suppliers);
  }).then( () => {
    done();
  }).catch( (e) => {
    done(e);
  });
};

const populateProducts = done =>{
  Product.remove({
  }).then( () => {
    return Product.insertMany(products);
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
    var userFour = new User(users[3]).save();
    return Promise.all([userOne, userTwo, userThree, userFour]);

  }).then( () => done() );
}

const populateCompanies = (done) =>{

  Company.remove({
  }).then( () => {
    return Company.insertMany(companies);
  }).then( () => {
    done();
  }).catch( (e) => {
    done(e);
  });

}


module.exports = {
  companies,
  users,
  suppliers,
  clients,
  products,
  populateClients,
  populateUsers,
  populateCompanies,
  populateSuppliers,
  populateProducts,
  companyOneID,
  companyTwoID,
  supplierOneID,
  supplierTwoID,
  supplierThreeID,
  expiredToken
}