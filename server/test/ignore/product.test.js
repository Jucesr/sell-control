'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('supertest');

var _require = require('../../server'),
    app = _require.app;

var _require2 = require('../../models/product'),
    Product = _require2.Product;

jest.setTimeout(30000);

var _require3 = require('../seed'),
    users = _require3.users,
    products = _require3.products,
    populateUsers = _require3.populateUsers,
    populateProducts = _require3.populateProducts,
    populateSuppliers = _require3.populateSuppliers,
    populateCompanies = _require3.populateCompanies,
    companyOneID = _require3.companyOneID,
    supplierOneID = _require3.supplierOneID,
    supplierTwoID = _require3.supplierTwoID,
    supplierThreeID = _require3.supplierThreeID;

beforeAll(populateUsers);
beforeAll(populateCompanies);
beforeAll(populateSuppliers);
beforeEach(populateProducts);

describe('POST', function () {
  var new_product = {
    supplier_id: supplierOneID,
    code: '003',
    name: 'Chanclas',
    uom: 'pair',
    cost: 10.99,
    price: 34.99,
    stock: 10
  };

  var token = users[0].tokens[0].token;

  it('should create a new product', function (done) {

    request(app).post('/api/product').set('x-auth', token).send(new_product).expect(200).expect(function (res) {
      expect(res.body.code).toBe(new_product.code);
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Product.find({ code: new_product.code }).then(function (products) {
        expect(products.length).toBe(1);
        expect(products[0].code).toBe(new_product.code);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not create a new product if user is not logged', function (done) {

    request(app).post('/api/product').send(new_product).expect(401).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not create a new product with user that does have a company id', function (done) {

    var token = users[1].tokens[0].token;

    request(app).post('/api/product').set('x-auth', token).send(new_product).expect(401).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not create a new product with missing supplier_id', function (done) {
    var item = (0, _extends3.default)({}, new_product);
    delete item.supplier_id;

    request(app).post('/api/product').set('x-auth', token).send(item).expect(400).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not create a new product with supplier_id that is not related to user', function (done) {
    var item = (0, _extends3.default)({}, new_product);
    item.supplier_id = supplierThreeID;

    request(app).post('/api/product').set('x-auth', token).send(item).expect(404).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not create a new product with missing code', function (done) {
    var item = (0, _extends3.default)({}, new_product);
    delete item.code;

    request(app).post('/api/product').set('x-auth', token).send(item).expect(400).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not create a new product with duplicated code', function (done) {

    var item = (0, _extends3.default)({}, new_product);
    item.code = '001';

    request(app).post('/api/product').set('x-auth', token).send(item).expect(400).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not create a new product with invalid cost', function (done) {

    var item = (0, _extends3.default)({}, new_product);
    item.cost = 'COSTO';

    request(app).post('/api/product').set('x-auth', token).send(item).expect(400).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not create a new product with invalid price', function (done) {

    var item = (0, _extends3.default)({}, new_product);
    item.price = 'PRECIO';

    request(app).post('/api/product').set('x-auth', token).send(item).expect(400).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });
});

describe('PATCH', function () {
  var updated_product = {
    code: '001',
    name: 'Black shoe extra big',
    description: 'This is a new description',
    uom: 'pair',
    cost: 20.99,
    price: 15.99,
    stock: 20
  };

  var token = users[0].tokens[0].token;

  it('should update a product data ', function (done) {

    var _id = products[0]._id;

    request(app).patch('/api/product/' + _id).set('x-auth', token).send(updated_product).expect(200).expect(function (res) {
      expect(res.body).toMatchObject(updated_product);
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Product.find({ code: updated_product.code }).then(function (products) {
        expect(products.length).toBe(1);
        expect(products[0]).toMatchObject(updated_product);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should update a product with a new supplier id ', function (done) {

    var _id = products[0]._id;
    var product = (0, _extends3.default)({}, updated_product, {
      supplier_id: supplierTwoID
    });

    request(app).patch('/api/product/' + _id).set('x-auth', token).send(product).expect(200).expect(function (res) {
      product = (0, _extends3.default)({}, product, {
        supplier_id: supplierTwoID.toString()
      });
      expect(res.body).toMatchObject(product);
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Product.find({ code: product.code }).then(function (products) {
        var db_product = (0, _extends3.default)({}, products[0]._doc, {
          supplier_id: products[0].supplier_id.toString()
        });
        expect(products.length).toBe(1);
        expect(db_product).toMatchObject(product);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not update a product with supplier id that is not in database', function (done) {

    var _id = products[0]._id;
    var product = (0, _extends3.default)({}, updated_product, {
      supplier_id: supplierThreeID
    });

    request(app).patch('/api/product/' + _id).set('x-auth', token).send(product).expect(404).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Product.find({ code: product.code }).then(function (products) {
        var db_product = (0, _extends3.default)({}, products[0]._doc);
        // product = {
        //   ...product,
        //   supplier_id: supplierThreeID.toString()
        // }
        expect(db_product).not.toMatchObject(product);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not update a product if user is not logged', function (done) {

    var _id = products[0]._id;

    request(app).patch('/api/product/' + _id).send(updated_product).expect(401).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should not update a product that does not belong to user company', function (done) {

    var token = users[2].tokens[0].token;
    var _id = products[0]._id;

    request(app).patch('/api/product/' + _id).set('x-auth', token).send(updated_product).expect(404).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Product.find({ code: updated_product.code }).then(function (products) {
        expect(products[0]).not.toBe(updated_product);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });
});

describe('DELETE', function () {
  it('should remove a product ', function (done) {

    var token = users[0].tokens[0].token;
    var code = products[0].code;
    var _id = products[0]._id;

    request(app).delete('/api/product/' + _id).set('x-auth', token).expect(200).expect(function (res) {
      expect(res.body._id).toBe(products[0]._id.toString());
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Product.find({ code: code }).then(function (products) {
        expect(products.length).toBe(0);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not remove a product if user is not logged', function (done) {

    var code = products[0].code;
    var _id = products[0]._id;

    request(app).delete('/api/product/' + _id).expect(401).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Product.find({ code: code }).then(function (products) {
        expect(products.length).toBe(1);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });

  it('should not remove a product if user does not belong to the same company of the client', function (done) {

    var token = users[0].tokens[0].token;
    var code = products[0].code;
    var _id = products[2]._id;

    request(app).delete('/api/product/' + _id).set('x-auth', token).expect(404).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(function (err, res) {
      if (err) {
        return done(err);
      }

      Product.find({ code: code }).then(function (products) {
        expect(products.length).toBe(1);
        done();
      }).catch(function (e) {
        return done(e);
      });
    });
  });
});

describe('GET', function () {

  it('should fetch all products that belong to a company', function (done) {
    var token = users[0].tokens[0].token;
    request(app).get('/api/product/').set('x-auth', token).expect(200).expect(function (res) {
      expect(res.body.length).toBe(2);
    }).end(done);
  });

  it('should not fetch any product if user is not logged', function (done) {

    request(app).get('/api/product/').expect(401).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });

  it('should fetch a product if user belongs to that company', function (done) {

    var token = users[0].tokens[0].token;
    var id = products[0]._id;
    request(app).get('/api/product/' + id).set('x-auth', token).expect(200).expect(function (res) {
      expect(res.body._id).toBe(id.toString());
    }).end(done);
  });

  it('should not fetch a product if user does not belong to that company', function (done) {

    var token = users[2].tokens[0].token;
    var id = products[0]._id;

    request(app).get('/api/product/' + id).set('x-auth', token).expect(404).expect(function (res) {
      expect(res.body.error).toBeDefined();
    }).end(done);
  });
});
//# sourceMappingURL=product.test.js.map