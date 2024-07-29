import { useRouter } from 'next/dist/client/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { useCache } from 'src/hooks/mixins/useCache'
import { getUserMarket } from 'src/api/user-market/user-market'
import {
  setMarketCompletedGames,
  setMarketHostedGames,
  setMarketLiveGames,
  setMarketOpenGames
} from 'src/store/action/market/market'

export const useUserMarket = () => {
  const dispatch = useDispatch()
  // const { getFromCache } = useCache()
  const history = useRouter()
  const [toggleKey, setToggleKey] = useState('live')
  const [refetchGames, setRefetchGames] = useState(false)
  const [search, setSearch] = useState('')
  const handleSearch = e => {
    setSearch(e)
  }
  const [gameFilter, setGameFilter] = useState('default')
  const {
    marketRefetch,
    openGames,
    hostedGames,
    liveGames,
    completedGames,
    walletAddress
  } = useSelector(state => ({
    openGames: state.market.openGames,
    hostedGames: state.market.hostedGames,
    liveGames: state.market.liveGames,
    completedGames: state.market.completedGames,
    walletAddress: state.auth.walletAddress,
    marketRefetch: state.market.marketRefetch
  }))
  const params = {
    slidesPerView: 4,
    spaceBetween: 20,
    direction: 'horizontal',
    scrollbar: {
      el: '.swiper-scrollbar'
    },

    breakpoints: {
      1024: {
        slidesPerView: 4,
        spaceBetween: 100
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 100
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 100
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 100
      }
    }
  }

  const walletAddressBase16 = walletAddress?.base16

  const [openStatus, setOpenStatus] = useState({
    loading: false,
    error: false,
    moreLoading: false,
    moreError: false,
    offset: 0
  })
  const [hostedStatus, setHostedStatus] = useState({
    loading: false,
    error: false,

    moreLoading: false,
    moreError: false,
    offset: 0
  })
  const [liveStatus, setLiveStatus] = useState({
    loading: false,
    error: false,
    moreLoading: false,
    moreError: false,
    offset: 0
  })
  const [completedStatus, setCompletedStatus] = useState({
    loading: false,
    error: false,
    moreLoading: false,
    moreError: false,
    offset: 0,
    start: 0
  })

  const getOpenGames = async () => {
    if (openStatus.offset === 0) {
      setOpenStatus({ ...openStatus, loading: true })
    } else {
      setOpenStatus({ ...openStatus, moreLoading: true })
    }
    try {
      const openGamesBackend = await getUserMarket({
        type: 'open',
        walletAddress:walletAddressBase16
      })

      // const cachedData = getFromCache('open')
      // console.log('Cached Data', cachedData)

      // if (cachedData) {
      //   console.log('Found Open Cache', cachedData)
      //   const cachedGameforWallet = cachedData.filter(
      //     cache =>
      //       cache.wallet?.toLowerCase() === walletAddressBase16?.toLowerCase()
      //   )
      //   console.log('Cached Game Ids for Wallet', cachedGameforWallet)
      //   openGamesBackend = openGamesBackend.filter(
      //     game => !cachedGameforWallet.some(cache => cache.id === game.markt)
      //   )
      // }

      if (openStatus.offset === 0) {
        dispatch(setMarketOpenGames(openGamesBackend))
      } else {
        dispatch(setMarketOpenGames([...openGames, ...openGamesBackend]))
      }
      if (openStatus.offset === 0) {
        setOpenStatus({ ...openStatus, loading: false })
      } else {
        setOpenStatus({ ...openStatus, moreLoading: false })
      }
    } catch (e) {
      if (openStatus.offset === 0) {
        setOpenStatus({ ...openStatus, loading: false, error: true })
      } else {
        setOpenStatus({ ...openStatus, moreLoading: false, moreError: true })
      }
    }
  }
  const getHostedGames = async () => {
    if (hostedStatus.offset === 0) {
      setHostedStatus({ ...hostedStatus, loading: true })
    } else {
      setHostedStatus({ ...hostedStatus, moreLoading: true })
    }

    try {
      const hostedGamesBackend = await getUserMarket({
        type: 'hosted',
        walletAddress: walletAddressBase16
      })
      // const cachedData = getFromCache('hosted')
      // if (cachedData) {
      //   // eslint-disable-next-line no-restricted-syntax
      //   for (const game of hostedGamesBackend) {
      //     if (
      //       cachedData.some(
      //         cachedGame =>
      //           cachedGame.id === game.id &&
      //           cachedGame.wallet === walletAddressBase16
      //       )
      //     ) {
      //       const cachedGames = cachedData.find(
      //         cachedGame =>
      //           cachedGame.id === game.id &&
      //           cachedGame.wallet === walletAddressBase16
      //       )
      //       if (cachedGames.status === 'completed') {
      //         const cachedGame = cachedData.find(g => g.id === game.id)
      //         game.bets.bet = [
      //           String(cachedGame.id),
      //           String(cachedGame.selectedTeam),
      //           String(cachedGame.betAmount * 10 ** 12),
      //           walletAddressBase16
      //         ]
      //         if (cachedGame.selectedTeam === '0') {
      //           game.bets.winPoolAmount += Number(cachedGame.betAmount)
      //           game.bets.winPoolBets = Number(game.bets.winPoolBets) + 1
      //         }
      //         if (cachedGame.selectedTeam === '1') {
      //           game.bets.losePoolAmount += Number(cachedGame.betAmount)
      //           game.bets.losePoolBets = Number(game.bets.losePoolBets) + 1
      //         }
      //         if (cachedGame.selectedTeam === '2') {
      //           game.bets.drawPoolAmount += Number(cachedGame.betAmount)
      //           game.bets.drawPoolBets = Number(game.bets.drawPoolBets) + 1
      //         }
      //         game.bets.totalAmount += Number(cachedGame.betAmount)
      //         game.bets.totalBets = Number(game.bets.totalBets) + 1
      //         game.cacheProgress = false
      //       }
      //       if (cachedGames.status === 'progress') {
      //         game.cacheProgress = true
      //       }
      //       if (cachedGames.status === 'failed') {
      //         game.cacheProgress = false
      //       }
      //     }
      //   }
      // }
      if (hostedStatus.offset === 0) {
        dispatch(setMarketHostedGames(hostedGamesBackend))
      } else {
        dispatch(setMarketHostedGames([...hostedGames, ...hostedGamesBackend]))
      }
      if (hostedStatus.offset === 0) {
        setHostedStatus({ ...hostedStatus, loading: false })
      } else {
        setHostedStatus({ ...hostedStatus, moreLoading: false })
      }
    } catch (e) {
      if (hostedStatus.offset === 0) {
        setHostedStatus({ ...hostedStatus, loading: false, error: true })
      } else {
        setHostedStatus({ ...hostedStatus, moreLoading: false, error: true })
      }
    }
  }
  const getLiveGames = async () => {
    if (liveStatus.offset === 0) {
      setLiveStatus({ ...liveStatus, loading: true })
    } else {
      setLiveStatus({ ...liveStatus, moreLoading: true })
    }

    setLiveStatus({ ...liveStatus, loading: true })
    try {
      const liveGamesBackend = await getUserMarket({
        type: 'live',
        walletAddress: walletAddressBase16
      })
      if (liveGamesBackend.length === 0) {
        setToggleKey('completed')
      }
      if (liveStatus.offset === 0) {
        dispatch(setMarketLiveGames(liveGamesBackend))
      } else {
        dispatch(setMarketLiveGames([...liveGames, ...liveGamesBackend]))
      }
      if (liveStatus.offset === 0) {
        setLiveStatus({ ...liveStatus, loading: false })
      } else {
        setLiveStatus({ ...liveStatus, moreLoading: false })
      }
    } catch (e) {
      if (liveStatus.offset === 0) {
        setLiveStatus({ ...liveStatus, loading: false })
      } else {
        setLiveStatus({ ...liveStatus, moreLoading: false, moreError: true })
      }
    }
  }
  const getCompletedGames = async () => {
    if (completedStatus.offset === 0) {
      setCompletedStatus({ ...completedStatus, loading: true })
    } else {
      setCompletedStatus({ ...completedStatus, moreLoading: true })
    }
    try {
      const completedGamesBackend = await getUserMarket({
        type: 'completed',
        walletAddress: walletAddressBase16
      })
      if (completedStatus.offset === 0) {
        dispatch(setMarketCompletedGames(completedGamesBackend))
      } else {
        dispatch(setMarketCompletedGames([...completedGames, ...completedGamesBackend]))
      }
   
      if (completedStatus.offset === 0) {
        setCompletedStatus({ ...completedStatus, loading: false })
      } else {
        setCompletedStatus({
          ...completedStatus,
          loading: false,
          moreLoading: false
        })
      }
    } catch (e) {
      if (completedStatus.offset === 0) {
        setCompletedStatus({ ...completedStatus, loading: false })
      } else {
        setCompletedStatus({
          ...completedStatus,
          moreLoading: false,
          moreError: true
        })
      }
    }
  }

  useEffect(() => {
    getOpenGames()
  }, [openStatus.offset, walletAddress, marketRefetch.open, walletAddress])
  useEffect(() => {
    getHostedGames()
  }, [
    hostedStatus.offset,
    marketRefetch.hosted,
    search,
    walletAddress,
    gameFilter
  ])
  useEffect(() => {
    getLiveGames()
  }, [marketRefetch.live, liveStatus.offset])
  useEffect(() => {
    getCompletedGames()
  }, [marketRefetch.completed, completedStatus.offset])

  return {
    walletAddress,
    openGames,
    hostedGames,
    liveGames,
    completedGames,
    openStatus,
    setOpenStatus,
    hostedStatus,
    setHostedStatus,
    liveStatus,
    setLiveStatus,
    completedStatus,
    setCompletedStatus,
    params,
    refetchGames,
    search,
    history,
    gameFilter,
    setGameFilter,
    handleSearch,
    setRefetchGames,
    toggleKey,
    setToggleKey
  }
}
