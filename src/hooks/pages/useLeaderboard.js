import moment from 'moment'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserRewards, leaderBoardData } from 'src/api/leaderboard/leaderboard'
import { setLeaderBoard } from 'src/store/action/leaderboard/leaderboard'
import Config from 'src/config/config'
import { errorNotification, progressNotification } from 'src/components/notification/notification'
import { getJSONValue } from 'src/utils/scillaJsonUtils'
import { TxType } from 'src/config/Transaction'
import { useZilpay } from '../mixins/useZilpay'
import { useZilliqa } from '../mixins/useZilliqa'



export const useLeaderboard = () => {
  const today = moment().month()
  const year = moment().year()
  const { call } = useZilpay()
  const { network } = useSelector(state => ({
    network: state.auth.network,
  }))

  const [showClaimReward, setShowClaimReward] = useState(false)
  const [claimableRewards, setClaimableRewards] = useState({
    total: 0,
    claimable: 0,
    totalEpoch: 0
  })
  const [rewardsProof, setRewardsProof] = useState([])
  // const month = parseInt(String(today + 1).padStart(2, '0'), 10)
  const [filterYear, setFilterYear] = useState(year)
  const [filterMonth, setFilterMonth] = useState(
    parseInt(String(today + 1).padStart(2, '0'), 10)
  )
  const { getSubStateZilliqa } = useZilliqa();

  const [accumulationReward, setAccumulationReward] = useState(0)

  const [startDate, setStartDate] = useState(new Date())
  const { leaderboard, walletAddress } = useSelector(state => ({
    leaderboard: state.leaderboard,
    walletAddress: state.auth.walletAddress
  }))
  const walletAddressBase16 = walletAddress?.base16
  const [timeRemaining, setTimeRemaining] = useState({

  })

  const getAccumulationReward = async () => {
    const { balances } = await getSubStateZilliqa(Config[network].Token.base16, 'balances')
    setAccumulationReward(Number(balances[Config[network].Accumulator.base16.toString().toLowerCase()] || 0) / Config[network].Token.decimal)
  }
  useEffect(() => {
    getAccumulationReward()
  }, [network])



  useEffect(()=>{
    if(walletAddressBase16){
      getUserRewards({
        walletAddressBase16
      })
        .then(response => {
          setClaimableRewards({
            total: response.reduce((acc, item) => acc + item.amount, 0) / Config[network].Token.decimal,
            claimable: response.slice(0,6).reduce((acc, item) => acc + item.amount, 0) / Config[network].Token.decimal,
            totalEpoch: response.length
          })
          setRewardsProof(response)
        })
    }

  }, [walletAddressBase16])

  useEffect(() => {
    const nextMonth = moment().startOf('month').add(1, 'months');
    let newTime = moment(moment.utc().format('YYYY-MM-DD HH:mm:ss'))
    const interval = setInterval(() => {
      newTime = newTime.add(1, "seconds")
      const dur = moment.duration(nextMonth - newTime)
      setTimeRemaining({
        // eslint-disable-next-line no-underscore-dangle
        days: dur._data.days,
        // eslint-disable-next-line no-underscore-dangle
        hours: dur._data.hours,
        // eslint-disable-next-line no-underscore-dangle
        minutes: dur._data.minutes,
        // eslint-disable-next-line no-underscore-dangle
        seconds: dur._data.seconds
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])
  const LeaderboardTypes = {
    HOSTS: 'Top 40 Hosts',
    PLAYERS: 'Top 40 Players',
    GOVERNERS: 'Top 40 Governers',
    AIRDROP: 'Top 7 Airdrop'
  }
  const [activeType, setActiveType] = useState(LeaderboardTypes.PLAYERS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const dispatch = useDispatch()

  const getLeaderboardData = async () => {
    setLoading(true)
    leaderBoardData({
      month: filterMonth,
      year: filterYear,
      walletAddressBase16
    })
      .then(response => {

        const sliderData = []
        Object.keys(response).forEach(key => {
          if (['highestTotalAmounts', 'bestHosts', 'biggestSingleAmount', 'mostActive'].includes(key)) {
            response[key].forEach((item) => {
              sliderData.push({
                ...item,
                type: key,
                ...(item.win ? {
                  points: item.win,
                } : {})
              })
            })
          }
          if (key === "userMarketsBestPredictor") {
            Object.keys(response[key]).forEach(each => {
              response[key][each].forEach((item) => {
                sliderData.push({
                  ...item,
                  type: each,
                  ...(item.win ? {
                    points: item.win,
                  } : {})
                })
              })
            })
          }
        })
        const formattedData = {
          "nextRewardDate": response.nextRewardDate,
          "topPlayers": response.topPlayers,
          sliderData,
        }
        dispatch(setLeaderBoard(formattedData))
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        dispatch(
          setLeaderBoard({
            sliderData: [],
            topPlayers: [],
          })
        )
        setError(true)
      })
  }

  const trimWallet = (wallet, len = 5) =>
    wallet &&
    `${String(wallet).substring(0, len)}
      ...
      ${String(wallet).substring(wallet.length - len, wallet.length)}`

  const handleLeaderboard = active => {
    setActiveType(active)
  }
  useEffect(() => {
    getLeaderboardData()
  }, [walletAddress, filterYear, filterMonth])

  const formatDataForMultiClaim = reward => {
    const formatted = []
    reward.forEach(r => {
      formatted.push([
        "1", // reward type
        [[[r.epoch.toString(), r.amount], r.proof]]
      ])
    })
    return formatted
  }

  const onRewardClaim = () => {
    if (rewardsProof.length === 0) {
      errorNotification("Please Choose at least one reward.")
      return;
    }
    const claimableProofs = rewardsProof.slice(0, 6)
    try {
      // setTxnPopupMulti(true)
      setShowClaimReward(false)
      const formattedData = formatDataForMultiClaim(claimableProofs)
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
      ], 0, 5000 * claimableProofs.length).then(callTx => {
        progressNotification(callTx, TxType.CLAIM, 'Claiming Rewards',()=>{
          setTimeout(()=>{
            getUserRewards({
              walletAddressBase16
            })
              .then(response => {
                setClaimableRewards({
                  total: response.reduce((acc, item) => acc + item.amount, 0) / Config[network].Token.decimal,
                  claimable: response.slice(0,6).reduce((acc, item) => acc + item.amount, 0) / Config[network].Token.decimal,
                  totalEpoch: response.length
                })
                setRewardsProof(response)
              })
          }, 2000)
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

      })

    } catch (err) {
      errorNotification('Claim Failed')

    }


  }

  return {
    leaderboard,
    loading,
    error,
    startDate,
    setStartDate,
    setFilterYear,
    setFilterMonth,
    timeRemaining,
    activeType,
    handleLeaderboard,
    LeaderboardTypes,
    trimWallet,
    accumulationReward,
    showClaimReward,
    setShowClaimReward,
    claimableRewards,
    onRewardClaim,
    network
  }
}
