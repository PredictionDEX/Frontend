import {
  DISCONNECT_WALLET,
  SET_AUTHENTICATED,
  SET_INITIALIZED,
  SET_NETWORK,
  SET_WALLET
} from 'src/store/constants/constants'

export const setAuthenticated = isAuthenticated => async dispatch => {
  dispatch({ type: SET_AUTHENTICATED, payload: isAuthenticated })
}
export const setInitialized = isInitialized => async dispatch => {
  dispatch({ type: SET_INITIALIZED, payload: isInitialized })
}
export const setWallet = walletAddress => async dispatch => {
  dispatch({ type: SET_WALLET, payload: walletAddress })
}
export const setNetwork = network => async dispatch => {
  dispatch({ type: SET_NETWORK, payload: network })
}

export const disconnectWallet = () => async dispatch => {
  dispatch({ type: DISCONNECT_WALLET })
}
