require('../config/config');
require('./mongoose');
const {Supplier} = require('../models/supplier');
const faker = require('faker/locale/es_MX');

const numberOfItems = 1000;

const address = ({address}) => {
  return `${address.streetAddress()}, ${address.country()}`
}

for (var i = 0; i < numberOfItems; i++) {
  let entity = new Supplier({
    name: faker.company.companyName(),
    contact_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    address: address(faker),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber()
  });

  //console.log(client);

  entity.save();
}
