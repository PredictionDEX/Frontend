/* eslint-disable prefer-destructuring */
import { useState } from 'react'
import {
  errorNotification,
  progressNotification
} from 'src/components/notification/notification'
import { rewardForXBet } from 'src/utils/utils'
import { useZilpay } from 'src/hooks/mixins/useZilpay'
import Config from 'src/config/config.json'
import { useSelector } from 'react-redux'
import { getJSONValue } from 'src/utils/scillaJsonUtils'
import { TxType } from 'src/config/Transaction'

export const useMyGameTabs = (gameStatus, games) => {
  const { walletAddress } = useSelector(state => ({
    isInitialized: state.auth.isInitialized,
    walletAddress: state.auth.walletAddress
  }))
  // const [walletAddress] = useState({
  //   base16: '0x2E654851df3c1c716B87FC5A9c4Fd6b403000D13',
  //   bech32: 'zil19ej5s5wl8sw8z6u8l3dfcn7kkspsqrgngkksdn'
  // })

  const [rewards, setRewards] = useState('')
  const [selectedGamesReward, setSelectedGamesReward] = useState([])
  const [showBetRewardModal, setShowBetRewardModal] = useState(false)
  const [showHostRewardModal, setShowHostRewardModal] = useState(false)
  const [selectedGameIds, setSelectedGameIds] = useState([])

  const handleOpen = gameId => setRewards(gameId)
  const handleClose = () => setRewards('')

  const handleBetHostRewardModalClose = () => {
    setShowBetRewardModal(false)
    setShowHostRewardModal(false)
    setSelectedGameIds([])
    setSelectedGamesReward([])
  }
  const { call, checkIfConnected } = useZilpay()
  const network = process.env.NEXT_PUBLIC_NETWORK

  const commonMessages = (
    <div className="pt-3">
      {gameStatus.loading && <h6 className="text-light">Loading</h6>}
      {!gameStatus.loading && games.length === 0 && (
        <h6 className="text-light">No Markets Found</h6>
      )}
    </div>
  )
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

  const mapBetName = {
    0: 'winPoolIds',
    1: 'losePoolIds',
    2: 'drawPoolIds'
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
  const handleClaim = async (gameName, game) => {
    if (checkIfConnected()) {
      let betId = '0'
      try {
        for (let i = 0; i < 3; i+=1) {
          if (computeRewardAmount(game, String(i)) > 0) {
            betId = game.bets.userBet[mapBetName[i]][0]
          }
        }
        const callTx = await call(Config[network][gameName].base16, 'Redeem', [
          {
            vname: 'pairData',
            type: 'Pair (String)(String)',
            value: getJSONValue(
              [game.details.idEvent, betId],
              'Pair (String)(String)'
            )
          }
        ])
        progressNotification(callTx, TxType.CLAIM, gameName, () => { }, true)
      } catch (err) {
        handleClose()
        errorNotification(err.message || 'Transaction Cancelled')
      }
    } else {
      errorNotification('Connect Your Wallet')
    }
  }
  const handleClaimHostReward = async (gameNameOrg, gameIds, callBack) => {
    const gameName = gameNameOrg === 'FeaturedMarkets' ? 'Football' : gameNameOrg
    if (checkIfConnected()) {
      let formattedGameIds = gameIds
      if (formattedGameIds.length > 8) {
        formattedGameIds = formattedGameIds.slice(0, 8)
      }
      try {

        const callTx = await call(
          Config[network][gameName].base16,
          'MultipleClaimHostReward',
          [
            {
              vname: 'gameIDs',
              type: 'List (String)',
              value: getJSONValue(formattedGameIds, 'List(String)')
            }
          ],
          0,
          5000 * formattedGameIds.length
        )
        progressNotification(callTx, TxType.CLAIM, gameName, () => { }, true)
        handleBetHostRewardModalClose()
        if (callBack) {
          callBack()
        }
      } catch (err) {
        handleClose()
        handleBetHostRewardModalClose()
        errorNotification(err.message || 'Transaction Cancelled')
      }
    } else {
      errorNotification('Connect Your Wallet')
      handleBetHostRewardModalClose()

    }
  }
  const handleClaimBetReward = async (gameNameOrg, gameIds, callBack) => {
    const gameName = gameNameOrg === 'FeaturedMarkets' ? 'Football' : gameNameOrg
    if (checkIfConnected()) {
      try {
        let formattedGameIds = gameIds.map(item => [item.gameId, item.betId])
        if (formattedGameIds.length > 8) {
          formattedGameIds = formattedGameIds.slice(0, 8)
        }
        const callTx = await call(
          Config[network][gameName].base16,
          'MultipleRedeem',
          [
            {
              vname: 'pairList',
              type: 'List (Pair (String) (String))',
              value: getJSONValue(
                formattedGameIds,
                'List (Pair (String) (String))'
              )
            }
          ],
          0,
          5000 * formattedGameIds.length
        )
        progressNotification(
          callTx,
          TxType.REDEEM,
          `Claiming Rewards for ${gameName} games`,
          () => { },
          true
        )
        handleBetHostRewardModalClose()
        if (callBack) {
          callBack()
        }
      } catch (err) {
        handleBetHostRewardModalClose()
        errorNotification(err.message || 'Transaction Cancelled')
      }
    } else {
      errorNotification('Connect Your Wallet')
    }
  }

  return {
    rewards,
    commonMessages,
    walletAddress,
    handleClaimBetReward,
    handleOpen,
    handleClose,
    computeRewardAmount,
    handleClaimHostReward,
    handleClaim,
    showBetRewardModal,
    showHostRewardModal,
    setShowBetRewardModal,
    setShowHostRewardModal,
    selectedGameIds,
    setSelectedGameIds,
    handleBetHostRewardModalClose,
    selectedGamesReward, 
    setSelectedGamesReward
  }
}
