import React from 'react'
import { Card, Col, Container, Row, Modal } from 'react-bootstrap'
import styled from 'styled-components'
import PrimaryButton from 'src/components/button/PrimaryButton'
import PropTypes from 'prop-types'
import { useOpenCard } from 'src/hooks/components/useOpenCard'
import Moment from 'react-moment'
import HostGame from 'src/components/form/HostGame'
import { getLeagueImage } from 'src/utils/utils'

const StyledOpenCard = styled(Card)`
  border-radius: 20px;
  padding-bottom: 20px;
  margin: 20px 0px;
  background: ${props => props.theme.background};
  .card-header {
    background: transparent;
    height: 45px;
    margin-bottom: 5px;
    color: ${props => props.theme.reverse};
  }
  h6 {
    font-weight: 400;
    font-size: 110%;
    color: ${props => props.theme.reverse};
  }
  h5 {
    font-size: 140%;
    font-weight: 400;
    color: ${props => props.theme.reverse};
  }
  p {
    font-size: 100%;
    font-weight: 400;
    color: ${props => props.theme.reverse};
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
const StyledModal = styled(Modal)`
  color: #fff;
  .modal-content {
    background: radial-gradient(circle at 6.6% 12%, rgb(64, 0, 126) 20.8%, rgb(43 0 85) 100.2%);
    padding: 20px 10px;
  }
  .modal-header {
    height: 40px;
    border: 0px;
    margin: 0px;
  }
  .modal-title {
    font-size: 150%;
    font-weight: 500;
  }
  .modal-body {
    font-size: 130%;
    text-align: justify;
    padding: 15px;
    font-weight: 400;
    color: #fff;
    h5 {
      font-weight: 400;
      font-size: 100%;
      margin: 0px;
    }
    h6 {
      font-weight: 300;
      font-size: 70%;
      margin: 5px 0px;
      text-transform: uppercase;
    }
  }
  .modal-footer {
    display: none;
  }
  .check-allowance {
    color: #fff;
    i {
      color: #48307f;
    }
  }
`
const OpenCard = ({
  gameId,
  leagueName,
  leagueId,
  marketName,
  homeTeamImage,
  awayTeamImage,
  startingOn,
  gameName,
  status,
  betOptions,
  disabled,
  refetchFunction = () => { }
}) => {
  const { checkAllowance, show, handleOpenGames, handleClose, handleHostGame } =
    useOpenCard()

  return (
    <>
      <StyledOpenCard>
        <Card.Header className="d-flex justify-content-center align-items-center">
          <img
            className="me-3"
            src={getLeagueImage(leagueId, gameName)}
            alt="league-logo"
            height="30px"
            width="30px"
          />
          <h6>{leagueName}</h6>
        </Card.Header>
        <Container fluid>
          <Row className="mt-2">
            <Col
              md={3}
              sm={3}
              xs={3}
              className="d-flex align-items-center flex-column"
            >
              <img
                src={homeTeamImage || '/default-logo.png'}
                height="40px"
                width="40px"
                alt='home-team-logo'
              />
              <img
                className="mt-3"
                src={awayTeamImage || '/default-logo.png'}
                height="40px"
                width="40px"
                alt='away-team-logo'
              />

            </Col>
            <Col
              md={9}
              sm={9}
              xs={9}
              className="d-flex justify-content-center flex-column"
            >
              <h5 className="m-0 title__text">{marketName}</h5>
              <p className="mt-1">
                Market Closes <Moment fromNowDuring>{startingOn}</Moment>
              </p>
              <PrimaryButton
                height="35px"
                width="100px"
                onClick={() =>
                  handleOpenGames(
                    gameName === 'Worldcup' ? 'Football' : gameName,
                    status,
                    gameId
                  )
                }
                disabled={disabled}
              >
                Host Now
              </PrimaryButton>
            </Col>
          </Row>
        </Container>
      </StyledOpenCard>
      <StyledModal
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
            Place your Seed Bet
          </Modal.Title>
        </Modal.Header>
        {checkAllowance && (
          <Modal.Body className="text-center check-allowance">
            <i className="fas fa-stroopwafel fa-spin fa-2x" />
            <br />
            <p className="pt-3">
              Please wait, while our gamebots are checking your allowance.
            </p>
          </Modal.Body>
        )}
        {!checkAllowance && (
          <Modal.Body>
            <div className="mt-4">
              <h6>Market Name</h6>
              <h5>{marketName}</h5>
            </div>
            <div className="mt-4">
              <h6>Starting On:</h6>
              <h5> {startingOn}</h5>
            </div>
            <div className="d-flex  mt-3 align-items-center">
              <div>
                <h6>Total Fee</h6>
                <h5>75 BET</h5>
              </div>
              <div className="mx-3">
                <i className="fa fa-equals" />
              </div>
              <div>
                <h6>Hosting Fee</h6>
                <h5>25 BET</h5>
              </div>
              <div className="mx-3">
                <i className="fa fa-add" />
              </div>
              <div>
                <h6>Seed Bet</h6>
                <h5>50 BET</h5>
              </div>
            </div>
            <div className="mt-4">
              <h6>Select your Bet</h6>
              <HostGame
                formParams={{
                  gameName: gameName === 'Worldcup' ? 'Football' : gameName,
                  marketName,
                  gameId
                }}
                betOptions={betOptions}
                refetchFunction={refetchFunction}
                onSubmitForm={handleHostGame}
              />
            </div>
          </Modal.Body>
        )}
      </StyledModal>
    </>
  )
}
OpenCard.propTypes = {
  gameId: PropTypes.string.isRequired,
  leagueName: PropTypes.string.isRequired,
  leagueId: PropTypes.string.isRequired,
  marketName: PropTypes.string.isRequired,
  homeTeamImage: PropTypes.string.isRequired,
  awayTeamImage: PropTypes.string.isRequired,
  startingOn: PropTypes.string.isRequired,
  gameName: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
}

export default OpenCard
