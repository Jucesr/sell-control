const request = require('supertest')
const app = require('../../index')
const {Company} = require('../../models/company')
jest.setTimeout(30000)

const {
    users,
    clients,
    companies,
    populateUsers,
    populateCompanies
} = require('../seed')

beforeAll(populateUsers);
beforeEach(populateCompanies);


describe('POST', () => {
    let new_company = {
        name: 'My awesome company !'
    }
    it('should add a new company', done => {

        let token = users[1].tokens[0].token
        
        request(app)
            .post('/api/company')
            .set('x-auth', token)
            .send(new_company)
            .expect(200)
            .expect( (res) =>{
                let {name, max_users, _id} = res.body

                expect(name).toBe(new_company.name)
                expect(max_users).toBe(2)
                expect(_id).toBeDefined()
            })
            .end( done )
    })

    it('should not add a new company if user has reached maximum number of campanies', done => {

        let token = users[0].tokens[0].token
        
        request(app)
            .post('/api/company')
            .set('x-auth', token)
            .send(new_company)
            .expect(400)
            .expect( (res) =>{
                let {error} = res.body
                expect(error).toBeDefined()
            })
            .end( done )
    })
})

describe('PATCH', () => {
    it('should let owner of the company unsubscribe an user from the company', done => {
        let token = users[0].tokens[0].token
        let uu_id = users[2]._id

        request(app)
            .patch(`/api/company/unsubscribe/user/${uu_id}`)
            .set('x-auth', token)
            .send({})
            .expect(200)
            .end( done )
    })

    it('should not let unsubscribe an user from the company if is not the owner', done => {
        let token = users[1].tokens[0].token
        let uu_id = users[2]._id
        
        request(app)
            .patch(`/api/company/unsubscribe/user/${uu_id}`)
            .set('x-auth', token)
            .send({})
            .expect(404)
            .expect( (res) =>{
                let {error} = res.body
                expect(error).toBeDefined()
            })
            .end( done )
    })

    it('should not let user unsubscribe himself', done => {
        let token = users[0].tokens[0].token
        let uu_id = users[0]._id
        
        request(app)
            .patch(`/api/company/unsubscribe/user/${uu_id}`)
            .set('x-auth', token)
            .send({})
            .expect(400)
            .expect( (res) =>{
                let {error} = res.body
                expect(error).toBeDefined()
            })
            .end( done )
    })

    it('should not let user unsubscribe user that is not in the list', done => {
        let token = users[0].tokens[0].token
        let uu_id = users[1]._id
        
        request(app)
            .patch(`/api/company/unsubscribe/user/${uu_id}`)
            .set('x-auth', token)
            .send({})
            .expect(400)
            .expect( (res) =>{
                let {error} = res.body
                expect(error).toBeDefined()
            })
            .end( done )
    })
})

