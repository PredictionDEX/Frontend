import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  errorNotification,
  progressNotification
} from 'src/components/notification/notification'
import Config from 'src/config/config.json'
import { TxType } from 'src/config/Transaction'
import { useZilpay } from 'src/hooks/mixins/useZilpay'

export const useOpenCard = () => {
  const HOST_AMOUNT = 50
  const { walletAddress } = useSelector(state => ({
    walletAddress: state.auth.walletAddress
  }))
  const network = process.env.NEXT_PUBLIC_NETWORK
  const { checkIfConnected, getState, call } = useZilpay()
  const [show, setShow] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [checkAllowance, setCheckAllowance] = useState(false)
  const [transacting, setTransacting] = useState(false)
  const handleClose = () => setShow('')
  const handleShow = id => setShow(id)
  const handleTransaction = async (
    gameNameOrg,
    gameId,
    marketName,
    amount,
    team,
    refetchFunction
  ) => {
    const gameName = gameNameOrg === 'FeaturedMarkets' ? 'Football' : gameNameOrg
    setTransacting(true)
    const min = 1000
    const max = 100000000
    const betId = Math.round(min + Math.random() * (max - min))
    try {
      const callTx = await call(
        Config[network][gameName].base16,
        'createGame',
        [
          {
            vname: 'gameID',
            type: 'String',
            value: String(gameId)
          },
          {
            vname: 'gameName',
            type: 'String',
            value: String(marketName)
          },
          {
            vname: 'betID',
            type: 'String',
            value: String(betId)
          },
          {
            vname: 'amountToBet',
            type: 'Uint128',
            value: String(amount * 10 ** 9)
          },
          {
            vname: 'betSelected',
            type: 'Uint32',
            value: String(team)
          }
        ]
      )
      handleClose()
      progressNotification(
        callTx,
        TxType.HOST_GAME,
        marketName,
        () => {
          refetchFunction()
        },
        true
      )
    } catch (err) {
      errorNotification(err.message || 'Transaction Cancelled')
      handleClose()
      setTransacting(false)
    }
  }

  const handleAuthorization = async (
    gameNameOrg,
    gameId,
    marketName,
    amount,
    team,
    refetchFunction
  ) => {
    const gameName = gameNameOrg === 'FeaturedMarkets' ? 'Football' : gameNameOrg
    setTransacting(true)
    const authorizeAmount = amount * 10 * Config[network].Token.decimal
    try {
      const callTx = await call(
        Config[network].Token.bech32,
        'IncreaseAllowance',
        [
          {
            vname: 'spender',
            type: 'ByStr20',
            value: Config[network][gameName].base16
          },
          {
            vname: 'amount',
            type: 'Uint128',
            value: authorizeAmount.toString()
          }
        ]
      )
      handleClose()
      progressNotification(
        callTx,
        TxType.INCREASE_ALLOWANCE,
        marketName,
        () => {
          handleTransaction(
            gameName,
            gameId,
            marketName,
            amount,
            team,
            refetchFunction
          )
        },
        true
      )
    } catch (err) {
      errorNotification(err.message || 'Transaction Cancelled')
      setTransacting(false)
    }
  }
  const handleHostGame = (formParams, formData, refetchFunction) => {
    const { gameId, gameName, marketName } = formParams

    const { team } = formData

    const amount = HOST_AMOUNT
    if (authorized) {
      handleTransaction(
        gameName,
        gameId,
        marketName,
        amount,
        team,
        refetchFunction
      )
    } else {
      handleAuthorization(
        gameName,
        gameId,
        marketName,
        amount,
        team,
        refetchFunction
      )
    }
  }
  const handleOpenGames = (gameNameOrg, status, gameId) => {
    const gameName = gameNameOrg === 'FeaturedMarkets' ? 'Football' : gameNameOrg
    setCheckAllowance(true)
    if (checkIfConnected()) {
      handleShow(gameId)
      if (status === 'Hosting') {
        errorNotification('Game is being hosted by someone else.')
        setCheckAllowance(false)
      } else {
        getState(Config[network].Token.bech32).then(contractState => {
          const userBalance =
            contractState.balances[walletAddress?.base16?.toLowerCase()]
          if (userBalance > HOST_AMOUNT * 10 ** 9) {
            const userAllowance =
              (Object.keys(contractState.allowances).some(
                w => w === walletAddress?.base16?.toLowerCase()
              ) &&
                Object.keys(
                  contractState?.allowances[
                    walletAddress?.base16?.toLowerCase()
                  ]
                ).some(c => c === Config[network][gameName].base16) &&
                contractState.allowances[walletAddress?.base16?.toLowerCase()][
                  Config[network][gameName].base16
                ]) ||
              0
            if (parseInt(userAllowance, 10) > HOST_AMOUNT * 10 ** 9) {
              setAuthorized(true)
            }

            setCheckAllowance(false)
          } else {
            errorNotification("You don't have enough BET to host the game")
            handleShow('')
          }
        })
      }
    } else {
      errorNotification('Wallet Not Connected')
      setCheckAllowance(false)
      handleShow('')
    }
  }
  return {
    show,
    authorized,
    checkAllowance,
    transacting,
    handleOpenGames,
    handleClose,
    handleHostGame
  }
}
