import { SET_LEADERBOARD } from 'src/store/constants/constants'

const LeaderBoard = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_LEADERBOARD:
      return {
        ...state,
        ...payload
      }

    default:
      return state
  }
}

export default LeaderBoard
