'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('mongodb'),
    ObjectID = _require.ObjectID;

var jwt = require('jsonwebtoken');

var _require2 = require('../models/client'),
    Client = _require2.Client;

var _require3 = require('../models/supplier'),
    Supplier = _require3.Supplier;

var _require4 = require('../models/user'),
    User = _require4.User;

var _require5 = require('../models/product'),
    Product = _require5.Product;

var _require6 = require('../models/company'),
    Company = _require6.Company;

var clientOneID = new ObjectID();
var clientTwoID = new ObjectID();
var supplierOneID = new ObjectID();
var supplierTwoID = new ObjectID();
var supplierThreeID = new ObjectID();
var productOneID = new ObjectID();
var productTwoID = new ObjectID();
var productThreeID = new ObjectID();

var userOneId = new ObjectID();
var userTwoId = new ObjectID();
var userThreeId = new ObjectID();
var userFourId = new ObjectID();

var companyOneID = new ObjectID();
var companyTwoID = new ObjectID();

var expiredToken = jwt.sign({ _id: new ObjectID(), access: 'auth' }, process.env.JWT_SECRET).toString();

var companies = [{
  _id: companyOneID,
  user_owner_id: userOneId,
  users: [userOneId, userThreeId, userFourId],
  max_users: 5,
  name: 'Addidas'
}, {
  _id: companyTwoID,
  user_owner_id: userThreeId,
  users: [userThreeId, userFourId],
  max_users: 2,
  name: 'Nike'
}];

var clients = [{
  _id: clientOneID,
  first_name: 'Julio',
  last_name: 'Ojeda',
  address: 'Oviedo #1081, Gran venecia',
  email: 'jcom.94m@gmail.com',
  company_id: companyOneID,
  phone: '6861449471'
}, {
  _id: clientTwoID,
  first_name: 'Ericka',
  last_name: 'Corral',
  address: 'Mar chiquita',
  email: 'eri.12.13@gmail.com',
  company_id: companyTwoID,
  phone: '686144546'
}];

var suppliers = [{
  _id: supplierOneID,
  name: 'Vans',
  contact_name: 'Jesus Perez',
  address: '21st Hub Mall, Calexico CA',
  email: 'jesus.perez@vans.com',
  company_id: companyOneID,
  phone: '7748955822'
}, {
  _id: supplierTwoID,
  name: 'Nike',
  contact_name: 'Argelio Sanchez',
  address: '101 Olie Ave, Calexico CA',
  email: 'argelio.sanchez@nike.com',
  company_id: companyOneID,
  phone: '74487988955'
}];

var users = [{
  _id: userOneId,
  username: 'jucesr',
  email: 'julio@example.com',
  password: 'mypassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString()
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
    token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userThreeId,
  username: 'juanito',
  email: 'juanito@example.com',
  password: 'mypassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userThreeId, access: 'auth' }, process.env.JWT_SECRET).toString()
  }],
  selected_company_id: companyTwoID,
  companies: [companyOneID, companyTwoID]
}, {
  _id: userFourId,
  username: 'ericka',
  email: 'ericka@example.com',
  password: 'mypassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userFourId, access: 'auth' }, process.env.JWT_SECRET).toString()
  }],
  selected_company_id: companyOneID,
  companies: [companyOneID, companyTwoID]
}];

var products = [{
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
}, {
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
}, {
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
}];

var populateClients = function populateClients(done) {
  Client.remove({}).then(function () {
    return Client.insertMany(clients);
  }).then(function () {
    done();
  }).catch(function (e) {
    done(e);
  });
};

var populateSuppliers = function populateSuppliers(done) {
  Supplier.remove({}).then(function () {
    return Supplier.insertMany(suppliers);
  }).then(function () {
    done();
  }).catch(function (e) {
    done(e);
  });
};

var populateProducts = function populateProducts(done) {
  Product.remove({}).then(function () {
    return Product.insertMany(products);
  }).then(function () {
    done();
  }).catch(function (e) {
    done(e);
  });
};

var populateUsers = function populateUsers(done) {

  User.remove({}).then(function () {

    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    var userThree = new User(users[2]).save();
    var userFour = new User(users[3]).save();
    return _promise2.default.all([userOne, userTwo, userThree, userFour]);
  }).then(function () {
    return done();
  });
};

var populateCompanies = function populateCompanies(done) {

  Company.remove({}).then(function () {
    return Company.insertMany(companies);
  }).then(function () {
    done();
  }).catch(function (e) {
    done(e);
  });
};

module.exports = {
  companies: companies,
  users: users,
  suppliers: suppliers,
  clients: clients,
  products: products,
  populateClients: populateClients,
  populateUsers: populateUsers,
  populateCompanies: populateCompanies,
  populateSuppliers: populateSuppliers,
  populateProducts: populateProducts,
  companyOneID: companyOneID,
  companyTwoID: companyTwoID,
  supplierOneID: supplierOneID,
  supplierTwoID: supplierTwoID,
  supplierThreeID: supplierThreeID,
  expiredToken: expiredToken
};
//# sourceMappingURL=seed.js.map