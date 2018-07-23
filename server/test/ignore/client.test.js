'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('supertest');

var _require = require('../../server'),
    app = _require.app;

var _require2 = require('../../models/client'),
    Client = _require2.Client;

jest.setTimeout(30000);

var _require3 = require('../seed'),
    users = _require3.users,
    clients = _require3.clients,
    companies = _require3.companies,
    populateUsers = _require3.populateUsers,
    populateClients = _require3.populateClients,
    populateCompanies = _require3.populateCompanies;

beforeAll(populateUsers);
beforeAll(populateCompanies);
beforeEach(populateClients);

describe('POST', function () {
  var new_client = {
    first_name: "Gaby",
    last_name: "Corral",
    address: "",
    email: "gabriela@gmail.com",
    phone: "686144546"
  };

  it('should create a new client', function (done) {

    var token = users[0].tokens[0].token;

    request(app).post('/api/client').set('x-auth', token).send(new_client).expect(200).expect(function (res) {
      expect(res.body.email).toBe(new_client.email);
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Client.find({ email: new_client.email }).then(function (clients) {
        expect(clients.length).toBe(1);
        expect(clients[0].email).toBe(new_client.email);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not create a new client if user is not logged', function (done) {
    var token = users[1].tokens[0].token;

    request(app).post('/api/client').send(new_client).expect(401).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not create a new client with user that does have a company id', function (done) {
    var token = users[1].tokens[0].token;

    request(app).post('/api/client').set('x-auth', token).send(new_client).expect(401).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not create a new client with missing fields', function (done) {

    var client = (0, _extends3.default)({}, new_client);
    delete client.first_name;

    var token = users[0].tokens[0].token;

    request(app).post('/api/client').set('x-auth', token).send(client).expect(400).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not create a new client with duplicated email', function (done) {

    var client = (0, _extends3.default)({}, new_client);
    client.email = 'jcom.94m@gmail.com';

    var token = users[0].tokens[0].token;

    request(app).post('/api/client').set('x-auth', token).send(client).expect(400).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not create a new client with invalid email', function (done) {
    var client = (0, _extends3.default)({}, new_client);
    client.email = 'invalidemail';
    var token = users[0].tokens[0].token;

    request(app).post('/api/client').set('x-auth', token).send(client).expect(400).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });
});

describe('PATCH', function () {
  it('should update a client ', function (done) {
    var updated_client = {
      first_name: 'Cesar',
      last_name: 'Ojeda',
      address: 'This is a new address',
      email: 'jcom.94m@gmail.com',
      phone: '6861995468'
    };
    var token = users[0].tokens[0].token;
    var _id = clients[0]._id;

    request(app).patch('/api/client/' + _id).set('x-auth', token).send(updated_client).expect(200).expect(function (res) {
      expect(res.body).toMatchObject(updated_client);
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Client.find({ email: updated_client.email }).then(function (clients) {
        expect(clients.length).toBe(1);
        expect(clients[0].phone).toBe(updated_client.phone);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not update a client if user is not logged', function (done) {
    var updated_client = {
      first_name: 'Cesar',
      last_name: 'Ojeda',
      address: 'This is a new address',
      email: 'jcom.94m@gmail.com',
      phone: '6861995468'
    };
    var _id = clients[0]._id;

    request(app).patch('/api/client/' + _id).send(updated_client).expect(401).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not update a client that does not belong to user company', function (done) {
    var updated_client = {
      first_name: 'Cesar',
      last_name: 'Ojeda',
      address: 'This is a new address',
      email: 'jcom.94m@gmail.com',
      phone: '6861995468'
    };
    var token = users[2].tokens[0].token;
    var _id = clients[0]._id;

    request(app).patch('/api/client/' + _id).set('x-auth', token).send(updated_client).expect(404).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Client.find({ email: updated_client.email }).then(function (clients) {
        expect(clients.length).toBe(1);
        expect(clients[0]).not.toBe(updated_client);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });
});

describe('DELETE', function () {
  it('should remove a client ', function (done) {

    var token = users[0].tokens[0].token;
    var email = clients[0].email;
    var _id = clients[0]._id;

    request(app).delete('/api/client/' + _id).set('x-auth', token).expect(200).expect(function (res) {
      expect(res.body._id).toBe(clients[0]._id.toString());
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Client.find({ email: email }).then(function (clients) {
        expect(clients.length).toBe(0);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not remove a client if user is not logged', function (done) {

    var token = users[0].tokens[0].token;
    var email = clients[0].email;
    var _id = clients[0]._id;

    request(app).delete('/api/client/' + _id).expect(401).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Client.find({ email: email }).then(function (clients) {
        expect(clients.length).toBe(1);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not remove a client if user does not belong to the same company of the client', function (done) {

    var token = users[0].tokens[0].token;
    var email = clients[0].email;
    var _id = clients[1]._id;

    request(app).delete('/api/client/' + _id).set('x-auth', token).expect(404).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Client.find({ email: email }).then(function (clients) {
        expect(clients.length).toBe(1);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });
});

describe('GET', function () {

  it('should fetch all clients that belong to a company', function (done) {
    var token = users[0].tokens[0].token;
    request(app).get('/api/client/').set('x-auth', token).expect(200).expect(function (res) {
      expect(res.body.length).toBe(1);
    }).end(done);
  });

  it('should not fetch any client if user is not logged', function (done) {

    request(app).get('/api/client/').expect(401).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should fetch a client if user belongs to that company', function (done) {

    var token = users[0].tokens[0].token;
    var id = clients[0]._id;

    request(app).get('/api/client/' + id).set('x-auth', token).expect(200).expect(function (res) {
      expect(res.body._id).toBe(id.toString());
    }).end(done);
  });

  it('should not fetch a client if user does not belong to that company', function (done) {

    var token = users[0].tokens[0].token;
    var id = clients[1]._id;

    request(app).get('/api/client/' + id).set('x-auth', token).expect(404).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });
});
//# sourceMappingURL=client.test.js.map