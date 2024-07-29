import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { findUserPool, predictWinAmount } from 'src/utils/utils'
import Config from 'src/config/config'
import { useRouter } from 'next/dist/client/router'
import axios from 'axios'
import { getSingleGames } from 'src/api/games/games'

export const useSingleGame = () => {
  const history = useRouter()
  const params = history.query
  const gameName = params.game_name
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [singleGame, setSingleGame] = useState('')
  const { walletAddress, network } = useSelector(state => ({
    walletAddress: state.auth.walletAddress,
    network: state.auth.network
  }))
  const getTxnDetails = () => {
    setLoading(true)
    console.log('params', params)
    axios
      .get(
        `https://api.viewblock.io/v1/zilliqa/addresses/${Config[network][
          ['WorldCup', "FeaturedMarkets"].indexOf(params?.game_name) > 0 ? 'Football' : params?.game_name
        ]?.base16
        }/txs?network=${network}`,
        {
          headers: {
            'X-APIKEY': process.env.NEXT_PUBLIC_VB_API
          }
        }
      )
      .then(response => {
        setTransactions(response.data || [])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (
      params &&
      Object.keys(params).length !== 0 &&
      Object.getPrototypeOf(params) === Object.prototype
    ) {
      getTxnDetails()
    }
  }, [params])

  const [probableWin, setProbableWin] = useState('')
  const [pool, setPool] = useState('4')
  const [amount, setAmount] = useState()
  const [disabled, setDisabled] = useState(false)
  const calculateProbableWin = (
    winPoolAmount,
    losePoolAmount,
    drawPoolAmount,
    teamProps,
    amountProps
  ) => {
    const winPool = findUserPool(
      teamProps.toString(),
      Number(winPoolAmount),
      Number(losePoolAmount),
      Number(drawPoolAmount)
    )

    const loosePool = predictWinAmount(
      teamProps.toString(),
      Number(winPoolAmount),
      Number(losePoolAmount),
      Number(drawPoolAmount)
    )
    let userShare = ''
    if (disabled) {
      userShare = Number.isFinite(Number(amountProps) / winPool)
        ? Number(amountProps) / winPool
        : 1
    } else {
      userShare = Number.isFinite(Number(amountProps) / winPool)
        ? Number(amountProps) / (winPool + Number(amountProps))
        : 1
    }
    setProbableWin(userShare * (0.75 * (loosePool + winPool + Number(amountProps))))
  }

  const gameType = params?.game_name?.toLowerCase()

  const getSingleGameFromAPI = async () => {
    setLoading(true)
    getSingleGames({
      gameName: params?.game_name?.toLowerCase(),
      gameId: params.game_id,
      walletAddress: walletAddress.base16
    })
      .then(response => {
        setSingleGame(response.games[0])
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }
  const removeDisable = () => {
    setDisabled(false)
  }

  useEffect(() => {
    if (
      params &&
      Object.keys(params).length !== 0 &&
      Object.getPrototypeOf(params) === Object.prototype
    ) {
      getSingleGameFromAPI()
    }
  }, [walletAddress, params])

  return {
    gameType,
    singleGame,
    walletAddress,
    loading,
    disabled,
    error,
    probableWin,
    pool,
    history,
    gameName,
    amount,
    transactions,
    getSingleGames,
    getSingleGameFromAPI,
    setAmount,
    setPool,
    removeDisable,
    calculateProbableWin
  }
}
