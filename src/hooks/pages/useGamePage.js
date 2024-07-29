import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getGames, getStats } from 'src/api/games/games'

export const useGamePage = (gameName, defaultKey = 'Hosted') => {
  const { walletAddress, isInitialized } = useSelector(state => ({
    isInitialized: state.auth.isInitialized,
    walletAddress: state.auth.walletAddress
  }))

  const [stats, setStats] = useState({
    Football: { gameHosted: 0, betsNumber: 0, betsVolume: 0 },
    NBA: { gameHosted: 0, betsNumber: 0, betsVolume: 0 },
    NFL: { gameHosted: 0, betsNumber: 0, betsVolume: 0 },
    NHL: { gameHosted: 0, betsNumber: 0, betsVolume: 0 },
    total: { gameHosted: 0, betsNumber: 0, betsVolume: 0 }
  })
  const limit = 30
  const [gameStatus, setGameStatus] = useState({
    loading: false,
    error: false,
    offset: 0
  })

  const [games, setGames] = useState([])
  const [totalGames, setTotalGames] = useState([])
  const [toggleKey, setToggleKey] = useState(defaultKey)
  const [sidebar, showSidebar] = useState(false)
  const [search, setSearch] = useState('')
  const [prevToggleKey, setPrevToggleKey] = useState('')
  const getStatsfromAPI = () => {
    getStats().then(response => {
      setStats(response)
      setGameStatus({ ...gameStatus, loading: false })
    })
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
      toggleKey,
      walletAddress.base16,
      gameName,
      search
    )
      .then(data => {
        if (gameStatus.offset === 0) {
          setGames(data.games.sort((a, b) => b.isFeatured - a.isFeatured))
        } else {
          setGames(prev => [
            ...prev,
            ...data.games.sort((a, b) => b.isFeatured - a.isFeatured)
          ])
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
  useEffect(() => {
    getStatsfromAPI()
  }, [])

  useEffect(() => {
    if (isInitialized) {
      setPrevToggleKey(toggleKey)
      getGamesFromAPI()
    }
  }, [toggleKey, walletAddress, isInitialized, gameStatus.offset, search])

  const handleViewMore = () => {
    setGameStatus({
      ...gameStatus,
      offset: gameStatus.offset + limit
    })
  }

  const handleSearch = e => {
    setSearch(e)
  }

  return {
    games,
    walletAddress,
    toggleKey,
    gameStatus,
    totalGames,
    search,
    sidebar,
    stats,
    setToggleKey,
    handleViewMore,
    getGamesFromAPI,
    showSidebar,
    handleSearch
  }
}
