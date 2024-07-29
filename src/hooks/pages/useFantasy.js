import { Zilliqa } from '@zilliqa-js/zilliqa'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const useFantasy = () => {
  const [show, setShow] = useState(false)
  const [usdRate, setUsdRate] = useState({
    redc: 0,
    zil: 0,
    zusdt: 0
  })
  const [tokenBalance, setTokenBalance] = useState({
    redc: 0,
    zil: 0,
    zusdt: 0
  })

  const { walletAddress, isAuthenticated, network } = useSelector(state => ({
    walletAddress: state.auth.walletAddress,
    isAuthenticated: state.auth.isAuthenticated,
    network: state.auth.network
  }))

  const contracts = {
    zUSDT: 'zil1sxx29cshups269ahh5qjffyr58mxjv9ft78jqy',
    REDC: 'zil14jmjrkvfcz2uvj3y69kl6gas34ecuf2j5ggmye'
  }
  const [selectedToken, setSelectedToken] = useState('none')
  const [selectedTokenUSD, setSelectedTokenUSD] = useState(0)
  const [selectedTokenBalance, setSelectedTokenBalance] = useState(0)
  const [error, setError] = useState({
    status: false,
    message: ''
  })
  const validateTokens = (usd, balance) => {
    if (Number(balance) < Number(10 * (1 / usd))) {
      setError({
        status: true,
        message: 'Insufficient Balance'
      })
    }
  }
  const handleSelectedToken = value => {
    setSelectedToken(value)
    if (value === 'REDC') {
      setSelectedTokenUSD(usdRate.redc)
      setSelectedTokenBalance(tokenBalance.redc)
      validateTokens(usdRate.redc, tokenBalance.redc)
    }
    if (value === 'ZIL') {
      setSelectedTokenUSD(usdRate.zil)
      setSelectedTokenBalance(tokenBalance.zil)
      validateTokens(usdRate.zil, tokenBalance.zil)
    }
    if (value === 'zUSDT') {
      setSelectedTokenUSD(usdRate.zusdt)
      setSelectedTokenBalance(tokenBalance.zusdt)
      validateTokens(usdRate.zusdt, tokenBalance.zusdt)
    }
  }
  const getPriceFromZilStream = async () => {
    const { data } = await axios.get('https://io-cdn.zilstream.com/tokens')
    const redc = data.filter(item => item.name === 'RedChillies')
    const zil = data.filter(item => item.name === 'Zilliqa')
    const zusdt = data.filter(item => item.name === 'Tether')
    setUsdRate({
      redc: redc[0].market_data.rate_usd,
      zil: zil[0].market_data.rate_usd,
      zusdt: zusdt[0].market_data.rate_usd
    })
    setSelectedTokenUSD(redc[0].market_data.rate_usd)
  }

  const getUserBalance = async (contract, decimal, isZil) => {
    const zilliqa = new Zilliqa(
      network === 'testnet'
        ? 'https://dev-api.zilliqa.com'
        : 'https://api.zilliqa.com'
    )
    if (isZil) {
      const { result } = await zilliqa.blockchain.getBalance(
        walletAddress.base16
      )
      if (!result) {
        return 0
      }
      return result.balance / 10 ** decimal
    }
    const { result } = await zilliqa.blockchain.getSmartContractSubState(
      contract,
      'balances'
    )
    if (!result) {
      return 0
    }

    if (result.balances[walletAddress?.base16?.toLowerCase()]) {
      return (
        result.balances[walletAddress?.base16?.toLowerCase()] /
        10 ** decimal
      )
    }
    return 0
  }
  useEffect(() => {
    getPriceFromZilStream()
  }, [])
  const fetchUserBalances = async () => {
    const redCBalance = await getUserBalance(contracts.REDC, 9, false)
    const zUSDTBalance = await getUserBalance(contracts.zUSDT, 12, false)
    const zilBalance = await getUserBalance(contracts.ZIL, 12, true)
    setTokenBalance({
      redc: redCBalance,
      zil: zilBalance,
      zusdt: zUSDTBalance
    })
  }
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserBalances()
    }
  }, [isAuthenticated, network])
  const handleClose = () => {
    setShow(false)

    setSelectedToken('none')
    setSelectedTokenBalance(0)
    setSelectedTokenUSD(0)
  }
  const handleShow = () => {
    setShow(true)
    setError({
      status: false,
      message: ''
    })
    setSelectedToken('none')
    setSelectedTokenBalance(0)
    setSelectedTokenUSD(0)
  }

  return {
    show,
    selectedToken,
    selectedTokenUSD,
    usdRate,
    tokenBalance,
    error,
    handleShow,
    handleClose,
    handleSelectedToken,
    selectedTokenBalance
  }
}
