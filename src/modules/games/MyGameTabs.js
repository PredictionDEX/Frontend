/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Col, Container, Row, Modal } from 'react-bootstrap'
import styled from 'styled-components'
import { getWinner, getWinnerUserMarket } from 'src/utils/utils'
import Loader from 'src/components/loader/Loader'
import PrimaryButton from 'src/components/button/PrimaryButton'
import { useMyGameTabs } from 'src/hooks/pages/useMyGameTabs'
import TransparentButton from 'src/components/button/TransparentButton'
import CustomLink from 'src/components/link/Link'
// eslint-disable-next-line import/no-extraneous-dependencies
import lodash from 'lodash'

const TabsWrapper = styled.div`
  margin: 0px 0px 30px 0px;
  background: ${props => props.theme.background};
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  button {
    font-size: 130%;
    background: transparent;
    border: 0px;
    color: #fff;
    height: 40px;
    margin: 10px auto;
    width: 80%;
    border-bottom: 3px solid transparent;
    &:hover,
    &:active,
    &:focus {
      background: transparent;
      border: 0px;
      border-bottom: 3px solid transparent;
    }
  }
  .active {
    background: rgba(105,95,220,1) !important;
    border-radius: 10px;
  }
`

const RewardModal = styled(Modal)`
  .modal-content {
    background: radial-gradient(circle at 6.6% 12%, rgb(64, 0, 126) 20.8%, rgb(43 0 85) 100.2%);
    padding: 15px 10px;
  }
  .modal-header {
    height: 40px;
    border: 0px;
    margin: 0px;
    color: #fff;
  }
  .modal-title {
    font-size: 150%;
    font-weight: 500;
  }
  .form-check-label {
    font-size: 80%;
  }
  .modal-body {
    font-size: 130%;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
  }
  .modal-footer {
    display: none;
  }
  h6 {
    margin: 0px;
    font-size: 60%;
    color: #fff;
    text-transform: uppercase;
    font-weight: 300;
  }
  p {
    color: #fff;
    margin: 0px;
    font-size: 80%;
    padding-top: 3px;
    font-weight: 600;
  }
`
const MyMarketsCard = styled(Container)`
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 15px 20px;
  font-size: 100%;
  background: ${props => props.theme.background};
  color: #fff;
  input {
    height: 15px;
    width: 15px;
  }
  a {
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff !important;
    cursor: pointer !important;
  }
  min-height: 70px;
`
const MyGameTabs = ({
  toggleKey,
  totalGames,
  games,
  gameStatus,
  unclaimedGames,
  unclaimedHosts,
  setToggleKey,
  betLoading,
  handleViewMore,
  getBetsStatus
}) => {
  const {
    rewards,
    commonMessages,
    walletAddress,
    handleOpen,
    handleClose,
    computeRewardAmount,
    handleClaimHostReward,
    handleClaimBetReward,
    showBetRewardModal,
    showHostRewardModal,
    setShowHostRewardModal,
    setShowBetRewardModal,
    selectedGameIds,
    setSelectedGameIds,
    handleBetHostRewardModalClose,
    selectedGamesReward,
    setSelectedGamesReward
  } = useMyGameTabs(gameStatus, games, toggleKey)
  return (
    <>
      <Container fluid className="mt-5">
        <Row>
          <Col xs={12} sm={12} md={12} lg={2}>
            <TabsWrapper>
              <button
                onClick={() => setToggleKey('Worldcup')}
                className={`${toggleKey === 'Worldcup' && 'active'}`}
                type="button"
              >
                World Cup 2022
              </button>
              <button
                onClick={() => setToggleKey('Football')}
                className={`${toggleKey === 'Football' && 'active'}`}
                type="button"
              >
                Football
              </button>
              <button
                onClick={() => setToggleKey('NBA')}
                className={`${toggleKey === 'NBA' && 'active'}`}
                type="button"
              >
                NBA
              </button>
              <button
                onClick={() => setToggleKey('NHL')}
                className={`${toggleKey === 'NHL' && 'active'}`}
                type="button"
              >
                NHL
              </button>
              <button
                onClick={() => setToggleKey('NFL')}
                className={`${toggleKey === 'NFL' && 'active'}`}
                type="button"
              >
                NFL
              </button>
              <button
                onClick={() => setToggleKey('UserMarkets')}
                className={`${toggleKey === 'UserMarkets' && 'active'}`}
                type="button"
              >
                User Markets
              </button>
            </TabsWrapper>
          </Col>
          <Col xs={12} sm={12} md={12} lg={10}>
            <InfiniteScroll
              dataLength={games.length}
              className="w-100 p-0"
              next={handleViewMore}
              hasMore={totalGames !== games.length}
              loader={<Loader />}
            >
              <Container>
                <Row className="align-items-center">
                  <Col md={3} lg={3}>
                    <h5 className="text-light pt-4">
                      Displaying {toggleKey} Markets
                    </h5>
                  </Col>
                  <Col md={4} lg={4} />
                  {toggleKey === 'Worldcup' && (
                    <Col md={5} lg={5}>
                      <p className="text-light">
                        Claim Worldcup 2022 Rewards from{' '}
                        <span
                          onClick={() => setToggleKey('Football')}
                          style={{
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          Football
                        </span>{' '}
                        Section
                      </p>
                    </Col>
                  )}
                  {toggleKey !== 'Worldcup' && (
                    <Col md={5} lg={5}>
                      {betLoading ? (
                        <Col md={6} lg={6}>
                          <p className="text-light">Loading Rewards</p>
                        </Col>
                      ) : (
                        <Row>
                          <Col md={12} className="mb-2 ps-4">
                            <small className="text-light">
                              * You can claim 8 Bet Rewards/Host Rewards at one
                              time.
                            </small>
                          </Col>
                          <Col md={6} lg={6}>
                            <>
                              <PrimaryButton
                                height="35px"
                                className="mt-3 mt-lg-0"
                                disabled={unclaimedGames.unclaimedCount === 0}
                                onClick={() => setShowBetRewardModal(true)}
                                width="100%"
                              >
                                Bet Rewards ({unclaimedGames.unclaimedCount})
                              </PrimaryButton>
                              <RewardModal
                                centered
                                size="md"
                                show={showBetRewardModal || showHostRewardModal}
                                onHide={() => {
                                  handleBetHostRewardModalClose()
                                  setShowBetRewardModal(false)
                                  setShowHostRewardModal(false)
                                  setSelectedGameIds([])
                                  setSelectedGamesReward([])
                                }}
                                backdrop="static"
                              >
                                <Modal.Header closeButton>
                                  <Modal.Title>
                                    Claim {showBetRewardModal ? 'Bet' : 'Host'}{' '}
                                    Rewards
                                  </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  <Row>
                                    <Col className="d-flex flex-column gap-3">
                                      <div
                                        className="d-flex flex-column gap-3"
                                        style={{
                                          maxHeight: '130px',
                                          overflowY: 'auto'
                                        }}
                                      >
                                        {showHostRewardModal &&
                                          unclaimedHosts.data.map(game => (
                                            <label
                                              key={game.gameId}
                                              className="d-flex align-items-center gap-3"
                                              style={{
                                                cursor: 'pointer'
                                              }}
                                            >
                                              <input
                                                name="hostRewards"
                                                type="checkbox"
                                                checked={selectedGameIds.some(
                                                  each => each === game.gameId
                                                )}
                                                disabled={
                                                  (!selectedGameIds.some(
                                                    each => each === game.gameId
                                                  ) &&
                                                    selectedGameIds.length === 8) || (!selectedGamesReward.some(reward => reward.gameId === game.gameId) && selectedGamesReward.some(reward => reward.reward === game.reward))
                                                }
                                                onChange={e => {
                                                  if (
                                                    e.target.checked &&
                                                    selectedGameIds.length < 8
                                                  ) {
                                                    setSelectedGameIds(prev =>
                                                      Array.from(
                                                        new Set([
                                                          ...prev,
                                                          game.gameId
                                                        ])
                                                      )
                                                    )
                                                    setSelectedGamesReward(prev =>
                                                      Array.from(
                                                        new Set([
                                                          ...prev,
                                                          {
                                                            gameId: game.gameId,
                                                            reward: game.reward

                                                          }
                                                        ])
                                                      )
                                                    )
                                                  } else {
                                                    setSelectedGameIds(prev =>
                                                      prev.filter(
                                                        each =>
                                                          each !== game.gameId
                                                      )
                                                    )
                                                    setSelectedGamesReward(prev =>
                                                      prev.filter(
                                                        each =>
                                                          each.gameId !==
                                                          game.gameId
                                                      )
                                                    )
                                                  }
                                                }}
                                                value={game.gameId}
                                              />
                                              <div
                                                className={`text-light w-full cursor-pointer ${!selectedGameIds.some(
                                                  each => each === game.gameId
                                                ) &&
                                                  selectedGameIds.length ===
                                                  8 &&
                                                  'text-muted'
                                                  }`}
                                              >
                                                {game.name} (
                                                {game.reward}{' '}
                                                BET)
                                              </div>
                                            </label>
                                          ))}
                                        {showBetRewardModal &&
                                          unclaimedGames.data?.map(
                                            (game, index) => (
                                              <label
                                                key={index}
                                                className="d-flex align-items-center gap-3 cursor-pointer"
                                                style={{
                                                  cursor: 'pointer'
                                                }}
                                              >
                                                <input
                                                  type="checkbox"
                                                  value={game.gameId}
                                                  checked={selectedGameIds.some(
                                                    each =>
                                                      each.gameId ===
                                                      game.gameId
                                                  )}
                                                  disabled={
                                                    (!selectedGameIds.some(
                                                      each =>
                                                        each.gameId ===
                                                        game.gameId
                                                    ) &&
                                                      selectedGameIds.length ===
                                                      8) || (!selectedGamesReward.some(reward => reward.gameId === game.gameId) && selectedGamesReward.some(reward => reward.reward === game.reward))
                                                  }
                                                  onChange={e => {
                                                    if (
                                                      e.target.checked &&
                                                      selectedGameIds.length <
                                                      8
                                                    ) {
                                                      setSelectedGameIds(
                                                        prev =>
                                                          Array.from(
                                                            new Set([
                                                              ...prev,
                                                              {
                                                                gameId:
                                                                  game.gameId,
                                                                betId:
                                                                  game.betId
                                                              }
                                                            ])
                                                          )
                                                      )
                                                      setSelectedGamesReward(
                                                        prev =>

                                                          Array.from(
                                                            new Set([
                                                              ...prev,
                                                              {
                                                                gameId:
                                                                  game.gameId,
                                                                reward: game.reward
                                                              }
                                                            ])
                                                          )
                                                      )
                                                    } else {
                                                      setSelectedGameIds(
                                                        prev =>
                                                          prev.filter(
                                                            each =>
                                                              each.gameId !==
                                                              game.gameId
                                                          )
                                                      )
                                                      setSelectedGamesReward(
                                                        prev =>
                                                          prev.filter(
                                                            each =>
                                                              each.gameId !==
                                                              game.gameId
                                                          )
                                                      )
                                                    }
                                                  }}
                                                />
                                                <div
                                                  className={`text-light w-full cursor-pointer ${!selectedGameIds.some(
                                                    each =>
                                                      each.gameId ===
                                                      game.gameId
                                                  ) &&
                                                    selectedGameIds.length ===
                                                    8 &&
                                                    'text-muted'
                                                    }`}
                                                >
                                                  {game?.name} (
                                                  {game.reward}{' '}
                                                  BET)
                                                </div>
                                              </label>
                                            )
                                          )}
                                      </div>
                                      <div className="mb-4 text-light w-full">
                                        <div className="d-flex gap-2 mb-4 mt-1">
                                          <div
                                            className={`d-flex align-items-center px-2 border rounded-pill ${selectedGameIds.length === 8 ||
                                              (showBetRewardModal
                                                ? unclaimedGames
                                                : unclaimedHosts
                                              ).unclaimedIds?.length ===
                                              selectedGameIds.length
                                              ? 'text-muted border-disabled'
                                              : 'border-light'
                                              }`}
                                            style={{
                                              cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                              if (showBetRewardModal) {
                                                // select unique unclaimed games with unique reward amount
                                                const uniqueUnclaimedGames = lodash.uniqBy(
                                                  unclaimedGames.data,
                                                  'reward'
                                                ).filter(
                                                  (each, index) => index < 8
                                                )
                                                setSelectedGameIds(
                                                  uniqueUnclaimedGames.map(each => ({
                                                    gameId: each.gameId,
                                                    betId: each.betId
                                                  }))
                                                )
                                                setSelectedGamesReward(uniqueUnclaimedGames.map(each => ({
                                                  gameId: each.gameId,
                                                  reward: each.reward,
                                                  betId: each.betId
                                                })))



                                              } else {
                                                const uniqueUnclaimedGames = lodash.uniqBy(
                                                  unclaimedHosts.data,
                                                  'reward'
                                                ).filter(
                                                  (each, index) => index < 8
                                                )
                                                setSelectedGameIds(
                                                  uniqueUnclaimedGames.map(each =>
                                                    each.gameId
                                                  )
                                                )
                                                setSelectedGamesReward(uniqueUnclaimedGames.map(each => ({
                                                  gameId: each.gameId,
                                                  reward: each.reward,
                                                })))
                                              }
                                            }
                                            }
                                          >
                                            <small>Select Max</small>
                                          </div>
                                          <div
                                            className={`d-flex align-items-center px-2 border rounded-pill ${selectedGameIds.length === 0
                                              ? 'text-muted border-disabled'
                                              : 'border-light'
                                              }`}
                                            style={{
                                              cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                              setSelectedGameIds([])
                                              setSelectedGamesReward([])
                                            }
                                            }
                                          >
                                            <small>Clear</small>
                                          </div>
                                        </div>

                                        <small className="text-light">
                                          * You can claim 8 Bet Rewards/Host
                                          Rewards at one time.
                                          <br />
                                          * Only unique reward amount can be
                                          claimed.
                                        </small>
                                      </div>
                                      <div className="d-flex justify-content-center w-full">
                                        <PrimaryButton
                                          height="35px"
                                          className="mt-3 mt-lg-0"
                                          disabled={
                                            selectedGameIds.length > 8 ||
                                            selectedGameIds.length === 0

                                          }
                                          onClick={() => {

                                            if (showHostRewardModal) {
                                              handleClaimHostReward(
                                                toggleKey,
                                                selectedGameIds,
                                                getBetsStatus
                                              )
                                            } else if (showBetRewardModal) {
                                              handleClaimBetReward(
                                                toggleKey,
                                                selectedGameIds,
                                                getBetsStatus
                                              )
                                            }
                                          }}
                                          width="240px"
                                        >
                                          Claim
                                        </PrimaryButton>
                                      </div>
                                    </Col>
                                  </Row>
                                </Modal.Body>
                              </RewardModal>
                            </>
                          </Col>
                          <Col md={6} lg={6}>
                            <PrimaryButton
                              height="35px"
                              className="mt-3 mt-lg-0"
                              disabled={unclaimedHosts.unclaimedCount === 0}
                              onClick={() =>
                                unclaimedHosts.unclaimedIds.length > 0 &&
                                setShowHostRewardModal(true)
                              }
                              width="100%"
                            >
                              Host Rewards ({unclaimedHosts.unclaimedCount})
                            </PrimaryButton>
                          </Col>
                        </Row>
                      )}
                    </Col>
                  )}
                </Row>
              </Container>
              <Container>
                {commonMessages}
                {!gameStatus.loading &&
                  games.length > 0 &&
                  games?.map((hostedGame) => (
                    <MyMarketsCard>
                      <Row>
                        <Col
                          lg={2}
                          md={4}
                          sm={4}
                          xs={4}
                          className="d-flex align-items-center justify-content-center"
                        >
                          <div
                            style={{
                              background: `url('${hostedGame.details.homeTeamLogo}')`,
                              backgroundSize: '100% 100%',
                              borderRadius: '50%',
                              height: '40px',
                              width: '40px'
                            }}
                          />
                          <div
                            style={{
                              background: `url('${hostedGame.details.awayTeamLogo}')`,
                              backgroundSize: '100% 100%',
                              borderRadius: '50%',
                              height: '40px',
                              width: '40px'
                            }}
                          />
                        </Col>
                        <Col lg={4} md={7} sm={8} xs={8}>
                          <h5 className="market_title">
                            <CustomLink
                              to={`/${toggleKey}/${hostedGame.details.strLeague}/${hostedGame.details.idEvent}`}
                            >
                              {toggleKey === 'UserMarkets'
                                ? `${hostedGame.details.strEvent}`
                                : `${hostedGame.details.strHomeTeam} vs ${hostedGame.details.strAwayTeam}`}
                            </CustomLink>
                          </h5>
                          <h6>Status: {hostedGame.gameStatus}</h6>
                        </Col>
                        <Col
                          lg={2}
                          md={4}
                          sm={4}
                          xs={12}
                          className="pt-3 pt-lg-0 text-center"
                        >
                          <h6>Your Bets</h6>
                          <h5>
                            {hostedGame?.bets?.userBet?.totalBetAmount} BET
                          </h5>
                        </Col>
                        <Col
                          lg={2}
                          md={4}
                          sm={4}
                          xs={12}
                          className="pt-3 pt-lg-0 text-center"
                        >
                          <h6>Total Bets</h6>
                          <h5>{hostedGame?.bets?.totalBetAmount} BET</h5>
                        </Col>
                        <Col
                          lg={2}
                          md={5}
                          sm={12}
                          xs={12}
                          className="pt-3 mt-3 mt-lg-0 pt-lg-0 text-center"
                        >
                          {hostedGame.gameStatus !== 'Completed' && (
                            <TransparentButton
                              width="100%"
                              font="12px !important"
                              height="40px"
                              disabled
                            >
                              <i className="fa fa-gift me-2" /> View Rewards
                            </TransparentButton>
                          )}
                          {hostedGame.gameStatus === 'Completed' && (
                            <>
                              {hostedGame?.result?.status === 'Disputed' && (
                                <TransparentButton
                                  width="100%"
                                  font="12px !important"
                                  height="40px"
                                  disabled
                                >
                                  <i className="fa fa-warning me-2" /> Disputed
                                  Game
                                </TransparentButton>
                              )}
                              {hostedGame?.result?.status ===
                                'CanBeDisputed' && (
                                  <CustomLink
                                    to={`/${toggleKey}/${hostedGame.details.strLeague}/${hostedGame.details.idEvent}`}
                                  >
                                    <PrimaryButton width="100%">
                                      Dispute Game
                                    </PrimaryButton>
                                  </CustomLink>
                                )}
                              {hostedGame?.result?.status === 'Resolved' && (
                                <>
                                  <TransparentButton
                                    width="100%"
                                    font="12px !important"
                                    height="40px"
                                    onClick={() =>
                                      handleOpen(hostedGame.details.idEvent)
                                    }
                                  >
                                    <i className="fa fa-gift me-2" /> View
                                    Rewards
                                  </TransparentButton>
                                  <RewardModal
                                    centered
                                    size="md"
                                    show={
                                      rewards === hostedGame.details.idEvent
                                    }
                                    onHide={handleClose}
                                    backdrop="static"
                                  >
                                    <Modal.Header closeButton>
                                      <Modal.Title>Reward Details</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                      <Row>
                                        <Col
                                          md={6}
                                          sm={6}
                                          xs={6}
                                          className="mt-1"
                                        >
                                          <Row className="align-items-center">
                                            <img
                                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/prize_pool.png`}
                                              className="d-inline col-3 p-0"
                                              height="60px"
                                              alt="tropy"
                                            />
                                            <div className="d-inline col-9">
                                              <h6>Prize Pool</h6>
                                              <p>
                                                {hostedGame.bets.distributePool}{' '}
                                                BET
                                              </p>
                                            </div>
                                          </Row>
                                        </Col>
                                        <Col
                                          md={6}
                                          sm={6}
                                          xs={6}
                                          className="mt-1"
                                        >
                                          <Row className="align-items-center">
                                            <img
                                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/game_result.png`}
                                              className="d-inline col-3 p-0"
                                              height="60px"
                                              alt="tropy"
                                            />
                                            <div className="d-inline col-9">
                                              <h6>Game Result</h6>
                                              <p>
                                                {hostedGame?.details.strOptionA ? getWinnerUserMarket(
                                                  hostedGame?.result?.winner,
                                                  hostedGame?.details.strOptionA,
                                                  hostedGame?.details.strOptionB,
                                                  hostedGame?.details.strOptionC,
                                                ) : getWinner(
                                                  hostedGame?.result?.winner,
                                                  hostedGame?.details
                                                    ?.strHomeTeam,
                                                  hostedGame?.details
                                                    ?.strAwayTeam
                                                )}
                                              </p>
                                            </div>
                                          </Row>
                                        </Col>
                                        <Col
                                          md={6}
                                          sm={6}
                                          xs={6}
                                          className="mt-3"
                                        >
                                          <Row className="align-items-center">
                                            <img
                                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/total_betters.png`}
                                              className="d-inline col-3 p-0"
                                              height="60px"
                                              alt="tropy"
                                            />
                                            <div className="d-inline col-9">
                                              <h6>Total Betters</h6>
                                              <p>
                                                {hostedGame.bets.numberOfBets}{' '}
                                                Betters
                                              </p>
                                            </div>
                                          </Row>
                                        </Col>
                                        <Col
                                          md={6}
                                          sm={6}
                                          xs={6}
                                          className="mt-3"
                                        >
                                          <Row className="align-items-center">
                                            <img
                                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/prize_pool.png`}
                                              className="col-3 p-0"
                                              height="60px"
                                              alt="tropy"
                                            />
                                            <div className="d-inline col-9">
                                              <h6>Bet Reward Amount</h6>
                                              <div>
                                                <p>
                                                  {computeRewardAmount(
                                                    hostedGame,
                                                    '0'
                                                  )}{' '}
                                                  BET |{' '}
                                                  {computeRewardAmount(
                                                    hostedGame,
                                                    '1'
                                                  )}{' '}
                                                  BET |{' '}
                                                  {computeRewardAmount(
                                                    hostedGame,
                                                    '2'
                                                  )}{' '}
                                                  BET
                                                </p>
                                              </div>
                                            </div>
                                          </Row>
                                        </Col>
                                        <Col
                                          md={6}
                                          sm={6}
                                          xs={6}
                                          className="mt-3"
                                        >
                                          <Row className="align-items-center">
                                            <img
                                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/your_bet.png`}
                                              className="col-3 p-0"
                                              height="60px"
                                              alt="tropy"
                                            />
                                            <div className="d-inline col-9">
                                              <h6>Your Bet</h6>
                                              <div>
                                                <p>
                                                  {
                                                    hostedGame.bets.userBet
                                                      .userWinPoolAmount
                                                  }{' '}
                                                  BET |{' '}
                                                  {
                                                    hostedGame.bets.userBet
                                                      .userLosePoolAmount
                                                  }{' '}
                                                  BET |{' '}
                                                  {
                                                    hostedGame.bets.userBet
                                                      .userDrawPoolAmount
                                                  }{' '}
                                                  BET
                                                </p>
                                              </div>
                                            </div>
                                          </Row>
                                        </Col>
                                        <Col
                                          md={6}
                                          sm={6}
                                          xs={6}
                                          className="mt-3"
                                        >
                                          <Row className="align-items-center">
                                            <img
                                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/prize_pool.png`}
                                              className="col-3 p-0"
                                              height="60px"
                                              alt="tropy"
                                            />

                                            <div className="d-inline col-9">
                                              <h6>Host Reward Amount</h6>
                                              <p>
                                                {hostedGame.hostedBy ===
                                                  walletAddress.base16
                                                  ? `${Number(
                                                    hostedGame.bets
                                                      .distributePool
                                                  ) * 0.05
                                                  } BET`
                                                  : 'N/A'}
                                              </p>
                                            </div>
                                          </Row>
                                        </Col>
                                      </Row>

                                      {/* <Row className="justify-content-center mx-1 mt-4"> */}
                                      {/* <PrimaryButton
                                          height="35px"
                                          onClick={() =>
                                            handleClaim(toggleKey, hostedGame)
                                          }
                                          width="140px"
                                        >
                                          <i className="fa fa-gift pe-2" />
                                          Claim Rewards
                                        </PrimaryButton> */}
                                      {/* <PrimaryButton
                                      height="35px"
                                      className="ms-4"
                                      onClick={() =>
                                        handleClaimHostReward(
                                          toggleKey,
                                          hostedGame
                                        )
                                      }
                                      width="200px"
                                    >
                                      <i className="fa fa-gift pe-2" /> Claim
                                      Host Reward
                                    </PrimaryButton> */}
                                      {/* </Row> */}
                                    </Modal.Body>
                                  </RewardModal>
                                </>
                              )}
                            </>
                          )}
                        </Col>
                      </Row>
                    </MyMarketsCard>
                  ))}
              </Container>
            </InfiniteScroll>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default MyGameTabs
