const request = require('supertest');
const {app} = require('../../server');
const {User} = require('../../models/user');
jest.setTimeout(30000);

const {
  users,
  companies,
  populateUsers,
  populateCompanies,
  expiredToken,
  companyOneID,
  companyTwoID
} = require('../seed');


beforeAll(populateCompanies);
beforeEach(populateUsers);

describe('POST', () => {

  let new_user = {
    username: 'julio',
    email: 'julio@hotmail.com',
    password: 'mypassword',
  }

  it('should create a new user and get a token', (done) => {

    request(app)
      .post('/api/user')
      .send(new_user)
      .expect(200)
      .expect( (res) =>{
        expect(res.headers['x-auth']).toBeDefined();
        expect(res.body.email).toBe(new_user.email);
      })
      .end( (err, res) =>{
        if(err){
          return done(err);
        }

        User.find({email: new_user.email}).then( (users) => {
          expect(users.length).toBe(1);
          expect(users[0].email).toBe(new_user.email);
          done();
        }).catch( (e) => done(e) );
      })
  });

  it('should not create an user with invalid email', (done) => {

    let user = {...new_user};
    user.email = 'myvalidemailexample.com';

    request(app)
      .post('/api/user')
      .send(user)
      .expect(400)
      .end(done);
  });

  it('should not create an user with duplicated email', (done) => {

    let user = {...new_user};
    user.email = 'julio@example.com';

    request(app)
      .post('/api/user')
      .send(user)
      .expect(400)
      .end(done);
  });

  it('should not create an user with duplicated username', (done) => {

    let user = {...new_user};
    user.username = 'jucesr';

    request(app)
      .post('/api/user')
      .send(user)
      .expect(400)
      .end(done);
  });

  it('should not create a new user with missing email', (done) => {

    let user = {...new_user};
    delete user.email;

      request(app)
        .post('/api/user')
        .send(user)
        .expect(400)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });


});

describe('POST /login', () => {

  it('should log in with email', (done) => {

      let user = {...users[0]};
      delete user.username;

      request(app)
        .post('/api/user/login')
        .send(user)
        .expect(200)
        .expect( (res) =>{
          expect(res.headers['x-auth']).toBeDefined();
          expect(res.body.email).toBe(user.email);
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          User.find({email: user.email}).then( (users) => {
            expect(users[0].tokens.length).toBe(2);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should log in with username', (done) => {

      let user = {...users[0]};
      delete user.email;

      request(app)
        .post('/api/user/login')
        .send(user)
        .expect(200)
        .expect( (res) =>{
          expect(res.headers['x-auth']).toBeDefined();
          expect(res.body.username).toBe(user.username);
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          User.find({username: user.username}).then( (users) => {
            expect(users[0].tokens.length).toBe(2);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not log in with missing credentials', (done) => {

      let user = {...users[0]};
      delete user.email;
      delete user.username;

      request(app)
        .post('/api/user/login')
        .send(user)
        .expect(400)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not log in with incorrect password', (done) => {

      let user = {...users[0]};
      user.password = 'thisisnotthepassword';

      request(app)
        .post('/api/user/login')
        .send(user)
        .expect(400)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should log in with token', (done) => {

      let token = users[0].tokens[0].token;
      request(app)
        .post('/api/user/login/token')
        // .set('x-auth', token)
        .send({token})
        .expect(200)
        .expect( (res) =>{
          expect(res.body.email).toBe(users[0].email);
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          User.find({email: users[0].email}).then( (users) => {
            expect(users[0].tokens.length).toBe(1);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not log in with invalid token', (done) => {

      let token = expiredToken;
      request(app)
        .post('/api/user/login/token')
        // .set('x-auth', token)
        .send({token})
        .expect(400)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

});

describe('PATCH', () => {

  it('should update an user\'s selected_company_id ', (done) => {
      const updated_user = {
        selected_company_id: companyTwoID
      }
      let token = users[2].tokens[0].token;
      let _id = users[2]._id;

      request(app)
        .patch(`/api/user/me`)
        .set('x-auth', token)
        .send(updated_user)
        .expect(200)
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          User.find({_id}).then( (users) => {
            expect(users.length).toBe(1);
            expect(users[0].selected_company_id).toEqual(updated_user.selected_company_id);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not update an user\'s selected_company_id if its invalid', (done) => {
      const updated_user = {
        selected_company_id: 'invalidID'
      }
      let token = users[2].tokens[0].token;
      let _id = users[2]._id;

      request(app)
        .patch(`/api/user/me`)
        .set('x-auth', token)
        .send(updated_user)
        .expect(404)
        .expect( (res) =>{
           expect(res.body.error).toBeDefined();
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          User.find({_id: _id}).then( (users) => {
            expect(users.length).toBe(1);
            expect(users[0].selected_company_id).toEqual(companyTwoID);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not update an user\'s selected_company_id if company_id is not in the list of avaliable companies', (done) => {
      const updated_user = {
        selected_company_id: companyTwoID
      }
      let token = users[0].tokens[0].token;
      let _id = users[0]._id;

      request(app)
        .patch(`/api/user/me`)
        .set('x-auth', token)
        .send(updated_user)
        .expect(404)
        .expect( (res) =>{
           expect(res.body.error).toBeDefined();
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          User.find({_id: _id}).then( (users) => {
            expect(users.length).toBe(1);
            expect(users[0].selected_company_id).toEqual(companyOneID);
            done();
          }).catch( (e) => done(e) );
        })
  });

});

describe('DELETE', () => {

  it('should log off an user ', (done) => {

      let token = users[0].tokens[0].token;
      let _id = users[0]._id;

      request(app)
        .delete('/api/user/login/token')
        .set('x-auth', token)
        .expect(200)
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          User.find({_id}).then( (users) => {
            expect(users[0].tokens.length).toBe(0);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not log off an user if token is invalid', (done) => {

      let token = 'thisisnotavalidtoken';

      request(app)
        .delete('/api/user/login/token')
        .set('x-auth', token)
        .expect(401)
        .end(done)
  });

  it('should remove an user ', (done) => {

      let token = users[0].tokens[0].token;
      let email = users[0].email;

      request(app)
        .delete(`/api/user/`)
        .set('x-auth', token)
        .expect(200)
        .expect( (res) =>{
          expect(res.body.email).toBe(users[0].email);
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          User.find({email}).then( (users) => {
            expect(users.length).toBe(0);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not remove an user if token is invalid or missing', (done) => {

      let email = users[0].email;

      request(app)
        .delete(`/api/user/`)
        .expect(401)
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          User.find({email}).then( (users) => {
            expect(users.length).toBe(1);
            done();
          }).catch( (e) => done(e) );
        })
  });

});
