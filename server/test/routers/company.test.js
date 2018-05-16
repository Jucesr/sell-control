const request = require('supertest');
const {app, server} = require('../../server');
const {Client} = require('../../models/client');
jest.setTimeout(30000);