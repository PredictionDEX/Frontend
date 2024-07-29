/* eslint-disable no-bitwise */
export const getWinner = (results, homeTeam, awayTeam) => {
  if (results === '0') {
    return `Win by ${homeTeam}`
  }
  if (results === '1') {
    return `Win by ${awayTeam}`
  }
  return 'Draw'
}
export const getWinnerUserMarket = (results, optionA, optionB, optionC) => {
  if (results === '0') {
    return optionA
  }
  if (results === '1') {
    return optionB
  }
  if (results === '2') {
    return optionC
  }
  return ''
}
export const calculatePrizePool = game =>
  parseFloat(game?.bets?.totalAmount) -
  parseInt(game.totalPool, 10) / 1000000000
export const rewardForXBet = (
  betAmount,
  winPoolAmount,
  totalBetterRewardAmount
) => (parseFloat(betAmount) / winPoolAmount) * totalBetterRewardAmount

export const handleBetSelected = (betNumber, homeTeam, awayTeam) => {
  switch (betNumber) {
    case '0':
      return `Win by ${homeTeam}`
    case '1':
      return `Win by ${awayTeam}`
    case '2':
      return 'Draw'

    default:
      return 0
  }
}
export const findUserPool = (
  bettedOn,
  winPoolAmount,
  losePoolAmount,
  drawPoolAmount
) => {
  if (bettedOn === '0') {
    return Number(winPoolAmount.toFixed(3))
  }
  if (bettedOn === '1') {
    return Number(losePoolAmount.toFixed(3))
  }
  if (bettedOn === '2') {
    return Number(drawPoolAmount.toFixed(3))
  }
  return 0
}
export const predictWinAmount = (
  bettedOn,
  winPoolAmount,
  losePoolAmount,
  drawPoolAmount
) => {
  if (bettedOn === '0') {
    return Number(drawPoolAmount.toFixed(3)) + Number(losePoolAmount.toFixed(3))
  }
  if (bettedOn === '1') {
    return Number(winPoolAmount.toFixed(3)) + Number(drawPoolAmount.toFixed(3))
  }
  if (bettedOn === '2') {
    return Number(winPoolAmount.toFixed(3)) + Number(losePoolAmount.toFixed(3))
  }
  return 0
}
const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E']

export const moneyConversion = number => {
  // what tier? (determines SI symbol)
  const tier = (Math.log10(Math.abs(number)) / 3) | 0

  // if zero, we don't need a suffix
  if (tier === 0) return number.toFixed(2)

  // get suffix and determine scale
  const suffix = SI_SYMBOL[tier]
  const scale = 10 ** (tier * 3)

  // scale the number
  const scaled = number / scale

  // format number and add suffix
  return scaled.toFixed(1) + suffix
}
export const capitalize = string =>
  string.charAt(0).toUpperCase() + string.slice(1)

export const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1)

export const formatGameNameFromCamelCase = string => string
  .replace(/([A-Z])/g, ' $1')
  .replace(/^./, (str) => str.toUpperCase())
  .trim()

const convertTime = t => {
  const time = Number(t)
  const days = Math.floor(time / (24 * 60 * 60))
  const daysLeft = time % (24 * 60 * 60)

  const hours = Math.floor(daysLeft / 3600)
  const hoursLeft = time % (60 * 60)

  const minutes = Math.floor(hoursLeft / 60)
  const minutesLeft = time % 60

  const seconds = Math.floor(minutesLeft)

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }
  return `${hours}h ${minutes}m ${seconds}s`

}
export const getBlockTimer = (startBlk, endBlk) => {
  if (endBlk === undefined) {
    return convertTime(0)
  }

  const blk = startBlk > Number(endBlk) ? 0 : Number(endBlk) - startBlk
  const timeLeft = blk * 30

  return convertTime(timeLeft)
}

export const getLeagueImage = (league, gameName) => {
  if (gameName === 'Football' || gameName === 'Worldcup') {
    return `https://zilchill.ams3.digitaloceanspaces.com/${league}.png`
  }
  if (gameName === 'NBA') {
    return `https://zilchill.ams3.digitaloceanspaces.com/nba.png`
  }
  if (gameName === 'NHL') {
    return `https://zilchill.ams3.digitaloceanspaces.com/nhl.png`
  }
  if (gameName === 'NFL') {
    return `https://zilchill.ams3.digitaloceanspaces.com/nfl.png`
  }
  if (gameName === 'UserMarkets') {
    return `https://predictiondex.fra1.digitaloceanspaces.com/${league}.png`
  }
  return '/default-logo.png'
}
export const oddsGameIdMap = {
  1543899: ['x1.61', 'x6.80', 'x4.10']
}
