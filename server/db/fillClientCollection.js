require('../config/config');
require('./mongoose');
const {Client} = require('../models/client');
const faker = require('faker/locale/es_MX');

const numberOfClients = 5000;

const address = ({address}) => {
  return `${address.streetAddress()}, ${address.country()}`
}

for (var i = 0; i < numberOfClients; i++) {
  let client = new Client({
    fist_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    address: address(faker),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber()
  });

  //console.log(client);

  client.save();
}
