/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
import React from 'react'
import { Card, Col, Row, Table, Alert } from 'react-bootstrap'
import HostedCard from 'src/components/card/HostedCard'
import { useSingleGame } from 'src/hooks/pages/useSingleGame'
import styled from 'styled-components'
import Header from 'src/components/header/Header'

import Meta from 'src/components/meta/Meta'
import Title from 'src/components/title/Title'
import Moment from 'react-moment'
import PlaceBet from 'src/components/form/PlaceBet'
import { getSingleGames } from 'src/api/games/games'
import { oddsGameIdMap } from 'src/utils/utils'

const SingleGameWrapper = styled(Col)`
  border: 0px;
  background: transaparent;
  border-radius: 10px;
  padding: 0px;
  font-size: 100%;
  padding-bottom: 30px;
  margin: 0px;
  .card {
    margin: 0px;
  }
  .prediction-card {
    background: rgba(255, 255, 255, 0.5);
    font-size: 120%;
    padding: 10px;
    border: 1px solid ${props => props.theme.border};
    .card-header {
      font-size: 110%;
      border: 0px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: transparent;
    }
  }

  select {
    height: 50px;
    border-radius: 5px;
    font-size: 120%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  input {
    height: 50px;
    width: 100%;
    font-size: 120%;
    padding-left: 10px;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
`
const StyledTable = styled.div`
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  background: ${props => props.theme.background};
  padding: 10px;
  color: #fff;
  border-radius: 20px;
  table {
    padding-left: 20px;
    font-size: 110%;
    tr {
      color: #fff;
    }
    tbody a {
      text-decoration: underline !important;
      color: #fff !important;
      cursor: pointer !important;
    }
  }
`
const SingleGameWrapperInner = styled.div`
  width: 100%;
  background: ${props => props.theme.background};
  color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  border-radius: 20px;
  margin-top: 10px;
  padding-bottom: 30px;
`
const StyledCard = styled(Card)`
  background: ${props => props.theme.background} !important;
  height: 120px;
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

// eslint-disable-next-line react/prop-types
const SingleGame = ({ gameData }) => {
  const {
    singleGame,
    loading,
    gameType,
    probableWin,
    gameName,
    error,
    setAmount,
    setPool,
    transactions,
    disabled,
    removeDisable,
    calculateProbableWin,
    getSingleGameFromAPI
  } = useSingleGame()

  const transitions = {
    createGame: 'createGame',
    bet: 'bet',
    gameStarted: 'gameStarted',
    gameAborted: 'gameAborted',
    flashGameResults: 'flashGameResults',
    verifyGameResults: 'verifyGameResults',
    redeem: 'redeem',
    withdrawFromAborted: 'withdrawFromAborted',
    updateOracle: 'updateOracle',
    updateDeveloperWallet: 'updateDeveloperWallet',
    updateHoldersRewardWallet: 'updateHoldersRewardWallet',
    minimumBet: 'minimumBet',
    redCChargeUpdate: 'redCChargeUpdate'
  }
  const handleTransitionName = name => {
    if (name === transitions.createGame) {
      return 'Create Game'
    }
    if (name === transitions.bet) {
      return 'Predict'
    }
    if (name === transitions.gameStarted) {
      return 'Start Game'
    }
    if (name === transitions.gameAborted) {
      return 'Abort Game'
    }
    if (name === transitions.flashGameResults) {
      return 'Flash Result'
    }
    if (name === transitions.verifyGameResults) {
      return 'Verify Result'
    }
    if (name === transitions.redeem) {
      return 'Claim Reward'
    }
    if (name === transitions.withdrawFromAborted) {
      return 'Refund Aborted'
    }

    return 'Admin Transaction'
  }
  const eventName = {
    transferFromSuccess: 'TransferFromSuccess',
    transferSuccess: 'TransferSuccess'
  }
  return (
    <>
      <Meta
        title={
          gameType === 'usermarkets'
            ? gameData.details.strEvent
            : `${gameData.details.strHomeTeam} vs ${gameData.details.strAwayTeam}`
        }
        description={`PredictionDEX - Predict the Result of ${gameType} Game Between ${gameData.details.strHomeTeam} vs ${gameData.details.strAwayTeam}
 Using BET Token`}
        image={gameData.details.strThumb}
      />

      <Row className="pt-4" style={{ marginTop: 100 }}>
        {loading && <>Loading</>}
        {!loading && error && 'Error Loading Games'}
        {!loading && singleGame && !error && (
          <>
            <SingleGameWrapper md={8} className="px-3">
              <Row className="w-100">
                <Col>
                  <Header />
                </Col>
              </Row>

              <SingleGameWrapperInner>
                <HostedCard
                  key={singleGame._id}
                  gameId={singleGame.details.idEvent}
                  gameStatus={singleGame.gameStatus}
                  leagueName={singleGame.details.strLeague}
                  leagueId={
                    gameName === 'UserMarkets'
                      ? singleGame.details?.strLeague
                      : singleGame.details?.idLeague
                  }
                  marketName={
                    gameName === 'UserMarkets'
                      ? singleGame.details.strEvent
                      : `${singleGame.details.strHomeTeam} vs ${singleGame.details.strAwayTeam}`
                  }
                  homeTeamImage={singleGame.details.homeTeamLogo}
                  awayTeamImage={singleGame.details.awayTeamLogo}
                  startingOn={singleGame.details.strTimestamp}
                  gameName={gameName}
                  roundName={singleGame.details.intRound}
                  currentTime={singleGame?.time?.minute}
                  betOptions={
                    gameName === 'UserMarkets'
                      ? [
                        singleGame.details.strOptionA,
                        singleGame.details.strOptionB,
                        singleGame.details.strOptionC
                      ]
                      : [
                        `Win by ${singleGame.details.strHomeTeam}`,
                        `Win by ${singleGame.details.strAwayTeam}`,
                        `Draw`
                      ]
                  }
                  poolAmount={{
                    homeTeam: singleGame?.bets?.winPoolBetAmount,
                    draw: singleGame?.bets?.drawPoolBetAmount,
                    awayTeam: singleGame?.bets?.losePoolBetAmount
                  }}
                  bets={singleGame?.bets?.userBet}
                  totalPoolAmount={singleGame?.bets?.totalBetAmount}
                  finalScore={
                    singleGame?.result && singleGame?.result?.finalScore
                  }
                  totalBets={singleGame?.bets?.numberOfBets}
                  highlights={
                    singleGame.highlights &&
                    singleGame.highlights.data[0]?.location
                  }
                  small={false}
                  refetchFunction={getSingleGameFromAPI}
                  result={singleGame?.result}
                  gameWithOdds={singleGame.details.idEvent in oddsGameIdMap}

                  oddsArray={oddsGameIdMap[singleGame.details.idEvent]}
                />

                <div className="p-3">
                  <Row className="mx-1  p-3 align-items-center">
                    <Col md={12}>
                      <h4>Win Amount Calculator</h4>
                      <h6>
                        Calculate the probable win amount Based on Current Pools
                      </h6>
                      {disabled && (
                        <Alert variant="info" className="m-0">
                          You have already betted the following amount.{' '}
                          <span onClick={() => removeDisable()}>
                            Click here{' '}
                          </span>
                          to unlock
                        </Alert>
                      )}
                    </Col>
                  </Row>
                  <Row className="mx-1 px-3">
                    <Col md={7}>
                      <PlaceBet
                        formParams={{
                          poolAmount: {
                            homeTeam: singleGame?.bets?.winPoolBetAmount,
                            draw: singleGame?.bets?.drawPoolBetAmount,
                            awayTeam: singleGame?.bets?.losePoolBetAmount
                          }
                        }}
                        betOptions={
                          gameName === 'UserMarkets'
                            ? [
                              singleGame.details.strOptionA,
                              singleGame.details.strOptionB,
                              singleGame.details.strOptionC
                            ]
                            : [
                              `Win by ${singleGame.details.strHomeTeam}`,
                              `Win by ${singleGame.details.strAwayTeam}`,
                              `Draw`
                            ]
                        }
                        onSubmitForm={(data, formParams) => {
                          setPool(formParams.team)
                          setAmount(formParams.amount)
                          calculateProbableWin(
                            data.poolAmount.homeTeam,
                            data.poolAmount.awayTeam,
                            data.poolAmount.draw,
                            formParams.team,
                            formParams.amount
                          )
                        }}
                        refetchFunction={() => { }}
                        buttonMessage="Calculate"
                        showDisclaimer={false}
                      />
                    </Col>

                    <Col md={5}>
                      <StyledCard className="">
                        <p>
                          <i className="fas fa-trophy pe-2" />
                          <b className="text-light">Probable Win Amount</b>
                        </p>
                        <h5 className="text-light">
                          {Number.isNaN(probableWin) ||
                            probableWin === undefined ||
                            probableWin === null
                            ? 0
                            : Math.floor(probableWin)}{' '}
                          BET
                        </h5>
                      </StyledCard>
                    </Col>
                  </Row>
                  <Row className="mx-1 mt-4">
                    <Col md={4} className="p-0">
                      <Card className="prediction-card bg-transparent">
                        <Card.Header>
                          <i className="fas fa-ring pe-2" />
                          {gameName === 'UserMarkets'
                            ? singleGame.details.strOptionA
                            : `Win by 
                          ${singleGame.details.strHomeTeam}`}
                        </Card.Header>
                        <Card.Body>
                          <Card.Title>
                            {singleGame?.bets.winPoolBetAmount} BET
                          </Card.Title>
                          <Card.Text>
                            {singleGame?.bets.winPoolBetCount} Prediction Made
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className="p-0">
                      <Card className="prediction-card  bg-transparent">
                        <Card.Header>
                          <i className="fas fa-ring pe-2" />
                          {gameName === 'UserMarkets'
                            ? singleGame.details.strOptionB
                            : `Win by 
                          ${singleGame.details.strAwayTeam}`}
                        </Card.Header>
                        <Card.Body>
                          <Card.Title>
                            {singleGame?.bets.losePoolBetAmount} BET
                          </Card.Title>
                          <Card.Text>
                            {singleGame?.bets.losePoolBetCount} Prediction Made
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col
                      md={4}
                      className="p-0 "
                      style={{
                        opacity:
                          singleGame.gameType === 'Basketball' ? '0.3' : '1'
                      }}
                    >
                      <Card
                        className="prediction-card  bg-transparent"
                        style={{
                          opacity: singleGame?.optionCount === 2 ? '0.2' : '1'
                        }}
                      >
                        <Card.Header>
                          <i className="fas fa-ring pe-2" />
                          {gameName === 'UserMarkets'
                            ? singleGame.details.strOptionC
                            : 'Draw'}
                        </Card.Header>
                        <Card.Body>
                          <Card.Title>
                            {singleGame?.bets?.drawPoolBetAmount || 0} BET
                          </Card.Title>
                          <Card.Text>
                            {singleGame?.bets?.drawPoolBetCount || 0} Prediction
                            Made
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  {/* <Row className="mx-1">
                    <Col md={6} className="p-0">
                      <Card className="prediction-card  bg-transparent">
                        <Card.Header>
                          <i className="fas fa-user-friends pe-2" />
                          Number of Interested People
                        </Card.Header>
                        <Card.Body>
                          <Card.Title>{singleGame?.interested} </Card.Title>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} className="p-0">
                      <Card className="prediction-card  bg-transparent">
                        <Card.Header>
                          <i className="fas fa-rocket pe-3" />
                          Highest Prediction
                        </Card.Header>
                        <Card.Body>
                          <Card.Title>
                            {' '}
                            {singleGame.highestBet
                              ? `${singleGame.highestBet || '0'} ZIL`
                              : '0 ZIL'}
                          </Card.Title>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row> */}
                </div>
              </SingleGameWrapperInner>
            </SingleGameWrapper>

            <Col md={4}>
              <Title text="Recent Transactions" />
              <StyledTable>
                <Table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Hash</th>
                      <th>Amount</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr>
                        <td
                          style={{
                            width: '20%',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            maxWidth: 1
                          }}
                        >
                          {handleTransitionName(JSON.parse(tx.data)._tag)}
                        </td>
                        <td style={{ width: '20%' }}>
                          <a
                            target="_blank"
                            href={`https://viewblock.io/zilliqa/tx/${tx.hash}?network=${process.env.NEXT_PUBLIC_NETWORK}`}
                            rel="noreferrer"
                          >
                            {tx.hash.slice(0, 4)}...
                            {tx.hash.slice(tx.hash.length - 4, tx.hash.length)}
                          </a>
                        </td>
                        <td className="text-center" style={{ width: '10%' }}>
                          {tx.events.some(
                            txn =>
                              txn.name === eventName.transferFromSuccess ||
                              txn.name === eventName.transferFromSuccess
                          )
                            ? `${tx.events.find(
                              txn =>
                                txn.name ===
                                eventName.transferFromSuccess ||
                                txn.name === eventName.transferFromSuccess
                            )?.params?.amount /
                            10 ** 9 || 0
                            } BET`
                            : `${Math.floor(
                              tx.events.find(
                                txn =>
                                  !(
                                    txn.name ===
                                    eventName.transferFromSuccess ||
                                    txn.name === eventName.transferFromSuccess
                                  )
                              )?.params?.amount /
                              10 ** 12 || 0
                            )} BET`}
                        </td>
                        <td
                          style={{
                            width: '20%',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            maxWidth: 1
                          }}
                        >
                          <Moment fromNow>{tx.timestamp}</Moment>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </StyledTable>
            </Col>
          </>
        )}
      </Row>
    </>
  )
}

export default SingleGame

export const getServerSideProps = async context => {
  const data = await getSingleGames({
    gameName: context.query.game_name,
    gameId: context.query.game_id
  })
  if (data && data.games.length) {
    return {
      props: {
        gameData: data.games[0]
      }
    }
  }
  return {
    props: {
      gameData: ''
    }
  }
}
