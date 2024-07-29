import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  getGames,
  getUnclaimedBets,
  getUnclaimedHosts,
  getUserDashboardStats
} from 'src/api/games/games'
import { rewardForXBet } from 'src/utils/utils'

export const useProfile = gameName => {
  const { walletAddress, isInitialized } = useSelector(state => ({
    isInitialized: state.auth.isInitialized,
    walletAddress: state.auth.walletAddress
  }))

  // const [walletAddress] = useState({
  //   base16: '0x2e654851df3c1c716b87fc5a9c4fd6b403000d13',
  //   bech32: 'zil19ej5s5wl8sw8z6u8l3dfcn7kkspsqrgngkksdn'
  // })
  const [games, setGames] = useState([])
  const [totalGames, setTotalGames] = useState([])
  const [toggleKey, setToggleKey] = useState('Worldcup')
  const [profileToggle, setProfileToggle] = useState('Dashboard')
  const router = useRouter()
  const [prevToggleKey, setPrevToggleKey] = useState('')
  const [unclaimedHosts, setUnclaimedHosts] = useState({
    unclaimedCount: 0,
    unclaimedIds: [],
    data: [],
  })
  const [unclaimedGames, setUnclaimedGames] = useState({
    unclaimedCount: 0,
    unclaimedIds: [],
    data: []
  })
  const [dashboardStats, setDashboardStats] = useState('')
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const trimWallet = wallet =>
    wallet &&
    `${String(wallet).substring(0, 4)}
      ...
      ${String(wallet).substring(wallet.length - 4, wallet.length)}`

  const limit = 30
  const [gameStatus, setGameStatus] = useState({
    loading: false,
    error: false,
    offset: 0
  })
  const [betLoading, setBetLoading] = useState(false)

  const betsMapping = {
    0: 'userWinPoolAmount',
    1: 'userLosePoolAmount',
    2: 'userDrawPoolAmount'
  }
  const totalBetsMapping = {
    0: 'winPoolBetAmount',
    1: 'losePoolBetAmount',
    2: 'drawPoolBetAmount'
  }

  const computeRewardAmount = (game, winner) => {
    if (
      game?.result.winner === winner &&
      game.bets.userBet[betsMapping[Number(winner)]] > 0
    )
      return rewardForXBet(
        game.bets.userBet[betsMapping[Number(winner)]],
        game.bets[totalBetsMapping[Number(winner)]],
        game.bets.distributePool * 0.75
      ).toFixed(2)
    return 0
  }

  const getBetsStatus = async () => {
    setBetLoading(true)
    const unclaimedHostsData = await getUnclaimedHosts({
      gameName: toggleKey,
      walletAddress: walletAddress.base16
    })
    const unclaimedBets = await getUnclaimedBets({
      gameName: toggleKey,
      walletAddress: walletAddress.base16
    })
    console.log('unclaimedBets', unclaimedBets)
    setUnclaimedGames({
      unclaimedCount: unclaimedBets?.unclaimedCount,
      unclaimedIds: unclaimedBets?.unclaimedIds,
      data: unclaimedBets?.unclaimedGames.map(ids => ({
        gameId: ids._id,
        betId: unclaimedBets?.unclaimedIds?.find(id => ids._id === id.gameId).betId,
        name: ids?.details?.strEvent,
        bets: ids?.bets,
        result: ids?.result,
        reward: Number(
          computeRewardAmount(
            {
              bets:
                ids.bets,
              result:
                ids.result
            },
            '0'
          )
        ) +
          Number(
            computeRewardAmount(
              {
                bets:
                  ids.bets,
                result:
                  ids.result
              },
              '1'
            )
          ) +
          Number(
            computeRewardAmount(
              {
                bets:
                  ids.bets,
                result:
                  ids.result
              },
              '2'
            )
          )

      }))
    })
    setUnclaimedHosts({
      unclaimedCount: unclaimedHostsData?.unclaimedCount,
      unclaimedIds: unclaimedHostsData?.unclaimedIds,
      data: unclaimedHostsData?.unclaimedIds.map(id => ({
        gameId: id,
        name: unclaimedHostsData?.unclaimedGames?.find(game => id === game?.details?.idEvent)?.details?.strEvent,
        bets: unclaimedHostsData?.unclaimedGames?.find(game => id === game?.details?.idEvent)?.bets,
        result: unclaimedHostsData?.unclaimedGames?.find(game => id === game?.details?.idEvent)?.result,
        reward: Number(
          (unclaimedHostsData?.unclaimedGames?.find(game => id === game?.details?.idEvent)?.bets?.distributePool *0.05) ?? 0
        )
      }))
    })
    setBetLoading(false)
  }
  const getGamesFromAPI = async () => {
    if (toggleKey !== prevToggleKey) {
      setGames([])
      setTotalGames(0)
      setGameStatus(prev => ({ ...prev, offset: 0 }))
    }
    if (gameStatus.offset === 0) {
      setGameStatus(prev => ({ ...prev, loading: true }))
    }
    getGames(
      limit,
      gameStatus.offset,
      gameName,
      walletAddress.base16,
      toggleKey
    )
      .then(async data => {
        if (gameStatus.offset === 0) {
          setGames(data.games)
        } else {
          setGames(prev => [...prev, ...data.games])
        }
        setTotalGames(data.totalGames)
        setGameStatus(prev => ({ ...prev, loading: false }))
      })
      .catch(() => {
        setGames([])
        setTotalGames(0)
        setGameStatus(prev => ({ ...prev, loading: false }))
      })
  }
  const getDashboardStats = async () => {
    setDashboardLoading(true)
    setDashboardStats(await getUserDashboardStats(walletAddress.base16))
    setDashboardLoading(false)
  }
  useEffect(() => {
    if (isInitialized) {
      setPrevToggleKey(toggleKey)
      getGamesFromAPI()
      getDashboardStats()
    }
  }, [toggleKey, walletAddress, isInitialized, gameStatus.offset])

  useEffect(() => {
    if (walletAddress && walletAddress.base16 !== ' ') {
      getBetsStatus()
    }
  }, [walletAddress, toggleKey])

  const updateProfileToggle = toggle => {
    router.replace(router.pathname, `${router.pathname}#${toggle}`, { shallow: true })
  }

  const updateToggleKey = toggle => {
    router.replace(router.pathname, `${router.pathname}#${profileToggle}-${toggle}`, { shallow: true })

  }

  useEffect(() => {

    if (router.asPath) {
      const gameType = router.asPath.split('#')
      if (gameType.length > 1) {
        const mixedKey = gameType[1].split('-')
        if (mixedKey.length > 1) {
          setToggleKey(mixedKey[1])
          setProfileToggle(mixedKey[0])
        } else if (mixedKey.length === 1) {
          setProfileToggle(mixedKey[0])
        }
      }
    }
  }, [router.asPath])

  const handleViewMore = () => {
    setGameStatus({
      ...gameStatus,
      offset: gameStatus.offset + limit
    })
  }

  return {
    games,
    walletAddress,
    toggleKey,
    gameStatus,
    totalGames,
    profileToggle,
    unclaimedHosts,
    unclaimedGames,
    betLoading,
    dashboardStats,
    dashboardLoading,
    trimWallet,
    updateProfileToggle,
    updateToggleKey,
    handleViewMore,
    getGamesFromAPI,
    getBetsStatus
  }
}
