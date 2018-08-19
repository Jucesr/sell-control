const request = require('supertest')
const app = require('../../index')
const {Company} = require('../../models/company')
jest.setTimeout(30000)

const {
    users,
    clients,
    companies,
    populateUsers
} = require('../seed')

beforeAll(populateUsers);


describe('POST', () => {
    let new_company = {
        name: 'My awesome company !'
    }
    it('should add a new company', done => {

        let token = users[1].tokens[0].token;
        let _id
        
        request(app)
            .post('/api/company')
            .set('x-auth', token)
            .send(new_company)
            .expect(200)
            .expect( (res) =>{
                let {name, max_users} = res.body
                _id = res.body._id
                expect(name).toBe(new_company.name)
                expect(max_users).toBe(2)
                expect(_id).toBeDefined()
            })
            .end( done )

    })
})

