import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { findUserPool, predictWinAmount } from 'src/utils/utils'
import Config from 'src/config/config'
import { useRouter } from 'next/dist/client/router'
import axios from 'axios'

export const useSingleMarket = () => {
  const history = useRouter()
  const params = history.query
  const getSingleGames = () => {}
  const getSingleMarket = () => {}
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
    axios
      .get(
        `https://api.viewblock.io/v1/zilliqa/addresses/${Config[network].UserMarket?.base16}/txs?network=${network}`,
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
    drawPoolAmount
  ) => {
    const winPool = findUserPool(
      pool,
      Number(winPoolAmount),
      Number(losePoolAmount),
      Number(drawPoolAmount)
    )
    const loosePool = predictWinAmount(
      pool,
      Number(winPoolAmount),
      Number(losePoolAmount),
      Number(drawPoolAmount)
    )
    let userShare = ''
    if (disabled) {
      userShare = Number.isFinite(Number(amount) / winPool)
        ? Number(amount) / winPool
        : null
    } else {
      userShare = Number.isFinite(Number(amount) / winPool)
        ? Number(amount) / (winPool + Number(amount))
        : null
    }
    if (userShare) {
      setProbableWin(userShare * (0.8 * loosePool))
    } else {
      setProbableWin(loosePool)
    }
  }

  const gameType = 'UserMarket'

  const getSingleGame = async () => {
    setLoading(true)
    getSingleMarket({
      gameId: params.game_id,
      walletAddressBase16: walletAddress.base16
    })
      .then(response => {
        setSingleGame(response[0])
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
      getSingleGame()
    }
  }, [walletAddress, params])

  useEffect(() => {
    if (
      singleGame &&
      params &&
      Object.keys(params).length > 0 &&
      Object.getPrototypeOf(params) === Object.prototype
    ) {
      if (singleGame.bets && singleGame.bets.bet) {
        setAmount(Number(singleGame.bets.bet[2] / 10 ** 12))
        setPool(singleGame.bets.bet[1])
        calculateProbableWin(
          singleGame?.bets.winPoolAmount,
          singleGame?.bets.losePoolAmount,
          singleGame?.bets.drawPoolAmount
        )
        setDisabled(true)
      }
    }
  }, [singleGame, walletAddress, params])
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
    amount,
    transactions,
    getSingleGames,
    setAmount,
    setPool,
    removeDisable,
    calculateProbableWin
  }
}
