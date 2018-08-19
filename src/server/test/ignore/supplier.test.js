const request = require('supertest');
const app = require('../../index');
const {Supplier} = require('../../models/supplier');
jest.setTimeout(30000);

const {
  users,
  populateUsers,
  suppliers,
  companies,
  populateSuppliers,
  populateCompanies
} = require('../seed');

beforeAll(populateUsers);
beforeAll(populateCompanies);
beforeEach(populateSuppliers);

describe('POST', () => {
  let new_supplier = {
    name: 'Adidas',
    contact_name: 'Juan Portillo',
    address: 'Los caracoles #504, Mexicali BC',
    email: 'jp@adidas.com',
    phone: '6869865547'
  }

  it('should create a new supplier', (done) => {

      let token = users[0].tokens[0].token;

      request(app)
        .post('/api/supplier')
        .set('x-auth', token)
        .send(new_supplier)
        .expect(200)
        .expect( (res) =>{
          expect(res.body.email).toBe(new_supplier.email);
        })
        .end( (err, res) =>{
          if(err){
            return done(err);
          }

          Supplier.find({email: new_supplier.email}).then( (suppliers) => {
            expect(suppliers.length).toBe(1);
            expect(suppliers[0].email).toBe(new_supplier.email);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not create a new supplier if user is not logged', (done) => {

      request(app)
        .post('/api/supplier')
        .send(new_supplier)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not create a new supplier with user that does have a company id', (done) => {

      let token = users[1].tokens[0].token;

      request(app)
        .post('/api/supplier')
        .set('x-auth', token)
        .send(new_supplier)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not create a new supplier with missing fields', (done) => {
      let sup = {...new_supplier};
      delete sup.email;

      let token = users[0].tokens[0].token;

      request(app)
        .post('/api/supplier')
        .set('x-auth', token)
        .send(sup)
        .expect(400)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not create a new supplier with duplicated email', (done) => {

      let sup = {...new_supplier};
      sup.email = 'jesus.perez@vans.com';

      let token = users[0].tokens[0].token;

      request(app)
        .post('/api/supplier')
        .set('x-auth', token)
        .send(sup)
        .expect(400)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not create a new supplier with invalid email', (done) => {

      let sup = {...new_supplier};
      sup.email = 'jpadidas.om';

      let token = users[0].tokens[0].token;

      request(app)
        .post('/api/supplier')
        .set('x-auth', token)
        .send(sup)
        .expect(400)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });
});

describe('PATCH', () => {
  let updated_supplier = {
    name: 'Vans',
    contact_name: 'Javier Lopez',
    email: 'javier.lopez@vans.com',
    phone: '7787956296'
  }
  it('should update a supplier ', (done) => {

      let token = users[0].tokens[0].token;
      let _id = suppliers[0]._id;

      request(app)
        .patch(`/api/supplier/${_id}`)
        .set('x-auth', token)
        .send(updated_supplier)
        .expect(200)
        .expect( (res) =>{
          expect(res.body).toMatchObject(updated_supplier);
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          Supplier.find({email: updated_supplier.email}).then( (suppliers) => {
            expect(suppliers.length).toBe(1);
            expect(suppliers[0].phone).toBe(updated_supplier.phone);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not update a supplier if user is not logged', (done) => {

      let _id = suppliers[0]._id;

      request(app)
        .patch(`/api/supplier/${_id}`)
        .send(updated_supplier)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not update a supplier that does not belong to user company', (done) => {

      let token = users[2].tokens[0].token;
      let _id = suppliers[0]._id;

      request(app)
        .patch(`/api/supplier/${_id}`)
        .set('x-auth', token)
        .send(updated_supplier)
        .expect(404)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          Supplier.find({email: updated_supplier.email}).then( (suppliers) => {
            expect(suppliers.length).toBe(0);
            done();
          }).catch( (e) => done(e) );
        })
  });
});

describe('DELETE', () => {
  it('should remove a supplier ', (done) => {

      let token = users[0].tokens[0].token;
      let email = suppliers[0].email;
      let _id = suppliers[0]._id;

      request(app)
        .delete(`/api/supplier/${_id}`)
        .set('x-auth', token)
        .expect(200)
        .expect( (res) =>{
          expect(res.body._id).toBe(suppliers[0]._id.toString());
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          Supplier.find({email}).then( (suppliers) => {
            expect(suppliers.length).toBe(0);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not remove a supplier if user is not logged', (done) => {

      let token = users[0].tokens[0].token;
      let email = suppliers[0].email;
      let _id = suppliers[0]._id;

      request(app)
        .delete(`/api/supplier/${_id}`)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          Supplier.find({email}).then( (suppliers) => {
            expect(suppliers.length).toBe(1);
            done();
          }).catch( (e) => done(e) );
        })
  });
});

describe('GET', () => {

  it('should fetch all suppliers that belong to a company', (done) => {
      let token = users[0].tokens[0].token;
      request(app)
        .get(`/api/supplier/`)
        .set('x-auth', token)
        .expect(200)
        .expect( (res) =>{
          expect(res.body.length).toBe(2);
        })
        .end(done)
  });

  it('should not fetch any supplier if user is not logged', (done) => {

      request(app)
        .get(`/api/supplier/`)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined()
        })
        .end(done)
  });

  it('should fetch a supplier if user belongs to that company', (done) => {

      let token = users[0].tokens[0].token;
      let id = suppliers[0]._id;
      request(app)
        .get(`/api/supplier/${id}`)
        .set('x-auth', token)
        .expect(200)
        .expect( (res) =>{
          expect(res.body._id).toBe(id.toString())
        })
        .end(done)
  });

  it('should not fetch a supplier if user does not belong to that company', (done) => {

      let token = users[2].tokens[0].token;
      let id = suppliers[0]._id;

      request(app)
        .get(`/api/supplier/${id}`)
        .set('x-auth', token)
        .expect(404)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined()
        })
        .end(done)
  });

});
