import {dispatchAsyncAction} from './async'

export const logIn = (user) => ({
  type: 'LOG_IN',
  user
})

export const signUp = (user) => {

  return dispatchAsyncAction({
    type: 'SIGN_UP'
    },
    'POST',
    '/api/user',
    user
    )
}

export const logOut = () => ({
  type: 'LOG_OUT'
});
