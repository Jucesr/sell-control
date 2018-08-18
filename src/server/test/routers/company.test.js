const request = require('supertest');
const app = require('../../index');
const {company} = require('../../models/company');
jest.setTimeout(30000);

const {
  users,
  companys,
  companies,
  populateUsers,
  populatecompanys,
  populateCompanies
} = require('../seed');

beforeAll(populateUsers);
beforeAll(populateCompanies);
beforeEach(populatecompanys);

describe('POST', () => {
  let new_company = {
    first_name: "Gaby",
    last_name: "Corral",
    address: "",
    email: "gabriela@gmail.com",
    phone: "686144546"
  }

  it('should create a new company', (done) => {

    let token = users[0].tokens[0].token;

    request(app)
      .post('/api/company')
      .set('x-auth', token)
      .send(new_company)
      .expect(200)
      .expect( (res) =>{
        expect(res.body.email).toBe(new_company.email);
      })
      .end( (err, res) =>{
        if(err){
          return done(err);
        }

        company.find({email: new_company.email}).then( (companys) => {
          expect(companys.length).toBe(1);
          expect(companys[0].email).toBe(new_company.email);
          done();
        }).catch( (e) => done(e) );
      })
  });

  it('should not create a new company if user is not logged', (done) => {
      let token = users[1].tokens[0].token;

      request(app)
        .post('/api/company')
        .send(new_company)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not create a new company with user that does have a company id', (done) => {
      let token = users[1].tokens[0].token;

      request(app)
        .post('/api/company')
        .set('x-auth', token)
        .send(new_company)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not create a new company with missing fields', (done) => {

      let company = {...new_company};
      delete company.first_name;

      let token = users[0].tokens[0].token;

      request(app)
        .post('/api/company')
        .set('x-auth', token)
        .send(company)
        .expect(400)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not create a new company with duplicated email', (done) => {

    let company = {...new_company};
    company.email = 'jcom.94m@gmail.com';

    let token = users[0].tokens[0].token;

    request(app)
      .post('/api/company')
      .set('x-auth', token)
      .send(company)
      .expect(400)
      .expect( (res) =>{
        expect(res.body.error).toBeDefined();
      })
      .end(done)
  });

  it('should not create a new company with invalid email', (done) => {
    let company = {...new_company};
    company.email = 'invalidemail';
    let token = users[0].tokens[0].token;

    request(app)
      .post('/api/company')
      .set('x-auth', token)
      .send(company)
      .expect(400)
      .expect( (res) =>{
        expect(res.body.error).toBeDefined();
      })
      .end(done)
  });
});

describe('PATCH', () => {
  it('should update a company ', (done) => {
      const updated_company = {
        first_name: 'Cesar',
        last_name: 'Ojeda',
        address: 'This is a new address',
        email: 'jcom.94m@gmail.com',
        phone: '6861995468'
      }
      let token = users[0].tokens[0].token;
      let _id = companys[0]._id;

      request(app)
        .patch(`/api/company/${_id}`)
        .set('x-auth', token)
        .send(updated_company)
        .expect(200)
        .expect( (res) =>{
          expect(res.body).toMatchObject(updated_company);
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          company.find({email: updated_company.email}).then( (companys) => {
            expect(companys.length).toBe(1);
            expect(companys[0].phone).toBe(updated_company.phone);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not update a company if user is not logged', (done) => {
      const updated_company = {
        first_name: 'Cesar',
        last_name: 'Ojeda',
        address: 'This is a new address',
        email: 'jcom.94m@gmail.com',
        phone: '6861995468'
      }
      let _id = companys[0]._id;

      request(app)
        .patch(`/api/company/${_id}`)
        .send(updated_company)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not update a company that does not belong to user company', (done) => {
      const updated_company = {
        first_name: 'Cesar',
        last_name: 'Ojeda',
        address: 'This is a new address',
        email: 'jcom.94m@gmail.com',
        phone: '6861995468'
      }
      let token = users[2].tokens[0].token;
      let _id = companys[0]._id;

      request(app)
        .patch(`/api/company/${_id}`)
        .set('x-auth', token)
        .send(updated_company)
        .expect(404)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          company.find({email: updated_company.email}).then( (companys) => {
            expect(companys.length).toBe(1);
            expect(companys[0]).not.toBe(updated_company);
            done();
          }).catch( (e) => done(e) );
        })
  });
});

describe('DELETE', () => {
  it('should remove a company ', (done) => {

      let token = users[0].tokens[0].token;
      let email = companys[0].email;
      let _id = companys[0]._id;

      request(app)
        .delete(`/api/company/${_id}`)
        .set('x-auth', token)
        .expect(200)
        .expect( (res) =>{
          expect(res.body._id).toBe(companys[0]._id.toString());
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          company.find({email}).then( (companys) => {
            expect(companys.length).toBe(0);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not remove a company if user is not logged', (done) => {

      let token = users[0].tokens[0].token;
      let email = companys[0].email;
      let _id = companys[0]._id;

      request(app)
        .delete(`/api/company/${_id}`)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          company.find({email}).then( (companys) => {
            expect(companys.length).toBe(1);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not remove a company if user does not belong to the same company of the company', (done) => {

      let token = users[0].tokens[0].token;
      let company = companys[1];

      request(app)
        .delete(`/api/company/${company._id}`)
        .set('x-auth', token)
        .expect(404)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          company.find({_id: company._id}).then( (companys) => {
            expect(companys.length).toBe(1);
            done();
          }).catch( (e) => done(e) );
        })
  });
});

describe('GET', () => {

  it('should fetch all companys that belong to a company', (done) => {
      let token = users[0].tokens[0].token;
      request(app)
        .get(`/api/company/`)
        .set('x-auth', token)
        .expect(200)
        .expect( (res) =>{
          expect(res.body.length).toBe(1);
        })
        .end(done)
  });

  it('should not fetch any company if user is not logged', (done) => {

      request(app)
        .get(`/api/company/`)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined()
        })
        .end(done)
  });

  it('should fetch a company if user belongs to that company', (done) => {

      let token = users[0].tokens[0].token;
      let id = companys[0]._id;

      request(app)
        .get(`/api/company/${id}`)
        .set('x-auth', token)
        .expect(200)
        .expect( (res) =>{
          expect(res.body._id).toBe(id.toString())
        })
        .end(done)
  });

  it('should not fetch a company if user does not belong to that company', (done) => {

      let token = users[0].tokens[0].token;
      let id = companys[1]._id;

      request(app)
        .get(`/api/company/${id}`)
        .set('x-auth', token)
        .expect(404)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined()
        })
        .end(done)
  });

});
