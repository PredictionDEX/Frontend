import axios from 'axios'
import { useEffect, useState } from 'react'
import { fromBech32Address } from '@zilliqa-js/zilliqa'
import { useSelector } from 'react-redux'
import { Config } from 'src/config/Config'
import { getTransaction } from 'src/utils/getTransaction'
import {
  errorNotification,
  progressNotification,
  successNotification
} from 'src/components/notification/notification'
import { getMonthlyRewards } from 'src/api/rewards/rewards'
import { getJSONValue } from 'src/utils/scillaJsonUtils'
import { TxType } from 'src/config/Transaction'
import { useZilpay } from '../mixins/useZilpay'
import { useZilliqa } from '../mixins/useZilliqa'


const rewardTypes = {
  gpr: '1',
  gqr: '2',
  zch: '3',
}

export const useRewards = () => {
  const { network, walletAddress, isAuthenticated } = useSelector(state => ({
    network: state.auth.network,
    walletAddress: state.auth.walletAddress,
    isAuthenticated: state.auth.isAuthenticated
  }))

  const { call } = useZilpay()
  const { getStateZilliqa } = useZilliqa();
  const rewardNames = {
    ALL_REWARD: 'All Rewards',
    CLAIM_ALL_REWARD: 'Claim All Rewards',
    LP_REWARD: 'Liquidity Reward',
    ZWAP_REWARD: 'ZWAP Reward',
    GOVERNER_REWARD: 'Game Governor Reward',
    PLAYING_REWARD: 'Game Playing Reward',
    ZILCHESS_REWARD: 'ZilChess Reward'
  }
  const [disableClaim, setDisableClaim] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lpLoading, setLpLoading] = useState(false)
  const [unclaimedRewards, setUnclaimedRewards] = useState([])
  const [txnPopup, setTxnPopup] = useState(false)
  const [txnPopupMulti, setTxnPopupMulti] = useState(false)

  const [activeReward, setActiveReward] = useState(rewardNames.CLAIM_ALL_REWARD)
  const [userReward, setUserReward] = useState([])

  const checkAlreadyClaimed = rewards => {
    getStateZilliqa(Config[network].Zwap.base16)
      .then(contractState => {
        const unClaimedRewardsSC = []
        if (rewards && rewards.length) {
          rewards.forEach(singleReward => {
            const contractEpochData =
              contractState?.claimed_leafs[singleReward.epoch_number] || ''
            const proofArray = singleReward.proof.split(' ')
            if (!contractEpochData[`0x${proofArray[0]}`]) {
              unClaimedRewardsSC.push(singleReward)
            }
          })
          setUnclaimedRewards(unClaimedRewardsSC)
        } else {
          setUnclaimedRewards([])
        }
      })
      .catch(error => {
        errorNotification(error)
      })
  }

  const getRewards = async () => {
    setLpLoading(true)

    axios
      .get(
        `${process.env.NEXT_PUBLIC_LMR_URL}distribution/data/${walletAddress.bech32}`
      )
      .then(response => {
        const rewardData = response.data
        checkAlreadyClaimed(rewardData)
        setLpLoading(false)
      })
      .catch(() => {
        setLpLoading(false)
      })
  }

  useEffect(() => {
    if (walletAddress && activeReward === rewardNames.LP_REWARD) {
      getRewards()
    }
  }, [walletAddress, activeReward])
  const handleChangeRewards = rewardName => {
    setActiveReward(rewardName)
  }
  const handleClaim = async reward => {
    setTxnPopup(true)
    const proofArray = reward.proof.split(' ')
    const proof = proofArray.slice(1, proofArray.length - 1)
    const contractAddrByStr20 = fromBech32Address(
      Config[network].Zwap.bech32
    ).toLowerCase()
    try {
      const callTx = await call(Config[network].Zwap.base16, 'Claim', [
        {
          vname: 'claim',
          type: `${contractAddrByStr20}.Claim`,
          value: {
            constructor: `${contractAddrByStr20}.Claim`,
            argtypes: [],
            arguments: [
              reward.epoch_number.toString(),
              {
                constructor: `${contractAddrByStr20}.DistributionLeaf`,
                argtypes: [],
                arguments: [walletAddress.base16, reward.amount.toString(10)]
              },
              proof.map(item => `0x${item}`)
            ]
          }
        }
      ])
      getTransaction(callTx).then(response => {
        if (response === 'success') {
          setTxnPopup(false)
          successNotification('Claimed Successfully')
        } else {
          errorNotification('Claim Failed')
          setTxnPopup(false)
        }
      })
    } catch (e) {
      setTxnPopup(false)
      errorNotification('Claim Failed')
    }
  }

  const getMonthlyData = wallet => {
    setLoading(true)
    getMonthlyRewards(wallet)
      .then(response => {
        setUserReward(response)
        setDisableClaim(false)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!isAuthenticated || walletAddress?.base16 === '') {
      return
    }
    getMonthlyData(walletAddress?.base16?.toLowerCase())

  }, [walletAddress, isAuthenticated])

  const [selectedReward, setSelectedRewards] = useState([])
  const handleSelectReward = ({ rewardType, epoch, amount, proof, key }) => {
    if (selectedReward.some(r => r.id === key)) {
      setSelectedRewards(
        selectedReward.filter(r => r.id !== key)
      )
    } else {
      setSelectedRewards(prev => [
        ...prev,
        {
          id: key,
          type: rewardType,
          epoch,
          amount,
          proof
        }
      ])
    }
  }
  const getRewardTokenForRewardType = rewardType => {
    if(rewardType ==='gpr') return 'REDC'
    return 'ZIL'
  }
  const getRewardTypeFromName = rewardType => rewardTypes[rewardType]
  const formatDataForMultiClaim = reward => {
    const formatted = []
    reward.forEach(r => {
      formatted.push([
        getRewardTypeFromName(r.type),
        [[[r.epoch.toString(), r.amount], r.proof]]
      ])
    })
    return formatted
  }
  const convertReward = (amount, type) => {
    if (type === 'REDC') {
      return (amount / 10 ** 9).toFixed(2)
    }
    return (amount / 10 ** 12).toFixed(2)
  }
  const handleMultiClaim = async () => {
    if (selectedReward.length === 0) {
      errorNotification("Please Choose at least one reward.")
      return;
    }
    try {
      // setTxnPopupMulti(true)
      setDisableClaim(true)
      const formattedData = formatDataForMultiClaim(selectedReward)
      const contractAddr = Config[network].Reward.base16
      call(contractAddr, 'ClaimMultiReward', [
        {
          vname: 'claims',
          type: 'List (Pair (Uint32) (List (Pair (Pair (Uint32) (Uint128)) (List (ByStr32)))))',
          value: getJSONValue(
            formattedData,
            'List(Pair(Uint32)(List(Pair(Pair(Uint32)(Uint128))(List(ByStr32)))))'
          )
        }
      ], 0, 10000).then(callTx => {
        progressNotification(callTx, TxType.CLAIM, 'Claiming Rewards',()=>{
          setTxnPopupMulti(false)
          setSelectedRewards([])
          setTimeout(()=>{
            getMonthlyData()
          }, 20000)
          // successNotification('Claimed Successfully')
        })
        // getTransaction(callTx).then(response => {
        //   if (response === 'success') {
  
        //   } else {
        //     errorNotification('Claim Failed')
        //     setTxnPopupMulti(false)

        //   }
        // })
      }).catch(err => {
        errorNotification(err.message)
        setTxnPopupMulti(false)
        setDisableClaim(false)


      })

    } catch {
      setTxnPopupMulti(false)
      setDisableClaim(false)

    }
  }
  return {
    loading,
    isAuthenticated,
    rewardNames,
    activeReward,
    userReward,
    txnPopup,
    txnPopupMulti,
    selectedReward,
    unclaimedRewards,
    lpLoading,
    handleChangeRewards,
    handleClaim,
    convertReward,
    handleMultiClaim,
    handleSelectReward,
    getRewardTokenForRewardType,
    disableClaim
  }
}
