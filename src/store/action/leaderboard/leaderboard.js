import { SET_LEADERBOARD } from 'src/store/constants/constants'

export const setLeaderBoard = leaderboard => async dispatch => {
  dispatch({ type: SET_LEADERBOARD, payload: leaderboard })
}
