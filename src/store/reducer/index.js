import { combineReducers } from 'redux'
import auth from 'src/store/reducer/auth/auth'
import leaderboard from 'src/store/reducer/leaderboard/leaderboard'

const Reducers = combineReducers({
  auth,
  leaderboard,
})
export default Reducers
