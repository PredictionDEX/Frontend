import { Zilliqa, BN, units } from '@zilliqa-js/zilliqa'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setAuthenticated,
  setInitialized,
  setNetwork,
  setWallet
} from 'src/store/action/auth/auth'

let isCheckedZilPayStatus = false

export const useZilpay = () => {
  const zilPayObj = (typeof window !== 'undefined' && window.zilPay) || ''
  const [zilPay, setZilPay] = useState(zilPayObj)

  const dispatch = useDispatch()
  const { network, walletAddress, isAuthenticated } = useSelector(state => ({
    walletAddress: state.auth.walletAddress,
    isAuthenticated: state.auth.isAuthenticated,
    network: state.auth.network
  }))
  const zilliqa = new Zilliqa(
    network === 'testnet'
      ? 'https://dev-api.zilliqa.com'
      : 'https://api.zilliqa.com'
  )
  const [progress, setProgress] = useState(false)
  useEffect(() => {
    setZilPay(window.zilPay)
    if (!isCheckedZilPayStatus && window.zilPay) {
      const walletDetail = window.localStorage.getItem('wallet-address')
      if (walletDetail) {
        dispatch(setAuthenticated(true))
        dispatch(setWallet(JSON.parse(walletDetail)))
        localStorage.setItem('zilchill-zp', true)
      }
      dispatch(setInitialized(true))
      isCheckedZilPayStatus = true
    }
  }, [zilPayObj])

  const connectWallet = async () =>
  new Promise((resolve, reject) => {
    if (!zilPay) {
      reject(new Error('Zilpay Not Found'))
    }
    if (zilPay.wallet.net !== network) {
      reject(new Error('Network Mismatch'))
    }
    zilPay.wallet.connect().then(isConnect => {
      if (isConnect) {
        window.localStorage.setItem(
          'wallet-address',
          JSON.stringify(zilPay.wallet.defaultAccount)
        )
        resolve(zilPay.wallet.defaultAccount)
      } else {
        reject(new Error('User Rejected'))
      }
    })
  })

  // const handleConnect = () => {
  //   connectWallet()
  //     .then(response => {
  //       const walletDetail = window.localStorage.getItem('wallet-address')
  //       if (walletDetail) {
  //         const detail = JSON.parse(walletDetail)
  //         if (detail && detail.bech32 !== response.bech32) {
  //           window.localStorage.setItem(
  //             'wallet-address',
  //             JSON.stringify(response)
  //           )
  //           dispatch(setAuthenticated(true))
  //           dispatch(setWallet(response))
  //           localStorage.setItem('zilchill-zp', true)
  //         }
  //       } else {
  //         window.localStorage.setItem(
  //           'wallet-address',
  //           JSON.stringify(response)
  //         )
  //         dispatch(setAuthenticated(true))
  //         dispatch(setWallet(response))
  //         localStorage.setItem('zilchill-zp', true)
  //       }
  //     })
  //     .catch(() => {
  //       dispatch(setAuthenticated(false))
  //     })
  // }
 
  const getState = async contractAddress => {
    if (zilPay) {
      if (zilPay.wallet.net !== network) {
        throw new Error('Network Mismatch')
      }
      await zilPay.wallet.connect()
      const contract = zilPay.contracts.at(contractAddress)
      return contract.getState()
    } 
      return new Promise((resolve, reject) => {
        reject(new Error('Zilpay Not Found'))
      })
    
  }
  const call = async (
    contractAddress,
    transition,
    params,
    amount,
    gasLimit
  ) => {
    const contract = zilPay.contracts.at(contractAddress)
    const gasPrice = units.toQa('2000', units.Units.Li)
    const minGasPrice = await zilliqa.blockchain.getMinimumGasPrice()
    const isGasSufficient = gasPrice.gte(new BN(minGasPrice.result))
    if (!isGasSufficient) {
      throw new Error('Gas not Sufficient')
    }
    await connectWallet()
    return contract.call(transition, params, {
      amount: amount
        ? units.toQa(amount.toString(), units.Units.Zil)
        : units.toQa('0', units.Units.Zil),
      gasPrice,
      gasLimit: gasLimit || 2500
    })
  }

  const watch = () => {
    setProgress(true)
    if (window.netObservable) {
      window.netObservable.unsubscribe()
    }
    if (window.accountObservable) {
      window.accountObservable.unsubscribe()
    }

    const walletDetail = window.localStorage.getItem('wallet-address')
    if (walletDetail) {
      const detail = JSON.parse(walletDetail)
      if (detail && detail.bech32 !== zilPay.wallet.defaultAccount.bech32) {
        window.localStorage.setItem(
          'wallet-address',
          JSON.stringify(zilPay.wallet.defaultAccount)
        )
        dispatch(setAuthenticated(true))
        dispatch(setWallet(zilPay.wallet.defaultAccount))
      }
    } else {
      window.localStorage.setItem(
        'wallet-address',
        JSON.stringify(zilPay.wallet.defaultAccount)
      )
      dispatch(setAuthenticated(true))
      dispatch(setWallet(zilPay.wallet.defaultAccount))
    }

    window.netObservable = zilPay.wallet.observableNetwork().subscribe(net => {
      dispatch(setNetwork(net))
    })
    window.accountObservable = zilPay.wallet
      .observableAccount()
      .subscribe(acc => {
        const walletDetail1 = window.localStorage.getItem('wallet-address')
        if (walletDetail1) {
          const detail = JSON.parse(walletDetail1)
          if (detail && detail.bech32 !== acc.bech32) {
            window.localStorage.setItem('wallet-address', JSON.stringify(acc))
            dispatch(setWallet(acc))
          }
        } else {
          window.localStorage.setItem('wallet-address', JSON.stringify(acc))
          dispatch(setWallet(acc))
        }
      })
    setProgress(false)
  }
  const checkIfConnected = () => {
    if (walletAddress && isAuthenticated) {
      return true
    }
    return false
  }

  const signMessage = async (message) => {
    if (zilPay) {
      const signed = await window.zilPay.wallet.sign(message);
      return signed;
    } 
      return new Promise((resolve, reject) => {
        reject(new Error("Zilpay Not Found"));
      });
    
  };

  return {
    zilPay,
    progress,
    checkIfConnected,
    watch,
    getState,
    connectWallet,
    call,
    signMessage
  }
}
