'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('supertest');

var _require = require('../../server'),
    app = _require.app;

var _require2 = require('../../models/supplier'),
    Supplier = _require2.Supplier;

jest.setTimeout(30000);

var _require3 = require('../seed'),
    users = _require3.users,
    populateUsers = _require3.populateUsers,
    suppliers = _require3.suppliers,
    companies = _require3.companies,
    populateSuppliers = _require3.populateSuppliers,
    populateCompanies = _require3.populateCompanies;

beforeAll(populateUsers);
beforeAll(populateCompanies);
beforeEach(populateSuppliers);

describe('POST', function () {
  var new_supplier = {
    name: 'Adidas',
    contact_name: 'Juan Portillo',
    address: 'Los caracoles #504, Mexicali BC',
    email: 'jp@adidas.com',
    phone: '6869865547'
  };

  it('should create a new supplier', function (done) {

    var token = users[0].tokens[0].token;

    request(app).post('/api/supplier').set('x-auth', token).send(new_supplier).expect(200).expect(function (res) {
      expect(res.body.email).toBe(new_supplier.email);
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Supplier.find({ email: new_supplier.email }).then(function (suppliers) {
        expect(suppliers.length).toBe(1);
        expect(suppliers[0].email).toBe(new_supplier.email);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not create a new supplier if user is not logged', function (done) {

    request(app).post('/api/supplier').send(new_supplier).expect(401).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not create a new supplier with user that does have a company id', function (done) {

    var token = users[1].tokens[0].token;

    request(app).post('/api/supplier').set('x-auth', token).send(new_supplier).expect(401).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not create a new supplier with missing fields', function (done) {
    var sup = (0, _extends3.default)({}, new_supplier);
    delete sup.email;

    var token = users[0].tokens[0].token;

    request(app).post('/api/supplier').set('x-auth', token).send(sup).expect(400).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not create a new supplier with duplicated email', function (done) {

    var sup = (0, _extends3.default)({}, new_supplier);
    sup.email = 'jesus.perez@vans.com';

    var token = users[0].tokens[0].token;

    request(app).post('/api/supplier').set('x-auth', token).send(sup).expect(400).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not create a new supplier with invalid email', function (done) {

    var sup = (0, _extends3.default)({}, new_supplier);
    sup.email = 'jpadidas.om';

    var token = users[0].tokens[0].token;

    request(app).post('/api/supplier').set('x-auth', token).send(sup).expect(400).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });
});

describe('PATCH', function () {
  var updated_supplier = {
    name: 'Vans',
    contact_name: 'Javier Lopez',
    email: 'javier.lopez@vans.com',
    phone: '7787956296'
  };
  it('should update a supplier ', function (done) {

    var token = users[0].tokens[0].token;
    var _id = suppliers[0]._id;

    request(app).patch('/api/supplier/' + _id).set('x-auth', token).send(updated_supplier).expect(200).expect(function (res) {
      expect(res.body).toMatchObject(updated_supplier);
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Supplier.find({ email: updated_supplier.email }).then(function (suppliers) {
        expect(suppliers.length).toBe(1);
        expect(suppliers[0].phone).toBe(updated_supplier.phone);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not update a supplier if user is not logged', function (done) {

    var _id = suppliers[0]._id;

    request(app).patch('/api/supplier/' + _id).send(updated_supplier).expect(401).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not update a supplier that does not belong to user company', function (done) {

    var token = users[2].tokens[0].token;
    var _id = suppliers[0]._id;

    request(app).patch('/api/supplier/' + _id).set('x-auth', token).send(updated_supplier).expect(404).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Supplier.find({ email: updated_supplier.email }).then(function (suppliers) {
        expect(suppliers.length).toBe(0);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });
});

describe('DELETE', function () {
  it('should remove a supplier ', function (done) {

    var token = users[0].tokens[0].token;
    var email = suppliers[0].email;
    var _id = suppliers[0]._id;

    request(app).delete('/api/supplier/' + _id).set('x-auth', token).expect(200).expect(function (res) {
      expect(res.body._id).toBe(suppliers[0]._id.toString());
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Supplier.find({ email: email }).then(function (suppliers) {
        expect(suppliers.length).toBe(0);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not remove a supplier if user is not logged', function (done) {

    var token = users[0].tokens[0].token;
    var email = suppliers[0].email;
    var _id = suppliers[0]._id;

    request(app).delete('/api/supplier/' + _id).expect(401).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Supplier.find({ email: email }).then(function (suppliers) {
        expect(suppliers.length).toBe(1);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });
});

describe('GET', function () {

  it('should fetch all suppliers that belong to a company', function (done) {
    var token = users[0].tokens[0].token;
    request(app).get('/api/supplier/').set('x-auth', token).expect(200).expect(function (res) {
      expect(res.body.length).toBe(2);
    }).end(done);
  });

  it('should not fetch any supplier if user is not logged', function (done) {

    request(app).get('/api/supplier/').expect(401).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should fetch a supplier if user belongs to that company', function (done) {

    var token = users[0].tokens[0].token;
    var id = suppliers[0]._id;
    request(app).get('/api/supplier/' + id).set('x-auth', token).expect(200).expect(function (res) {
      expect(res.body._id).toBe(id.toString());
    }).end(done);
  });

  it('should not fetch a supplier if user does not belong to that company', function (done) {

    var token = users[2].tokens[0].token;
    var id = suppliers[0]._id;

    request(app).get('/api/supplier/' + id).set('x-auth', token).expect(404).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });
});
//# sourceMappingURL=supplier.test.js.map