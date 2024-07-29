import {
  DISCONNECT_WALLET,
  SET_AUTHENTICATED,
  SET_NETWORK,
  SET_WALLET,
  SET_INITIALIZED
} from 'src/store/constants/constants'

const Auth = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: payload
      }
    case SET_INITIALIZED:
      return {
        ...state,
        isInitialized: payload
      }
    case SET_WALLET:
      return {
        ...state,
        walletAddress: payload
      }
    case SET_NETWORK:
      return {
        ...state,
        network: payload
      }
    case DISCONNECT_WALLET:
      return {
        ...state,
        isAuthenticated: false,
        walletAddress: {
          bech32: ' ',
          base16: ' '
        }
      }
    default:
      return state
  }
}

export default Auth