import crudReducer from '../../reducers/crud'
import clients from '../fixtures/clients'

const clientReducer = crudReducer('client');

const client01 = {
  ...clients[0],
  _id: '1234'
}

const client02 = {
  ...clients[1],
  _id: '4321'
}

test('should set default state', () => {
  const state = clientReducer(undefined, {type: '@@INIT'});
  expect(state).toEqual({
    isFetching: false,
    items: []
  });
});

test('should create client', () => {

  const action = {
    type: 'CREATE_CLIENT',
    entity: client01
  }

  const state = clientReducer({
    isFetching: false,
    items: [client02]
  }, action);

  expect(state).toEqual({
    isFetching: false,
    items: [client02,client01]
  });
});

test('should delete client', () => {

  const action = {
    type: 'DELETE_CLIENT',
    entity: client01
  }

  const state = clientReducer({
    isFetching: false,
    items: [client01]
  }, action);

  expect(state).toEqual({
    isFetching: false,
    items: []
  });
});

test('should update client', () => {

  const action = {
    type: 'UPDATE_CLIENT',
    entity: {
      ...client02,
      fist_name: 'Paola'
    }
  }

  const state = clientReducer({
    isFetching: false,
    items: [client02]
  }, action);

  expect(state).toEqual({
    isFetching: false,
    items: [{
      ...client02,
      fist_name: 'Paola'
    }]
  });
});

test('should request clients', () => {

  const action = {
    type: 'REQUEST_CLIENT'
  }

  const state = clientReducer({
    isFetching: false,
    items: []
  }, action);

  expect(state).toEqual({
    isFetching: true,
    items: []
  });
});
