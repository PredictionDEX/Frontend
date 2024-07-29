import { useRouter } from 'next/dist/client/router'
import { useEffect , useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  errorNotification,
  successNotification
} from 'src/components/notification/notification'
import { useZilpay } from 'src/hooks/mixins/useZilpay'
import {
  disconnectWallet,
  setAuthenticated,
  setWallet
} from 'src/store/action/auth/auth'
import Config from 'src/config/config.json'
import { useZilliqa } from '../mixins/useZilliqa'

export const useNavbar = () => {
  const { isAuthenticated, walletAddress } = useSelector(state => ({
    isAuthenticated: state.auth.isAuthenticated,
    walletAddress: state.auth.walletAddress
  }))
  const [showPrediction, setShowPrediction] = useState(false)
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const dispatch = useDispatch()
  const { connectWallet, progress } = useZilpay()
  const { getStateZilliqa } = useZilliqa()
  const handleConnect = () => {
    connectWallet()
      .then(response => {
        const walletDetail = window.localStorage.getItem('wallet-address')
        if (walletDetail && !walletAddress) {
          const detail = JSON.parse(walletDetail)

          if (detail && detail.bech32 !== response.bech32) {
            window.localStorage.setItem(
              'wallet-address',
              JSON.stringify(response)
            )
            dispatch(setAuthenticated(true))
            dispatch(setWallet(response))
            localStorage.setItem('zilchill-zp', true)
            successNotification('Wallet Connected Successfully')
          }
        } else {
          window.localStorage.setItem(
            'wallet-address',
            JSON.stringify(response)
          )
          dispatch(setAuthenticated(true))
          dispatch(setWallet(response))
          localStorage.setItem('zilchill-zp', true)
          successNotification('Wallet Connected Successfully')
        }
      })
      .catch(error => {
        errorNotification(error.message)
        dispatch(setAuthenticated(false))
      })
  }
  const trimWallet = wallet =>
    wallet &&
    `${String(wallet).substring(0, 5)}
      ...
      ${String(wallet).substring(wallet.length - 4, wallet.length)}`
  const network = process.env.NEXT_PUBLIC_NETWORK
  const handleDisconnect = () => {
    localStorage.removeItem('zilchill-zp')
    localStorage.removeItem('wallet-address')
    setExpanded(false)
    dispatch(disconnectWallet())
  }
  const [userBalance, setUserBalance] = useState('')
  const [balanceLoading, setBalanceLoading] = useState(false)
  const fetchUserBalance = async () => {
    setBalanceLoading(true)
    const contractState = await getStateZilliqa(Config[network].Token.base16)
    const balance =
      contractState?.balances[walletAddress.base16.toLowerCase()] || 0
    setUserBalance(balance)
    setBalanceLoading(false)
  }
  useEffect(() => {
    fetchUserBalance()
  }, [walletAddress])
  return {
    progress,
    expanded,
    setExpanded,
    userBalance,
    balanceLoading,
    isAuthenticated,
    showPrediction,
    setShowPrediction,
    walletAddress,
    handleDisconnect,
    handleConnect,
    trimWallet,
    router
  }
}
