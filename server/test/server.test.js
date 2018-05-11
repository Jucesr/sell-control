const request = require('supertest');
const {app} = require('../server');
const {Client} = require('../models/client');

const {clients, populateClients} = require('./seed');

beforeEach( populateClients );

it('should create a new client', (done) => {
    const new_client = {
      fist_name: "Gaby",
      last_name: "Corral",
      address: "",
      email: "gabriela@gmail.com",
      company_id: "001",
      phone: "686144546"
    }
    //let token = users[0].tokens[0].token;

    request(app)
      .post('/api/client')
      // .set('x-auth', token)
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
