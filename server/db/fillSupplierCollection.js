'use strict';

({});
require('./mongoose');

var _require = require('../models/supplier'),
    Supplier = _require.Supplier;

var faker = require('faker/locale/es_MX');

var numberOfItems = 1000;

var address = function address(_ref) {
  var address = _ref.address;

  return address.streetAddress() + ', ' + address.country();
};

for (var i = 0; i < numberOfItems; i++) {
  var entity = new Supplier({
    name: faker.company.companyName(),
    contact_name: faker.name.firstName() + ' ' + faker.name.lastName(),
    address: address(faker),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber()
  });

  //console.log(client);

  entity.save();
}
//# sourceMappingURL=fillSupplierCollection.js.map