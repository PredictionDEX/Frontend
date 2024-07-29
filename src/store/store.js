import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import Reducers from 'src/store/reducer/index'

const initialState = {
  auth: {
    isAuthenticated: false,
    walletAddress: {
      bech32: ' ',
      base16: ' '
    },
    isInitialized: false,
    network: process.env.NEXT_PUBLIC_NETWORK
  },
  leaderboard: {
    highestBet: { address: '', amount: '' },
    activePlayer: { address: '', gameCount: '' },
    biggestWinner: { address: '', redeemed: '', amount: '' },
    top40Players: [],
    top40Hosts: [],
    top10Governer: [],
    top7Airdrop: [],
    lastUpdatedAt: '',
    userRank: '',
    rewardsToBeDistributed: '',
    sliderData: [],
    topPlayers: [],

  },
}

const Store = createStore(
  Reducers,
  initialState,
  compose(
    applyMiddleware(thunkMiddleware),
    // eslint-disable-next-line no-underscore-dangle
    typeof window !== 'undefined' && window?.__REDUX_DEVTOOLS_EXTENSION__
      ? // eslint-disable-next-line no-underscore-dangle
        window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
)

export default Store
