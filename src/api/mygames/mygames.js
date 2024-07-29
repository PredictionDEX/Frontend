import { axiosInstance } from 'src/api/axiosInterceptor'


const getShortcutForMyGames = gameName => {
  if (gameName === 'football') {
    return 'fb'
  }
  if (gameName === 'basketball') {
    return 'bb'
  }
  if (gameName === 'cricket') {
    return 'ck'
  }
  return gameName
}
export const getMyGames = async ({
  gameName,
  walletAddressBase16,
  limit,
  offset,
  myGameFilter
}) => {
  if (walletAddressBase16) {
    let url = ''
    const params = {
      gameStatus: 'my-games',
      limit,
      offset
    }
    if (gameName === 'usermarket') {
      url = `user-market/my-markets/${walletAddressBase16}`
    } else {
      url = `games/mygames/${getShortcutForMyGames(
        gameName
      )}/${walletAddressBase16}`
    }
    if (myGameFilter) {
      params.myGameFilter = myGameFilter
    }
    // cancelRequestAxiosObject.cancelAndCreateToken()
    const { data } = await axiosInstance.get(url, {
      // cancelToken: cancelRequestAxiosObject.cancel_resquest.token,
      params
    })
    // cancelRequestAxiosObject.resetCancelToken()
    return data
  }
  return ''
}
