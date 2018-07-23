'use strict';

({});
require('./mongoose');

var _require = require('../models/client'),
    Client = _require.Client;

var faker = require('faker/locale/es_MX');

var _require2 = require('mongodb'),
    ObjectID = _require2.ObjectID;

var numberOfClients = 50000;

var address = function address(_ref) {
  var address = _ref.address;

  return address.streetAddress() + ', ' + address.country();
};

for (var i = 0; i < numberOfClients; i++) {
  var client = new Client({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    address: address(faker),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    company_id: new ObjectID()
  });

  //console.log(client);

  client.save();
}
//# sourceMappingURL=fillClientCollection.js.map