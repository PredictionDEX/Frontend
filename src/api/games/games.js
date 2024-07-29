import { axiosInstance } from 'src/api/axiosInterceptor'

export const getGames = async (
  limit,
  offset,
  gameStatus,
  walletAddress,
  gameName,
  search
) => {
  let url = `games/${gameName}?limit=${limit}&offset=${offset}&status=${gameStatus}`
  if (
    gameName === 'UserMarkets' ||
    gameName === 'usermarkets' ||
    gameName === 'usermarket' ||
    gameName === 'UserMarket'
  ) {
    url = `markets?limit=${limit}&offset=${offset}&status=${gameStatus}`
  }
  if (gameName === 'Worldcup') {
    url = `games/football?limit=${limit}&offset=${offset}&status=${gameStatus}&leagueIds=4429`
  }
  if (gameName.toLowerCase() === 'featuredmarkets' ||
  gameName.toLowerCase() === 'featured') {
    url = `games/football?limit=${limit}&offset=${offset}&status=${gameStatus}&isFeatured=true`
  }
  if (walletAddress && walletAddress !== ' ') {
    url += `&walletAddress=${walletAddress}`
  }
  if (search && search !== ' ') {
    url += `&search=${search}`
  }
  const { data } = await axiosInstance.get(url)
  return {
    ...data,
    games: data.games.map(each=>({
      ...each,
      details: {
        ...each.details,
        strStatus: each.status === 'Completed' ? 'Completed' : each.details.strStatus
      }
    }))
  }
}
export const getSingleGames = async ({ gameName, gameId, walletAddress }) => {
  let url = `games/${gameName}?gameId=${gameId}`
  if (
    gameName === 'UserMarkets' ||
    gameName === 'usermarkets' ||
    gameName === 'usermarket' ||
    gameName === 'UserMarket'
  ) {
    url = `markets?gameId=${gameId}`
  }
  if (gameName === 'worldcup' || gameName === 'Worldcup') {
    url = `games/football?gameId=${gameId}&leagueIds=4429`
  }
  if (gameName.toLowerCase() === 'featuredmarkets' ||
  gameName.toLowerCase() === 'featured') {
    url = `games/football?gameId=${gameId}`
  }
  if (walletAddress && walletAddress !== ' ') {
    url += `&walletAddress=${walletAddress}`
  }
  const { data } = await axiosInstance.get(url)

  return data
}
export const getMyGames = async (
  limit,
  offset,
  gameStatus,
  walletAddress,
  gameName
) => {
  let url = `games/${gameName}?limit=${limit}&offset=${offset}&status=${gameStatus}`
  if (
    gameName === 'UserMarkets' ||
    gameName === 'usermarkets' ||
    gameName === 'usermarket' ||
    gameName === 'UserMarket'
  ) {
    url = `markets?status=MyGames`
  }
  if (walletAddress && walletAddress !== ' ') {
    url += `&walletAddress=${walletAddress}`
  }
  const { data } = await axiosInstance.get(url)

  return data
}

export const getStats = async () => {
  const { data } = await axiosInstance.get('games/stats')
  return data
}
export const getUserDashboardStats = async walletAddress => {
  if (walletAddress && walletAddress !== '') {
    const { data } = await axiosInstance.get(`user/${walletAddress}`)
    return data
  }
  throw new Error('Wallet Address is required')
}
export const getUnclaimedHosts = async ({ gameName, walletAddress }) => {
  if (walletAddress && walletAddress !== ' ' && gameName !== 'Worldcup') {
    const url = `games/unclaimed-hosts?gameType=${gameName}&walletAddress=${walletAddress}`
    const { data } = await axiosInstance.get(url)
    return data
  }
  throw new Error('Wallet Address is required')

}
export const getUnclaimedBets = async ({ gameName, walletAddress }) => {
  if (walletAddress && walletAddress !== ' ' && gameName !== 'Worldcup') {
      const url = `games/unclaimed-bets?gameType=${gameName}&walletAddress=${walletAddress}`
      const { data } = await axiosInstance.get(url)
      return data
  }
  throw new Error('Wallet Address is required')
}

export const addDisputeMessage = async formData => {
  const { data } = await axiosInstance.post('games/dispute', formData)
  return data
}
