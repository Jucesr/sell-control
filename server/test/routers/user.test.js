'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('supertest');

var _require = require('../../server'),
    app = _require.app;

var _require2 = require('../../models/user'),
    User = _require2.User;

jest.setTimeout(30000);

var _require3 = require('../seed'),
    users = _require3.users,
    companies = _require3.companies,
    populateUsers = _require3.populateUsers,
    populateCompanies = _require3.populateCompanies,
    expiredToken = _require3.expiredToken,
    companyOneID = _require3.companyOneID,
    companyTwoID = _require3.companyTwoID;

beforeAll(populateCompanies);
beforeEach(populateUsers);

describe('POST', function () {

  var new_user = {
    username: 'julio',
    email: 'julio@hotmail.com',
    password: 'mypassword'
  };

  it('should create a new user and get a token', function (done) {

    request(app).post('/api/user').send(new_user).expect(200).expect(function (res) {
      expect(res.headers['x-auth']).toBeDefined();
      expect(res.body.email).toBe(new_user.email);
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      User.find({ email: new_user.email }).then(function (users) {
        expect(users.length).toBe(1);
        expect(users[0].email).toBe(new_user.email);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not create an user with invalid email', function (done) {

    var user = (0, _extends3.default)({}, new_user);
    user.email = 'myvalidemailexample.com';

    request(app).post('/api/user').send(user).expect(400).end(done);
  });

  it('should not create an user with duplicated email', function (done) {

    var user = (0, _extends3.default)({}, new_user);
    user.email = 'julio@example.com';

    request(app).post('/api/user').send(user).expect(400).end(done);
  });

  it('should not create an user with duplicated username', function (done) {

    var user = (0, _extends3.default)({}, new_user);
    user.username = 'jucesr';

    request(app).post('/api/user').send(user).expect(400).end(done);
  });

  it('should not create a new user with missing email', function (done) {

    var user = (0, _extends3.default)({}, new_user);
    delete user.email;

    request(app).post('/api/user').send(user).expect(400).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });
});

describe('POST /login', function () {

  it('should log in with email', function (done) {

    var user = (0, _extends3.default)({}, users[0]);
    delete user.username;

    request(app).post('/api/user/login').send(user).expect(200).expect(function (res) {
      expect(res.headers['x-auth']).toBeDefined();
      expect(res.body.email).toBe(user.email);
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      User.find({ email: user.email }).then(function (users) {
        expect(users[0].tokens.length).toBe(2);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should log in with username', function (done) {

    var user = (0, _extends3.default)({}, users[0]);
    delete user.email;

    request(app).post('/api/user/login').send(user).expect(200).expect(function (res) {
      expect(res.headers['x-auth']).toBeDefined();
      expect(res.body.username).toBe(user.username);
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      User.find({ username: user.username }).then(function (users) {
        expect(users[0].tokens.length).toBe(2);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not log in with missing credentials', function (done) {

    var user = (0, _extends3.default)({}, users[0]);
    delete user.email;
    delete user.username;

    request(app).post('/api/user/login').send(user).expect(400).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not log in with incorrect password', function (done) {

    var user = (0, _extends3.default)({}, users[0]);
    user.password = 'thisisnotthepassword';

    request(app).post('/api/user/login').send(user).expect(400).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should log in with token', function (done) {

    var token = users[0].tokens[0].token;
    request(app).post('/api/user/login/token')
    // .set('x-auth', token)
    .send({ token: token }).expect(200).expect(function (res) {
      expect(res.body.email).toBe(users[0].email);
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      User.find({ email: users[0].email }).then(function (users) {
        expect(users[0].tokens.length).toBe(1);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not log in with invalid token', function (done) {

    var token = expiredToken;
    request(app).post('/api/user/login/token')
    // .set('x-auth', token)
    .send({ token: token }).expect(400).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });
});

describe('PATCH', function () {

  it('should update an user\'s selected_company_id ', function (done) {
    var updated_user = {
      selected_company_id: companyTwoID
    };
    var token = users[2].tokens[0].token;
    var _id = users[2]._id;

    request(app).patch('/api/user/me').set('x-auth', token).send(updated_user).expect(200).end(function (err, res) {
      if (err) {
        return done(err);
      }

      User.find({ _id: _id }).then(function (users) {
        expect(users.length).toBe(1);
        expect(users[0].selected_company_id).toEqual(updated_user.selected_company_id);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not update an user\'s selected_company_id if its invalid', function (done) {
    var updated_user = {
      selected_company_id: 'invalidID'
    };
    var token = users[2].tokens[0].token;
    var _id = users[2]._id;

    request(app).patch('/api/user/me').set('x-auth', token).send(updated_user).expect(404).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      User.find({ _id: _id }).then(function (users) {
        expect(users.length).toBe(1);
        expect(users[0].selected_company_id).toEqual(companyTwoID);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not update an user\'s selected_company_id if company_id is not in the list of avaliable companies', function (done) {
    var updated_user = {
      selected_company_id: companyTwoID
    };
    var token = users[0].tokens[0].token;
    var _id = users[0]._id;

    request(app).patch('/api/user/me').set('x-auth', token).send(updated_user).expect(404).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      User.find({ _id: _id }).then(function (users) {
        expect(users.length).toBe(1);
        expect(users[0].selected_company_id).toEqual(companyOneID);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });
});

describe('DELETE', function () {

  it('should log off an user ', function (done) {

    var token = users[0].tokens[0].token;
    var _id = users[0]._id;

    request(app).delete('/api/user/login/token').set('x-auth', token).expect(200).end(function (err, res) {
      if (err) {
        return done(err);
      }

      User.find({ _id: _id }).then(function (users) {
        expect(users[0].tokens.length).toBe(0);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not log off an user if token is invalid', function (done) {

    var token = 'thisisnotavalidtoken';

    request(app).delete('/api/user/login/token').set('x-auth', token).expect(401).end(done);
  });

  it('should remove an user ', function (done) {

    var token = users[0].tokens[0].token;
    var email = users[0].email;

    request(app).delete('/api/user/').set('x-auth', token).expect(200).expect(function (res) {
      expect(res.body.email).toBe(users[0].email);
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      User.find({ email: email }).then(function (users) {
        expect(users.length).toBe(0);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not remove an user if token is invalid or missing', function (done) {

    var email = users[0].email;

    request(app).delete('/api/user/').expect(401).end(function (err, res) {
      if (err) {
        return done(err);
      }

      User.find({ email: email }).then(function (users) {
        expect(users.length).toBe(1);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });
});
//# sourceMappingURL=user.test.js.map