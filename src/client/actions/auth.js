import {dispatchAsyncAction} from './async'

export const logInByToken = (user) => {

  return dispatchAsyncAction({
    type: 'LOG_IN'
    },
    'POST',
    '/api/user/login/token',
    user
    )

}

export const logInByCredentials = (user) => {

  return dispatchAsyncAction({
    type: 'LOG_IN'
    },
    'POST',
    '/api/user/login',
    user
    )

}

export const signUp = (user) => {

  return dispatchAsyncAction({
    type: 'SIGN_UP'
    },
    'POST',
    '/api/user',
    user
    )
}

export const logOut = (user) => {

  return dispatchAsyncAction({
    type: 'LOG_OUT'
    },
    'DELETE',
    '/api/user/login/token',
    user
    )
}
