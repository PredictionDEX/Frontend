/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react'
import { Card, Col, Container, Row, Modal } from 'react-bootstrap'
import styled from 'styled-components'
import PrimaryBadge from 'src/components/badge/PrimaryBadge'
import OutlinedButton from 'src/components/button/OutlinedButton'
import PrimaryButton from 'src/components/button/PrimaryButton'
import PropTypes from 'prop-types'
import { useHostedCard } from 'src/hooks/components/useHostedCard'
import Moment from 'react-moment'
import CustomLink from 'src/components/link/Link'
import ModalVideo from 'react-modal-video'
import PlaceBet from 'src/components/form/PlaceBet'
import { getBlockTimer, getLeagueImage } from 'src/utils/utils'
import Image from 'next/image'
import DisputeGame from '../form/DisputeGame'

const StyledHostedCard = styled(Card)`
  border-radius: 20px;
  padding-bottom: 20px;
  margin: 20px 0px;
  border: transparent;
  border: ${props =>
    props.$isExperimental ? '1px solid gold' : 'transparent'};
  box-shadow: ${props => props.theme.shadow} 0px 4px 12px;
  background: ${props =>
    props.$disableLink ? 'transparent' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 16px;
  .card-header {
    background: transparent;
    padding: 12px 0px;
    margin-bottom: 10px;
    min-height: 45px;
    color: ${props => props.theme.reverse};
  }
  h6 {
    font-weight: 500;
    font-size: 110%;
    color: ${props => props.theme.reverse};
  }
  h6 {
    font-weight: 500;
    font-size: 110%;
    color: ${props => props.theme.reverse};
  }
  h5 {
    font-size: 140%;
    font-weight: 500;
    color: ${props => props.theme.reverse};
  }
  p {
    color: ${props => props.theme.reverse};
    margin: 6px 0px;
  }
  span {
    color: ${props => props.theme.reverse};
    font-size: 110%;
    font-weight: 500;
    cursor: pointer;
  }
  .card {
    color: ${props => props.theme.reverse};
    margin: 10px;
    border-radius: 20px;
    font-size: 100%;
    font-weight: 500;
  }
  .title__text {
    font-size: 14px;
    font-weight: 700;
    min-height: 20px;
    max-height: 48px;
    overflow: hidden;
    line-height: 20px;
    flex: 1;
  }
  button {
    font-size: 13px;
    font-weight: 500;
  }
`
const BetModal = styled(Modal)`
  color: #fff;
  .modal-content {
    padding: 10px 5px;
    background:radial-gradient(circle at 6.6% 12%, rgb(64, 0, 126) 20.8%, rgb(43 0 85) 100.2%);
  }
  .modal-header {
    height: 40px;
    color: #fff !important;
    border: 0px;
  }
  .modal-title {
    font-size: 170%;
    font-weight: 500;
  }
  .form-check-label {
    font-size: 80%;
  }
  .modal-body {
    font-size: 150%;
    padding: 15px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
  }
  .modal-footer {
    display: none;
  }
  select {
    height: 50px;
    font-size: 80%;
    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  input {
    font-size: 80%;
  }
  .form-control {
    height: 50px;
    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .form-label {
    font-size: 80%;
    color: #fff;
    margin: 10px 0px;
    font-weight: 500;
  }
  .form-check-label {
    color: #fff;
    font-size: 75%;
  }
`

const StyledTable = styled.table`
  color: #fff;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0.3rem;
  th {
    padding-bottom: 5px;
  }
  td {
    vertical-align: middle;
    height: 30px;
    font-size: 12px;
  }
`
const ExperimentalBadge = styled.div`
  height: 20px;
  padding: 0px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 10px;
  margin-left: 10px;
  background: #592cd2; ;
`

const HostedCard = ({
  gameId,
  leagueName,
  leagueId,
  homeTeamImage,
  marketName,
  awayTeamImage,
  startingOn,
  gameName,
  gameStatus,
  bets,
  poolAmount,
  totalPoolAmount,
  currentScore,
  finalScore,
  disableLink,
  highlights,
  betOptions,
  small = false,
  refetchFunction = '',
  result,
  gameWithOdds = false,
  oddsArray = []
}) => {
  const {
    show,
    videoModal,
    checkAllowance,
    currentBlock,
    showDisputed,
    handleCloseDisputed,
    setVideoModal,
    handleClose,
    handleDisputeGames,
    handleHostedGames,
    handlePredictGame,
    handleDisputeGame
  } = useHostedCard()

  const gameTimeDisplay = () => {
    switch (gameStatus) {
      case 'Hosted':
        return (
          <p className="d-flex">
            Market Closing
            <Moment fromNow className="px-1">
              {startingOn}
            </Moment>
          </p>
        )
      case 'Live':
        return <p> Current Score: {currentScore}</p>
      case 'Completed':
        return <p>Final Score: {finalScore}</p>
      case 'Abandoned' || 'Aborted':
        return <p> Game {gameStatus} </p>
      default:
        return <p> Game {gameStatus} </p>
    }
  }

  return (
    <>
      <StyledHostedCard
        $disableLink={disableLink}
        $isExperimental={gameWithOdds}
      >
        <Card.Header className="d-flex justify-content-center align-items-center">
          <img
            className="me-3"
            src={getLeagueImage(leagueId, gameName)}
            alt="league-logo"
            height="30px"
            width="30px"
          />
          <h6>{leagueName}</h6>
          {gameWithOdds && <ExperimentalBadge>Experimental</ExperimentalBadge>}
        </Card.Header>
        <Container fluid>
          <Row className="mt-2">
            <Col
              lg={small ? 3 : 2}
              md={3}
              sm={3}
              xs={3}
              className="d-flex align-items-center flex-column justify-content-center"
            >
              <Image
                src={homeTeamImage || '/default-logo.png'}
                height={small ? '40' : '50'}
                width={small ? '40' : '50'}
                alt="home-team-logo"
              />
              <Image
                className="mt-4"
                src={awayTeamImage || '/default-logo.png'}
                height={small ? '40' : '50'}
                width={small ? '40' : '50'}
                alt="away-team-logo"
              />
            </Col>
            <Col
              lg={small ? 9 : 4}
              md={9}
              sm={9}
              xs={9}
              className={`d-flex justify-content-center flex-column ${
                small ? 'mb-4' : ''
              }`}
            >
              {disableLink && <h5 className="m-0 title__text">{marketName}</h5>}
              {!disableLink && leagueName && (
                <CustomLink to={`/${gameName}/${leagueName}/${gameId}`}>
                  <h5 className="m-0 title__text">{marketName}</h5>
                </CustomLink>
              )}
              {!small && (
                <p className="p-0 my-1">
                  Market Status:{' '}
                  {gameStatus === 'Live' ? 'Awating Results' : gameStatus}{' '}
                  {gameStatus === 'Completed' && (
                    <>| Final Score: {finalScore}</>
                  )}
                </p>
              )}

              <div>
                {gameStatus === 'Hosted' && (
                  <>
                    <div>{gameTimeDisplay()}</div>
                    <PrimaryButton
                      height="35px"
                      width="120px"
                      className="mt-1"
                      onClick={() => handleHostedGames(gameId)}
                    >
                      Predict Now
                    </PrimaryButton>
                  </>
                )}
                {gameStatus === 'Live' && (
                  <>
                    <PrimaryButton
                      height="35px"
                      width="120px"
                      className="mt-1"
                      disabled
                    >
                      Predict Now
                    </PrimaryButton>
                  </>
                )}
                {gameStatus === 'Completed' &&
                  result?.status === 'Disputed' && (
                    <p>
                      Market is currently disputed. Please wait for the market
                      to get resolved.
                    </p>
                  )}
                {gameStatus === 'Completed' &&
                  result?.status === 'CanBeDisputed' && (
                    <>
                      <PrimaryButton
                        height="35px"
                        width="120px"
                        className="mt-1"
                        onClick={() => handleDisputeGames()}
                      >
                        Dispute Game
                      </PrimaryButton>

                      <p className="ms-2">
                        Time Left to Dispute:
                        {getBlockTimer(
                          currentBlock,
                          Number(result.disputeBlock)
                        )}
                      </p>
                    </>
                  )}
                {gameStatus === 'Completed' && result?.status === 'Resolved' && (
                  <OutlinedButton
                    width="120px"
                    onClick={() => setVideoModal(true)}
                    disabled={gameStatus === 'Abandoned'}
                  >
                    Highlights
                  </OutlinedButton>
                )}
              </div>
            </Col>
            <Col lg={small ? 12 : 6} className="px-3">
              <StyledTable>
                <thead>
                  <tr>
                    <th style={{ width: '21%' }} />
                    <th style={{ width: '28%' }}>
                      <div className="d-flex justify-content-center">
                        <img
                          src={homeTeamImage || '/default-logo.png'}
                          alt="league-logo"
                          height="20px"
                          width="20px"
                        />
                      </div>
                    </th>
                    <th style={{ width: '28%' }}>
                      <div className="d-flex justify-content-center">
                        <img
                          src={awayTeamImage || '/default-logo.png'}
                          alt="league-logo"
                          height="20px"
                          width="20px"
                        />
                      </div>
                    </th>
                    <th style={{ width: '28%' }}>
                      <div className="d-flex justify-content-center">
                        <img
                          src={homeTeamImage || '/default-logo.png'}
                          alt="league-logo"
                          height="20px"
                          width="20px"
                        />
                        <img
                          src={awayTeamImage || '/default-logo.png'}
                          style={{ marginLeft: -50 }}
                          alt="league-logo"
                          height="20px"
                          width="20px"
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gameWithOdds && (
                    <tr>
                      <td>Odds</td>
                      {oddsArray.map(item => (
                        <td>
                          <PrimaryBadge tooltipContent={betOptions[0]}>
                            {item}
                          </PrimaryBadge>
                        </td>
                      ))}
                    </tr>
                  )}
                  {!gameWithOdds && (
                    <tr>
                      <td>Pool Bets</td>
                      <td>
                        <PrimaryBadge tooltipContent={betOptions[0]}>
                          {poolAmount.homeTeam || 0} BET
                        </PrimaryBadge>
                      </td>
                      <td>
                        <PrimaryBadge tooltipContent={betOptions[1]}>
                          {poolAmount.awayTeam} BET
                        </PrimaryBadge>
                      </td>
                      <td>
                        <PrimaryBadge
                          tooltipContent={
                            betOptions[2] && `Your Bet on  ${betOptions[2]}`
                          }
                          disabled={Boolean(
                            betOptions[2] === undefined ||
                              gameName === 'Basketball'
                          )}
                        >
                          {poolAmount.draw || 0} BET
                        </PrimaryBadge>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td>Your Bets</td>
                    <td>
                      <PrimaryBadge
                        tooltipContent={`Your Bet on ${betOptions[0]}`}
                        className={bets?.userWinPoolAmount > 0 && 'glass-card'}
                      >
                        {bets?.userWinPoolAmount || 0} BET
                      </PrimaryBadge>
                    </td>
                    <td>
                      <PrimaryBadge
                        tooltipContent={`Your Bet on ${betOptions[1]}`}
                        className={bets?.userWinPoolAmount > 0 && 'glass-card'}
                      >
                        {bets?.userLosePoolAmount || 0} BET
                      </PrimaryBadge>
                    </td>

                    <td>
                      <PrimaryBadge
                        tooltipContent={
                          betOptions[2] && `Your Bet on  ${betOptions[2]}`
                        }
                        className={bets?.userWinPoolAmount > 0 && 'glass-card'}
                        disabled={Boolean(
                          betOptions[2] === undefined ||
                            gameName === 'Basketball'
                        )}
                      >
                        {bets?.userDrawPoolAmount || 0} BET
                      </PrimaryBadge>
                    </td>
                  </tr>

                  <tr>
                    <td>Total Pool</td>
                    <td colSpan={3}>
                      <PrimaryBadge
                        tooltipContent="Total Pool Amount"
                        className={
                          bets?.userWinPoolAmount > 0 ||
                          bets?.userDrawPoolAmount > 0 ||
                          bets?.userLosePoolAmount > 0
                        }
                      >
                        <div>{totalPoolAmount || 0} BET</div>
                      </PrimaryBadge>
                    </td>
                  </tr>
                </tbody>
              </StyledTable>
            </Col>
          </Row>
        </Container>
      </StyledHostedCard>
      <BetModal
        centered
        size="md"
        show={show === gameId}
        onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${gameName}Icon.png`}
              className="pe-3"
              alt="host"
              height="40px"
            />
            Place your Bet
          </Modal.Title>
        </Modal.Header>
        {checkAllowance && (
          <Modal.Body className="text-center text-light">
            <i className="fas fa-stroopwafel fa-spin fa-2x" />
            <br />
            <p className="pt-3">
              Please wait, while our gamebots are checking your allowance.
            </p>
          </Modal.Body>
        )}
        {!checkAllowance && (
          <Modal.Body>
            <PlaceBet
              formParams={{
                gameName: gameName === 'Worldcup' ? 'Football' : gameName,
                marketName,
                gameId,
                bets
              }}
              betOptions={betOptions}
              refetchFunction={refetchFunction}
              onSubmitForm={handlePredictGame}
            />
          </Modal.Body>
        )}
      </BetModal>
      <BetModal
        centered
        size="md"
        show={showDisputed}
        onHide={handleCloseDisputed}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Dispute the Game</Modal.Title>
        </Modal.Header>
        {checkAllowance && (
          <Modal.Body className="text-center text-light">
            <i className="fas fa-stroopwafel fa-spin fa-2x" />
            <br />
            <p className="pt-3">
              Please wait, while our gamebots are checking your allowance.
            </p>
          </Modal.Body>
        )}
        {!checkAllowance && (
          <Modal.Body>
            <h5 className="text-light pb-2">{marketName}</h5>
            <h5 className="text-light pb-2"> Published Result: {finalScore}</h5>
            <DisputeGame
              formParams={{
                gameName: gameName === 'Worldcup' ? 'Football' : gameName,
                gameId,
                refetchFunction
              }}
              onSubmitForm={handleDisputeGame}
            />
          </Modal.Body>
        )}
      </BetModal>
      <ModalVideo
        channel="custom"
        autoplay
        isOpen={videoModal}
        url={highlights}
        onClose={() => setVideoModal(false)}
      />
    </>
  )
}
HostedCard.defaultProps = {
  poolAmount: {
    homeTeam: '0',
    draw: '0',
    awayTeam: '0'
  },
  small: false,

  totalPoolAmount: 0,
  currentScore: '0',
  finalScore: '0',
  bets: {},
  disableLink: false,
  highlights: '',
}

HostedCard.propTypes = {
  gameId: PropTypes.string.isRequired,
  leagueName: PropTypes.string.isRequired,
  leagueId: PropTypes.string.isRequired,
  homeTeamImage: PropTypes.string.isRequired,
  marketName: PropTypes.string.isRequired,
  awayTeamImage: PropTypes.string.isRequired,
  startingOn: PropTypes.string.isRequired,
  gameName: PropTypes.string.isRequired,
  gameStatus: PropTypes.string.isRequired,
  poolAmount: PropTypes.object,
  betOptions: PropTypes.array.isRequired,

  // roundName: PropTypes.string,
  // $hostedBy: PropTypes.bool,
  totalPoolAmount: PropTypes.number,
  currentScore: PropTypes.string,
  finalScore: PropTypes.string,
  bets: PropTypes.object,
  // claimed: PropTypes.bool,
  // prizePool: PropTypes.number,
  // totalBets: PropTypes.number,
  // rewardsForXBet: PropTypes.string,
  // hasWon: PropTypes.bool,
  // dbGameId: PropTypes.string,
  highlights: PropTypes.string,
  disableLink: PropTypes.bool,
  small: PropTypes.bool,

  // cachedProgress: PropTypes.bool
}
export default HostedCard
