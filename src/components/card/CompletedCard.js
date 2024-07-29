import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import CustomLink from 'src/components/link/Link'
import { getLeagueImage } from 'src/utils/utils'
import OutlinedButton from '../button/OutlinedButton'

const StyledCompletedCard = styled(Card)`
  border-radius: 20px;
  padding-bottom: 20px;
  margin: 20px 10px;
  background: ${props => props.theme.background};
  .card-header {
    background: transparent;
    padding: 12px 0px;
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
  .title__text {
    font-size: 14px;
    font-weight: 700;
    min-height: 20px;
    max-height: 48px;
    overflow: hidden;
    line-height: 20px;
    flex: 1;
  }
  p {
    font-size: 100%;
    font-weight: 400;
    padding-top: 8px;
    color: ${props => props.theme.reverse};
  }
`

const CompletedCard = ({
  gameId,
  leagueName,
  leagueId,
  marketName,
  homeTeamImage,
  awayTeamImage,
  gameName,
  score,
  totalZil,
  gameStatus
}) =>
  <StyledCompletedCard>
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
      <Row>
        <Col
          md={3}
          sm={3}
          xs={3}
          className="d-flex align-items-start flex-column align-items-center pt-2"
        >
          <img
            className="m-1"
            src={homeTeamImage}
            alt="league-logo"
            height="50px"
            width="50px"
          />
          <img
            className="m-1 mt-1"
            src={awayTeamImage}
            alt="league-logo"
            height="50px"
            width="50px"
          />
        </Col>
        <Col
          md={9}
          sm={9}
          xs={9}
          className="d-flex justify-content-center flex-column"
        >
          <CustomLink to={`${gameName}/${leagueName}/${gameId}`}>
            <h5 className="m-0 title__text pt-2">{marketName}</h5>
          </CustomLink>
          <p>
            Status: {gameStatus} | {score && `Result: ${score}`}
          </p>
          {gameStatus === 'Abandoned' && <p>Score: N/A</p>}
          <OutlinedButton>{totalZil} BET</OutlinedButton>
        </Col>
      </Row>
    </Container>
  </StyledCompletedCard>


CompletedCard.defaultProps = {
  score: '',
  totalZil: ''
}
CompletedCard.propTypes = {
  gameId: PropTypes.string.isRequired,
  leagueName: PropTypes.string.isRequired,
  leagueId: PropTypes.string.isRequired,
  marketName: PropTypes.string.isRequired,
  homeTeamImage: PropTypes.string.isRequired,
  awayTeamImage: PropTypes.string.isRequired,
  gameName: PropTypes.string.isRequired,
  gameStatus: PropTypes.string.isRequired,
  score: PropTypes.string,
  totalZil: PropTypes.number
}

export default CompletedCard
