const request = require('supertest');
const app = require('../../index');
const {Client} = require('../../models/client');
jest.setTimeout(30000);

const {
  users,
  clients,
  populateUsers,
  populateClients,
  populateCompanies
} = require('../seed');

beforeAll(populateUsers);
beforeAll(populateCompanies);
beforeEach(populateClients);

describe('POST', () => {
  let new_client = {
    first_name: "Gaby",
    last_name: "Corral",
    address: "",
    email: "gabriela@gmail.com",
    phone: "686144546"
  }

  it('should create a new client', (done) => {

    let token = users[0].tokens[0].token;

    request(app)
      .post('/api/client')
      .set('x-auth', token)
      .send(new_client)
      .expect(200)
      .expect( (res) =>{
        expect(res.body.email).toBe(new_client.email);
      })
      .end( (err, res) =>{
        if(err){
          return done(err);
        }

        Client.find({email: new_client.email}).then( (clients) => {
          expect(clients.length).toBe(1);
          expect(clients[0].email).toBe(new_client.email);
          done();
        }).catch( (e) => done(e) );
      })
  });

  it('should not create a new client if user is not logged', (done) => {
      let token = users[1].tokens[0].token;

      request(app)
        .post('/api/client')
        .send(new_client)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not create a new client with user that does have a company id', (done) => {
      let token = users[1].tokens[0].token;

      request(app)
        .post('/api/client')
        .set('x-auth', token)
        .send(new_client)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not create a new client with missing fields', (done) => {

      let client = {...new_client};
      delete client.first_name;

      let token = users[0].tokens[0].token;

      request(app)
        .post('/api/client')
        .set('x-auth', token)
        .send(client)
        .expect(400)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not create a new client with duplicated email', (done) => {

    let client = {...new_client};
    client.email = 'jcom.94m@gmail.com';

    let token = users[0].tokens[0].token;

    request(app)
      .post('/api/client')
      .set('x-auth', token)
      .send(client)
      .expect(400)
      .expect( (res) =>{
        expect(res.body.error).toBeDefined();
      })
      .end(done)
  });

  it('should not create a new client with invalid email', (done) => {
    let client = {...new_client};
    client.email = 'invalidemail';
    let token = users[0].tokens[0].token;

    request(app)
      .post('/api/client')
      .set('x-auth', token)
      .send(client)
      .expect(400)
      .expect( (res) =>{
        expect(res.body.error).toBeDefined();
      })
      .end(done)
  });
});

describe('PATCH', () => {
  it('should update a client ', (done) => {
      const updated_client = {
        first_name: 'Cesar',
        last_name: 'Ojeda',
        address: 'This is a new address',
        email: 'jcom.94m@gmail.com',
        phone: '6861995468'
      }
      let token = users[0].tokens[0].token;
      let _id = clients[0]._id;

      request(app)
        .patch(`/api/client/${_id}`)
        .set('x-auth', token)
        .send(updated_client)
        .expect(200)
        .expect( (res) =>{
          expect(res.body).toMatchObject(updated_client);
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          Client.find({email: updated_client.email}).then( (clients) => {
            expect(clients.length).toBe(1);
            expect(clients[0].phone).toBe(updated_client.phone);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not update a client if user is not logged', (done) => {
      const updated_client = {
        first_name: 'Cesar',
        last_name: 'Ojeda',
        address: 'This is a new address',
        email: 'jcom.94m@gmail.com',
        phone: '6861995468'
      }
      let _id = clients[0]._id;

      request(app)
        .patch(`/api/client/${_id}`)
        .send(updated_client)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not update a client that does not belong to user company', (done) => {
      const updated_client = {
        first_name: 'Cesar',
        last_name: 'Ojeda',
        address: 'This is a new address',
        email: 'jcom.94m@gmail.com',
        phone: '6861995468'
      }
      let token = users[2].tokens[0].token;
      let _id = clients[0]._id;

      request(app)
        .patch(`/api/client/${_id}`)
        .set('x-auth', token)
        .send(updated_client)
        .expect(404)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          Client.find({email: updated_client.email}).then( (clients) => {
            expect(clients.length).toBe(1);
            expect(clients[0]).not.toBe(updated_client);
            done();
          }).catch( (e) => done(e) );
        })
  });
});

describe('DELETE', () => {
  it('should remove a client ', (done) => {

      let token = users[0].tokens[0].token;
      let email = clients[0].email;
      let _id = clients[0]._id;

      request(app)
        .delete(`/api/client/${_id}`)
        .set('x-auth', token)
        .expect(200)
        .expect( (res) =>{
          expect(res.body._id).toBe(clients[0]._id.toString());
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          Client.find({email}).then( (clients) => {
            expect(clients.length).toBe(0);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not remove a client if user is not logged', (done) => {

      let token = users[0].tokens[0].token;
      let email = clients[0].email;
      let _id = clients[0]._id;

      request(app)
        .delete(`/api/client/${_id}`)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          Client.find({email}).then( (clients) => {
            expect(clients.length).toBe(1);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not remove a client if user does not belong to the same company of the client', (done) => {

      let token = users[0].tokens[0].token;
      let client = clients[1];

      request(app)
        .delete(`/api/client/${client._id}`)
        .set('x-auth', token)
        .expect(404)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          Client.find({_id: client._id}).then( (clients) => {
            expect(clients.length).toBe(1);
            done();
          }).catch( (e) => done(e) );
        })
  });
});

describe('GET', () => {

  it('should fetch all clients that belong to a company', (done) => {
      let token = users[0].tokens[0].token;
      request(app)
        .get(`/api/client/`)
        .set('x-auth', token)
        .expect(200)
        .expect( (res) =>{
          expect(res.body.length).toBe(1);
        })
        .end(done)
  });

  it('should not fetch any client if user is not logged', (done) => {

      request(app)
        .get(`/api/client/`)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined()
        })
        .end(done)
  });

  it('should fetch a client if user belongs to that company', (done) => {

      let token = users[0].tokens[0].token;
      let id = clients[0]._id;

      request(app)
        .get(`/api/client/${id}`)
        .set('x-auth', token)
        .expect(200)
        .expect( (res) =>{
          expect(res.body._id).toBe(id.toString())
        })
        .end(done)
  });

  it('should not fetch a client if user does not belong to that company', (done) => {

      let token = users[0].tokens[0].token;
      let id = clients[1]._id;

      request(app)
        .get(`/api/client/${id}`)
        .set('x-auth', token)
        .expect(404)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined()
        })
        .end(done)
  });

});
