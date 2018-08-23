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

beforeEach(populateUsers);
beforeEach(populateCompanies);


// describe('POST', () => {
//     let new_company = {
//         name: 'My awesome company !'
//     }
//     it('should add a new company', done => {

//         let token = users[1].tokens[0].token
        
//         request(app)
//             .post('/api/company')
//             .set('x-auth', token)
//             .send(new_company)
//             .expect(200)
//             .expect( (res) =>{
//                 let {name, max_users, _id} = res.body

//                 expect(name).toBe(new_company.name)
//                 expect(max_users).toBe(2)
//                 expect(_id).toBeDefined()
//             })
//             .end( done )
//     })

//     it('should not add a new company if user has reached maximum number of campanies', done => {

//         let token = users[0].tokens[0].token
        
//         request(app)
//             .post('/api/company')
//             .set('x-auth', token)
//             .send(new_company)
//             .expect(400)
//             .expect( (res) =>{
//                 let {error} = res.body
//                 expect(error).toBeDefined()
//             })
//             .end( done )
//     })
// })

// describe('PATCH unsubscribe/user', () => {
//     it('should let owner of the company unsubscribe an user from the company', done => {
//         let token = users[0].tokens[0].token
//         let uu_id = users[2]._id

//         request(app)
//             .patch(`/api/company/unsubscribe/user/${uu_id}`)
//             .set('x-auth', token)
//             .send({})
//             .expect(200)
//             .end( done )
//     })

//     it('should not let unsubscribe an user from the company if is not the owner', done => {
//         let token = users[1].tokens[0].token
//         let uu_id = users[2]._id
        
//         request(app)
//             .patch(`/api/company/unsubscribe/user/${uu_id}`)
//             .set('x-auth', token)
//             .send({})
//             .expect(401)
//             .expect( (res) =>{
//                 let {error} = res.body
//                 expect(error).toBeDefined()
//             })
//             .end( done )
//     })

//     it('should not let user unsubscribe himself', done => {
//         let token = users[0].tokens[0].token
//         let uu_id = users[0]._id
        
//         request(app)
//             .patch(`/api/company/unsubscribe/user/${uu_id}`)
//             .set('x-auth', token)
//             .send({})
//             .expect(400)
//             .expect( (res) =>{
//                 let {error} = res.body
//                 expect(error).toBeDefined()
//             })
//             .end( done )
//     })

//     it('should not let user unsubscribe user that is not in the list', done => {
//         let token = users[0].tokens[0].token
//         let uu_id = users[1]._id
        
//         request(app)
//             .patch(`/api/company/unsubscribe/user/${uu_id}`)
//             .set('x-auth', token)
//             .send({})
//             .expect(400)
//             .expect( (res) =>{
//                 let {error} = res.body
//                 expect(error).toBeDefined()
//             })
//             .end( done )
//     })
// })

// describe('PATCH unsubscribe/me', () => {
//     it('should let user unsubscribe himself from a company', done => {
//         let token = users[3].tokens[0].token

//         request(app)
//             .patch(`/api/company/unsubscribe/me`)
//             .set('x-auth', token)
//             .send({})
//             .expect(200)
//             .end( done )
//     })

//     it('should not let owner of the company unsubscribe himself', done => {
//         let token = users[0].tokens[0].token

//         request(app)
//             .patch(`/api/company/unsubscribe/me`)
//             .set('x-auth', token)
//             .send({})
//             .expect(401)
//             .expect( (res) =>{
//                 let {error} = res.body
//                 expect(error).toBeDefined()
//             })
//             .end( done )
//     })
// })

// describe('PATCH /subscribe/user/:id', () => {
//     it('should let user subscribe other user to a company', done => {
//         let token = users[0].tokens[0].token
//         let uu_id = users[1]._id 

//         request(app)
//             .patch(`/api/company/subscribe/user/${uu_id}`)
//             .set('x-auth', token)
//             .send({})
//             .expect(200)
//             .end( done )
//     })
    
//     it('should not let user subscribe other user if he is already subscribe', done => {
//         let token = users[0].tokens[0].token
//         let uu_id = users[3]._id 

//         request(app)
//             .patch(`/api/company/subscribe/user/${uu_id}`)
//             .set('x-auth', token)
//             .send({})
//             .expect(400)
//             .expect( (res) =>{
//                 let {error} = res.body
//                 expect(error).toBeDefined()
//             })
//             .end( done )
//     })

//     it('should not let user subscribe other user if company has reached a maximum number of users', done => {
//         let token = users[2].tokens[0].token
//         let uu_id = users[0]._id 

//         request(app)
//             .patch(`/api/company/subscribe/user/${uu_id}`)
//             .set('x-auth', token)
//             .send({})
//             .expect(400)
//             .expect( (res) =>{
//                 let {error} = res.body
//                 expect(error).toBeDefined()
//             })
//             .end( done )
//     })

//     it('should not let user subscribe himself', done => {
//         let token = users[0].tokens[0].token
//         let uu_id = users[0]._id 

//         request(app)
//             .patch(`/api/company/subscribe/user/${uu_id}`)
//             .set('x-auth', token)
//             .send({})
//             .expect(400)
//             .expect( (res) =>{
//                 let {error} = res.body
//                 expect(error).toBeDefined()
//             })
//             .end( done )
//     })
// })

// describe('PATCH /max_users/:action', () => {
//     it('should increase the max users number of a company', done => {
//         let token = users[0].tokens[0].token

//         request(app)
//             .patch(`/api/company/max_users/increase`)
//             .set('x-auth', token)
//             .send({})
//             .expect(200)
//             .end( (err, res) =>{
//                 if(err){
//                   return done(err);
//                 }
        
//                 Company.findById(users[0].selected_company_id).then( (item) => {
//                   expect(item.max_users).toBe(companies[0].max_users + 1);
//                   done();
//                 }).catch( (e) => done(e) );
//               } )
//     }) 

//     it('should decrease the max users number of a company', done => {
//         let token = users[0].tokens[0].token

//         request(app)
//             .patch(`/api/company/max_users/decrease`)
//             .set('x-auth', token)
//             .send({})
//             .expect(200)
//             .end( (err, res) =>{
//                 if(err){
//                   return done(err);
//                 }
        
//                 Company.findById(users[0].selected_company_id).then( (item) => {
//                   expect(item.max_users).toBe(companies[0].max_users - 1);
//                   done();
//                 }).catch( (e) => done(e) );
//               } )
//     })

//     it('should not modify max users number of a company if user is not the owner', done => {
//         let token = users[3].tokens[0].token

//         request(app)
//             .patch(`/api/company/max_users/decrease`)
//             .set('x-auth', token)
//             .send({})
//             .expect(401)
//             .expect( (res) =>{
//                 let {error} = res.body
//                 expect(error).toBeDefined()
//             })
//             .end( (err, res) =>{
//                 if(err){
//                   return done(err);
//                 }
        
//                 Company.findById(users[0].selected_company_id).then( (item) => {
//                   expect(item.max_users).toBe(companies[0].max_users);
//                   done();
//                 }).catch( (e) => done(e) );
//               } )
//     })
// })

describe('PATCH /user_owner_id/:id', () => {
    it('should change the user of a company', done => {
        let token = users[0].tokens[0].token
        let new_user_id = users[3]._id

        request(app)
            .patch(`/api/company/user_owner_id/${new_user_id}`)
            .set('x-auth', token)
            .send({})
            .expect(200)
            .end( (err, res) =>{
                if(err){
                  return done(err);
                }
        
                Company.findById(users[0].selected_company_id).then( (item) => {
                  expect(item.user_owner_id.toString()).toEqual(new_user_id);
                  done();
                }).catch( (e) => done(e) );
              } )
    }) 

    it('should not change the user of a company if the user is not the owner', done => {
        let token = users[3].tokens[0].token
        let new_user_id = users[1]._id

        request(app)
            .patch(`/api/company/user_owner_id/${new_user_id}`)
            .set('x-auth', token)
            .send({})
            .expect(401)
            .expect( (res) =>{
                let {error} = res.body
                expect(error).toBeDefined()
            })
            .end( done )
    }) 
})

