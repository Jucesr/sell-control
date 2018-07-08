const request = require('supertest');
const {app} = require('../../server');
const {Product} = require('../../models/product');
jest.setTimeout(30000);

const {
  users,
  products,
  populateUsers,
  populateProducts,
  populateSuppliers,
  populateCompanies,
  companyOneID,
  supplierOneID,
  supplierTwoID,
  supplierThreeID
} = require('../seed');

beforeAll(populateUsers);
beforeAll(populateCompanies);
beforeAll(populateSuppliers);
beforeEach(populateProducts);

describe('POST', () => {
  let new_product = {
    supplier_id: supplierOneID,
    code: '003',
    name: 'Chanclas',
    uom: 'pair',
    cost: 10.99,
    price: 34.99,
    inventory: false,
    how_many: 0
  }

  let token = users[0].tokens[0].token;

  it('should create a new product', (done) => {

      request(app)
        .post('/api/product')
        .set('x-auth', token)
        .send(new_product)
        .expect(200)
        .expect( (res) =>{
          expect(res.body.code).toBe(new_product.code);
        })
        .end( (err, res) =>{
          if(err){
            return done(err);
          }

          Product.find({code: new_product.code}).then( (products) => {
            expect(products.length).toBe(1);
            expect(products[0].code).toBe(new_product.code);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not create a new product if user is not logged', (done) => {

      request(app)
        .post('/api/product')
        .send(new_product)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not create a new product with user that does have a company id', (done) => {

      let token = users[1].tokens[0].token;

      request(app)
        .post('/api/product')
        .set('x-auth', token)
        .send(new_product)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not create a new product with missing supplier_id', (done) => {
      let item = {...new_product};
      delete item.supplier_id;

      request(app)
        .post('/api/product')
        .set('x-auth', token)
        .send(item)
        .expect(400)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not create a new product with supplier_id that is not related to user', (done) => {
      let item = {...new_product};
      item.supplier_id = supplierThreeID;

      request(app)
        .post('/api/product')
        .set('x-auth', token)
        .send(item)
        .expect(404)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not create a new product with missing code', (done) => {
      let item = {...new_product};
      delete item.code;

      request(app)
        .post('/api/product')
        .set('x-auth', token)
        .send(item)
        .expect(400)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not create a new product with duplicated code', (done) => {

      let item = {...new_product};
      item.code = '001';

      request(app)
        .post('/api/product')
        .set('x-auth', token)
        .send(item)
        .expect(400)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not create a new product with invalid cost', (done) => {

    let item = {...new_product};
    item.cost = 'COSTO';

    request(app)
      .post('/api/product')
      .set('x-auth', token)
      .send(item)
      .expect(400)
      .expect( (res) =>{
        expect(res.body.error).toBeDefined();
      })
      .end(done)
  });

  it('should not create a new product with invalid price', (done) => {

    let item = {...new_product};
    item.price = 'PRECIO';

    request(app)
      .post('/api/product')
      .set('x-auth', token)
      .send(item)
      .expect(400)
      .expect( (res) =>{
        expect(res.body.error).toBeDefined();
      })
      .end(done)
  });
});

describe('PATCH', () => {
  let updated_product = {
    code: '001',
    name: 'Black shoe extra big',
    description: 'This is a new description',
    uom: 'pair',
    cost: 20.99,
    price: 15.99,
    inventory: true,
    how_many: 20
  }

  let token = users[0].tokens[0].token;

  it('should update a product data ', (done) => {

      let _id = products[0]._id;

      request(app)
        .patch(`/api/product/${_id}`)
        .set('x-auth', token)
        .send(updated_product)
        .expect(200)
        .expect( (res) =>{
          expect(res.body).toMatchObject(updated_product);
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          Product.find({code: updated_product.code}).then( (products) => {
            expect(products.length).toBe(1);
            expect(products[0]).toMatchObject(updated_product);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should update a product with a new supplier id ', (done) => {

      let _id = products[0]._id;
      let product = {
        ...updated_product,
        supplier_id: supplierTwoID
      };


      request(app)
        .patch(`/api/product/${_id}`)
        .set('x-auth', token)
        .send(product)
        .expect(200)
        .expect( (res) =>{
          product = {
            ...product,
            supplier_id: supplierTwoID.toString()
          }
          expect(res.body).toMatchObject(product);
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          Product.find({code: product.code}).then( (products) => {
            let db_product = {
              ...products[0]._doc,
              supplier_id: products[0].supplier_id.toString()
            }
            expect(products.length).toBe(1);
            expect(db_product).toMatchObject(product);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not update a product with supplier id that is not in database', (done) => {

      let _id = products[0]._id;
      let product = {
        ...updated_product,
        supplier_id: supplierThreeID
      };


      request(app)
        .patch(`/api/product/${_id}`)
        .set('x-auth', token)
        .send(product)
        .expect(404)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          Product.find({code: product.code}).then( (products) => {
            let db_product = {
              ...products[0]._doc
            }
            // product = {
            //   ...product,
            //   supplier_id: supplierThreeID.toString()
            // }
            expect(db_product).not.toMatchObject(product);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not update a product if user is not logged', (done) => {

      let _id = products[0]._id;

      request(app)
        .patch(`/api/product/${_id}`)
        .send(updated_product)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end(done)
  });

  it('should not update a product that does not belong to user company', (done) => {

      let token = users[2].tokens[0].token;
      let _id = products[0]._id;

      request(app)
        .patch(`/api/product/${_id}`)
        .set('x-auth', token)
        .send(updated_product)
        .expect(404)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          Product.find({code: updated_product.code}).then( (products) => {
            expect(products[0]).not.toBe(updated_product);
            done();
          }).catch( (e) => done(e) );
        })
  });
});

describe('DELETE', () => {
  it('should remove a product ', (done) => {

      let token = users[0].tokens[0].token;
      let code = products[0].code;
      let _id = products[0]._id;

      request(app)
        .delete(`/api/product/${_id}`)
        .set('x-auth', token)
        .expect(200)
        .expect( (res) =>{
          expect(res.body._id).toBe(products[0]._id.toString());
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          Product.find({code}).then( (products) => {
            expect(products.length).toBe(0);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not remove a product if user is not logged', (done) => {

      let code = products[0].code;
      let _id = products[0]._id;

      request(app)
        .delete(`/api/product/${_id}`)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          Product.find({code}).then( (products) => {
            expect(products.length).toBe(1);
            done();
          }).catch( (e) => done(e) );
        })
  });

  it('should not remove a product if user does not belong to the same company of the client', (done) => {

      let token = users[0].tokens[0].token;
      let code = products[0].code;
      let _id = products[2]._id;

      request(app)
        .delete(`/api/product/${_id}`)
        .set('x-auth', token)
        .expect(404)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined();
        })
        .end((err, res) =>{
          if(err){
            return done(err);
          }

          Product.find({code}).then( (products) => {
            expect(products.length).toBe(1);
            done();
          }).catch( (e) => done(e) );
        })
  });
});

describe('GET', () => {

  it('should fetch all products that belong to a company', (done) => {
      let token = users[0].tokens[0].token;
      request(app)
        .get(`/api/product/`)
        .set('x-auth', token)
        .expect(200)
        .expect( (res) =>{
          expect(res.body.length).toBe(2);
        })
        .end(done)
  });

  it('should not fetch any product if user is not logged', (done) => {

      request(app)
        .get(`/api/product/`)
        .expect(401)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined()
        })
        .end(done)
  });

  it('should fetch a product if user belongs to that company', (done) => {

      let token = users[0].tokens[0].token;
      let id = products[0]._id;
      request(app)
        .get(`/api/product/${id}`)
        .set('x-auth', token)
        .expect(200)
        .expect( (res) =>{
          expect(res.body._id).toBe(id.toString())
        })
        .end(done)
  });

  it('should not fetch a product if user does not belong to that company', (done) => {

      let token = users[2].tokens[0].token;
      let id = products[0]._id;

      request(app)
        .get(`/api/product/${id}`)
        .set('x-auth', token)
        .expect(404)
        .expect( (res) =>{
          expect(res.body.error).toBeDefined()
        })
        .end(done)
  });

});
