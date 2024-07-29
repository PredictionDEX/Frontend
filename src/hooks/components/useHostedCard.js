/* eslint-disable prefer-destructuring */
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  errorNotification,
  progressNotification
} from 'src/components/notification/notification'
import Config from 'src/config/config.json'
import { useZilpay } from 'src/hooks/mixins/useZilpay'
import { TxType } from 'src/config/Transaction'
import { capitalize } from 'src/utils/utils'
import { useZilliqa } from 'src/hooks/mixins/useZilliqa'
import { addDisputeMessage } from 'src/api/games/games'

export const useHostedCard = () => {
  const { network, walletAddress } = useSelector(state => ({
    network: state.auth.network,
    walletAddress: state.auth.walletAddress
  }))
  const [checkAllowance, setCheckAllowance] = useState(false)
  const [show, setShow] = useState(false)
  const { getCurrentBlock } = useZilliqa()
  const [currentBlock, setCurrentBlock] = useState(0)
  const getBlock = async () => {
    const block = await getCurrentBlock()
    setCurrentBlock(block.header.BlockNum)
  }
  useEffect(() => {
    getBlock()
  }, [])
  const [videoModal, setVideoModal] = useState(false)
  const { checkIfConnected, call, getState } = useZilpay()
  const handleClose = () => setShow('')
  const handleShow = id => setShow(id)
  const mapBetName = {
    0: 'winPoolIds',
    1: 'losePoolIds',
    2: 'drawPoolIds'
  }
  const handleTransaction = async (gameParams, formParams, refetchFunction) => {
    try {
      const { gameName: gameNameOrg, gameId, marketName, bets } = gameParams
      const gameName = gameNameOrg === 'FeaturedMarkets' ? 'Football' : gameNameOrg
      const { amount, team } = formParams
      let betId = ''
      if (bets[mapBetName[team]].length > 0) {
        betId = bets[mapBetName[team]][0]
      } else {
        const min = 1000
        const max = 100000000
        betId = Math.round(min + Math.random() * (max - min))
      }
      const callTx = await call(
        Config[network][capitalize(gameName)].base16,
        'bet',
        [
          {
            vname: 'gameID',
            type: 'String',
            value: String(gameId)
          },
          {
            vname: 'betID',
            type: 'String',
            value: String(betId)
          },
          {
            vname: 'betSelected',
            type: 'Uint32',
            value: String(team)
          },
          {
            vname: 'amountToBet',
            type: 'Uint128',
            value: String(amount * 10 ** 9)
          }
        ]
      )
      handleClose()
      progressNotification(
        callTx,
        TxType.PREDICT,
        marketName,
        () => {
          refetchFunction()
        },
        true
      )
    } catch (err) {
      handleClose()
      errorNotification(err.message || 'Transaction Cancelled')
    }
  }
  const handleDisputeTransaction = async (
    gameParams,
    formData,
    refetchFunction
  ) => {
    if (checkIfConnected()) {
      try {
        const { gameName: gameNameOrg, gameId } = gameParams
        const gameName = gameNameOrg === 'FeaturedMarkets' ? 'Football' : gameNameOrg
        const { correctScore, description } = formData

        const callTx = await call(
          Config[network][gameName].base16,
          'disputeResult',
          [
            {
              vname: 'gameID',
              type: 'String',
              value: String(gameId)
            }
          ]
        )
        progressNotification(
          callTx,
          'Dispute Game',
          gameName,
          () => {
            addDisputeMessage({
              gameId,
              disputeReason: description,
              correctScore,
              disputedBy: walletAddress.bech32
            }).then(() => {
              if (refetchFunction) {
                refetchFunction()
              }
            })
          },
          true
        )
      } catch (err) {
        handleClose()
        errorNotification(err.message || 'Transaction Cancelled')
      }
    } else {
      errorNotification('Connect Your Wallet')
    }
  }
  const handleAuthorization = async (
    gameParams,
    formParams,
    refetchFunction,
    isDispute
  ) => {
    const { gameName: gameNameOrg, marketName } = gameParams
    const gameName = gameNameOrg === 'FeaturedMarkets' ? 'Football' : gameNameOrg
    const amount = 100
    const authorizeAmount = amount * 100 * Config[network].Token.decimal
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
          if (isDispute) {
            handleDisputeTransaction(gameParams, formParams, refetchFunction)
          } else {
            handleTransaction(gameParams, formParams, refetchFunction)
          }
        },
        true
      )
    } catch (err) {
      errorNotification(err.message || 'Transaction Cancelled')
    }
  }

  const handlePredictGame = async (gameParams, formParams, refetchFunction) => {
    const { amount } = formParams
    const { gameName: gameNameOrg } = gameParams
    const gameName = gameNameOrg === 'FeaturedMarkets' ? 'Football' : gameNameOrg
    setCheckAllowance(true)
    getState(Config[network].Token.bech32).then(contractState => {
      const userBalance =
        contractState.balances[walletAddress?.base16?.toLowerCase()]
      if (userBalance > amount * 10 ** 9) {
        const userAllowance =
          (Object.keys(contractState.allowances).some(
            w => w === walletAddress?.base16?.toLowerCase()
          ) &&
            Object.keys(
              contractState?.allowances[walletAddress?.base16?.toLowerCase()]
            ).some(c => c === Config[network][gameName].base16) &&
            contractState.allowances[walletAddress?.base16?.toLowerCase()][
              Config[network][gameName].base16
            ]) ||
          0
        if (parseInt(userAllowance, 10) > amount * 10 ** 9) {
          setCheckAllowance(false)
          handleTransaction(gameParams, formParams, refetchFunction)
        } else {
          handleAuthorization(gameParams, formParams, refetchFunction)
          setCheckAllowance(false)
        }
      } else {
        errorNotification("You don't have enough BET to predict on the market.")
        handleShow('')
      }
    })
  }
  const [showDisputed, setShowDisputed] = useState(false)

  const handleDisputeGame = (gameParams, formParams, refetchFunction) => {
    const amount = 100
    const { gameName: gameNameOrg } = gameParams
    const gameName = gameNameOrg === 'FeaturedMarkets' ? 'Football' : gameNameOrg
    setCheckAllowance(true)
    getState(Config[network].Token.bech32).then(contractState => {
      const userBalance =
        contractState.balances[walletAddress?.base16?.toLowerCase()]
      if (userBalance >= amount * 10 ** 9) {
        const userAllowance =
          (Object.keys(contractState.allowances).some(
            w => w === walletAddress?.base16?.toLowerCase()
          ) &&
            Object.keys(
              contractState?.allowances[walletAddress?.base16?.toLowerCase()]
            ).some(c => c === Config[network][gameName].base16) &&
            contractState.allowances[walletAddress?.base16?.toLowerCase()][
              Config[network][gameName].base16
            ]) ||
          0
        if (parseInt(userAllowance, 10) > amount * 10 ** 9) {
          setCheckAllowance(false)
          handleDisputeTransaction(gameParams, formParams, refetchFunction)
        } else {
          handleAuthorization(gameParams, formParams, refetchFunction, true)
          setCheckAllowance(false)
        }
      } else {
        setCheckAllowance(false)
        errorNotification("You don't have enough BET to dispute the market.")
        handleShow('')
      }
    })
  }
  const handleCloseDisputed = () => {
    setShowDisputed(false)
  }
  const handleHostedGames = gameId => {
    if (checkIfConnected()) {
      handleShow(gameId)
    } else {
      errorNotification('Wallet Not Connected')
      handleShow('')
    }
  }
  const handleDisputeGames = () => {
    if (checkIfConnected()) {
      setShowDisputed(true)
    } else {
      errorNotification('Wallet Not Connected')
      setShowDisputed(false)
    }
  }
  // const handleRefund = async (gameName, gameId) => {
  //   if (checkIfConnected()) {
  //     try {
  //       const callTx = await call(
  //         Config[network][gameName].base16,
  //         'withdrawFromAborted',
  //         [
  //           {
  //             vname: 'gameID',
  //             type: 'String',
  //             value: gameId.toString()
  //           }
  //         ]
  //       )
  //       progressNotification(callTx, TxType.REFUND, gameName)
  //     } catch (err) {
  //       handleClose()
  //       errorNotification(err.message || 'Transaction Cancelled')
  //     }
  //   } else {
  //     errorNotification('Connect Your Wallet')
  //   }
  // }
  // const handleClaim = async (gameName, gameId) => {
  //   if (checkIfConnected()) {
  //     try {
  //       const callTx = await call(Config[network][gameName].base16, 'redeem', [
  //         {
  //           vname: 'gameID',
  //           type: 'String',
  //           value: gameId.toString()
  //         }
  //       ])
  //       progressNotification(callTx, TxType.CLAIM, gameName)
  //     } catch (err) {
  //       handleClose()
  //       errorNotification(err.message || 'Transaction Cancelled')
  //     }
  //   } else {
  //     errorNotification('Connect Your Wallet')
  //   }
  // }

  return {
    show,
    videoModal,
    checkAllowance,
    currentBlock,
    showDisputed,
    handleDisputeGame,
    handleDisputeTransaction,
    handleCloseDisputed,
    setVideoModal,
    handleClose,
    handleShow,
    handleDisputeGames,
    handleHostedGames,
    handlePredictGame
  }
}
