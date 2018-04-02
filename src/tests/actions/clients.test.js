
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {addClient, updateClient, removeClient, fetchClients} from '../../actions/clients'
import clients from '../fixtures/clients'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const store = mockStore({ items: [] })

let client01 = clients[0]

let client02 = clients[1]

// beforeAll(() => {
//
// });

// afterAll(() => {
//   cleanUpDatabase(globalDatabase);
// });

test('should add a client ', done => {

  const expectedAction = {
    type: 'CREATE_CLIENT',
    entity: {
      ...client01,
      _id: expect.any(String),
      __v: expect.any(Number),
      createdAt: expect.any(Number)
    }
  };

  store.dispatch(addClient(client01))
    .then(
      (action) => {
        expect(action).toEqual(expectedAction);
        client01 = {
          ...action.entity
        }
        done();
      },
      e => {
        throw new Error(e);
      }
    )
});

test('should not add a client with invalid email', done => {

  const expectedAction = {
    type: 'ERROR_CREATE_CLIENT',
    error: expect.any(String)
  };

  store.dispatch(addClient(client02))
    .then(
      (action) => {
        expect(action).toEqual(expectedAction);
        done();
      },
      e => {
        throw new Error(e);
      }
    )
});

test('should update a client ', done => {

  let updatedClient = {
    ...client01,
    fist_name: 'Jose',
    last_name: 'Perez'
  }

  const expectedAction = {
    type: 'UPDATE_CLIENT',
    entity: updatedClient

  };

  store.dispatch(updateClient(updatedClient))
    .then(
      (action) => {
        expect(action).toEqual(expectedAction);
        client01 = {
          ...action.entity
        }
        done();
      },
      e => {
        throw new Error(e);
      }
    )
});

test('should remove a client ', done => {
  const expectedAction = {
    type: 'DELETE_CLIENT',
    entity: client01
  };

  store.dispatch(removeClient(client01))
    .then(
      (action) => {
        expect(action).toEqual(expectedAction);
        done();
      },
      e => {
        throw new Error(e);
      }
    )
});

test('should not remove a client with invalid ID', done => {
  const expectedAction = {
    type: 'ERROR_DELETE_CLIENT',
    error: expect.any(Object)
  };

  store.dispatch(removeClient(client02))
    .then(
      (action) => {
        expect(action).toEqual(expectedAction);
        done();
      },
      e => {
        throw new Error(e);
      }
    )
});
