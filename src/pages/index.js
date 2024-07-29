/* eslint-disable no-underscore-dangle */
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Row, Col, Container, Card, Carousel } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { getSingleGames, getStats } from 'src/api/games/games'
// import PrimaryButton from 'src/components/button/PrimaryButton'
import HostedCard from 'src/components/card/HostedCard'
import CustomLink from 'src/components/link/Link'
import Meta from 'src/components/meta/Meta'
import { NoSSRWrapper } from 'src/layout/NoSSRWrapper'
import { oddsGameIdMap } from 'src/utils/utils'
import styled from 'styled-components'

const HomeWrapper = styled.div`
  margin-top: 130px;
  .home_wrapper__left {
    margin-top: 40px;
    width: 100%;
    @media screen and (max-width: 690px) {
      margin-top: 0px;
    }
    h5 {
      font-size: 18px;
      line-height: 30px;
      color: #fff;
      letter-spacing: 1px;
      font-weight: 300;
      @media screen and (max-width: 690px) {
        font-size: 14px;
        line-height: 20px;
      }
    }
    h1 {
      margin-top: 10px;
      font-size: 58px;
      @media screen and (max-width: 690px) {
        font-size: 30px;
        line-height: 35px;
      }
      color: #fff;
      font-weight: 800;
      line-height: 60px;
      span {
        font-weight: 400;
        font-size: 38px;
        @media screen and (max-width: 690px) {
          font-size: 24px;
          line-height: 28px;
        }
      }
    }
    p {
      margin-top: 30px;
      font-size: 20px;
      color: rgba(255, 255, 255, 0.86);
      @media screen and (max-width: 690px) {
        font-size: 14px;
        margin-top: 10px;
      }
    }
  }
  .stats__wrapper {
    min-height: 150px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 20px;
    margin-top: 100px;
  }
`
const HomeTitle = styled.h1`
  margin-top: 80px;
  @media screen and (max-width: 690px) {
    margin-top: 30px;
  }
  font-size: 32px;
  position: relative;
  padding-left: 20px;
  color: #fff;
  &:before {
    content: '';
    position: absolute;
    height: 100%;
    width: 5px;
    background: #ce2d74;
    bottom: -10px;
    top: 0px;
    left: 0px;
  }
`
const MarketCard = styled.div`
  height: 140px;
  margin: 20px 0px;
  width: 100%;
  background: url('${props => props.background}');
  background-size: 100%;
  border-radius: 20px;
  font-size: 38px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  z-index: 1;
  .overlay {
    height: 100%;
    width: 100%;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.26);
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
const AcheivementCard = styled.div`
  text-align: center;
  margin-top: 20px;
  width: 100%;
  h1 {
    font-size: 40px;
    color: #fff;
  }
  h6 {
    font-size: 18px;
    color: #fff;
    font-weight: 300;
    margin-top: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`
const BackgroundButton = styled.button`
  background: url('${props => props.$bg}') no-repeat;
  background-size: 100% 100%;
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  height: 60px;
  width: 300px;
  border: 0px;
`
const NewsCard = styled(Card)`
  margin: 10px 10px 20px 0px;
  width: 100%;
  border-radius: 20px;
  background: ${props => props.theme.background};
  text-align: left;
  .card-body {
    margin: 5px 20px;
    padding: 0px;
  }
  .card-img-top {
    border-radius: 20px 20px 0px 0px;
    height: 200px;
  }
  .card-title {
    font-size: 20px;
    font-weight: 500;
    margin: 10px 0px;
  }
  .card-title {
    font-size: 20px;
    font-weight: 500s;
    height: 70px;
    overflow: hidden;
    color: #fff;
    margin-top: 10px;
  }
  .card-text {
    font-size: 14px;
    height: 60px;
    overflow: hidden;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    margin: 10px 0px;
  }
  button {
    margin-top: 10px;
    margin-bottom: 20px;
  }
`
const Index = () => {
  const [stats, setStats] = useState({
    betsNumber: 0,
    betsVolume: 0,
    gamesHosted: 0,
    totalVolume: 0
  })
  const gameName = 'Worldcup'
  const { walletAddress } = useSelector(state => ({
    walletAddress: state.auth.walletAddress
  }))
  const [loading, setLoading] = useState(false)
  const [singleGame, setSingleGame] = useState('')
  const getStatsFromAPI = async () => {
    getStats().then(response => {
      setStats(response.total)
    })
  }
  const getSingleGameFromAPI = async () => {
    setLoading(true)
    getSingleGames({
      gameName,
      gameId: '1666766',
      walletAddress: walletAddress.base16
    })
      .then(response => {
        setSingleGame(response.games[0])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getStatsFromAPI()
    // getSingleGameFromAPI()
  }, [])
  return (
    <>
      <Meta
        title="PredictionDEX"
        description="PredictionDEX is a web3 betting platform to predict, trade & swap outcomes of future events. Powered by blockchain and BET token."
        image="/Homepage.png"
      />
      <NoSSRWrapper>
        <HomeWrapper>
          <Container fluid>
            <Row className="align-items-center">
              <Col md="5">
                <div className="home_wrapper__left">
                  <h1>Peer to Peer Prediction Platform</h1>
                  <p>
                    Predict, trade & swap future events in Sports, Politics,
                    Crypto, Science & more. Tokenization of analytical outcomes in
                    $BET.
                  </p>
                  <div className="d-flex flex-column align-items-center align-items-md-start">
                    <div className="mt-5">
                      <CustomLink to="/markets/create">
                        <BackgroundButton $bg="/OrangeBg.png">
                          <i className="fa fa-shop me-3" />
                          Create a Market
                        </BackgroundButton>
                      </CustomLink>
                    </div>
                    <div className="mt-5">
                      <CustomLink to="/featured-markets">
                        <BackgroundButton $bg="/YellowBg.png">
                          <i className="fa fa-star me-3" />
                          Featured Markets
                        </BackgroundButton>
                      </CustomLink>
                    </div>
                  </div>
                  {/* <div className="mt-4">
                  <a
                    href="https://discord.gg/7JnEmTBd78"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <PrimaryButton width="250px">
                      <i className="fab fa-discord me-3" />
                      Join our Discord
                    </PrimaryButton>
                  </a>
                </div> */}
                </div>
              </Col>
              <Col
                md="7"
                className="d-flex justify-content-center flex-column align-items-center mt-3 mt-md-0"
              >
                <Carousel controls={false} style={{ maxWidth: 600, height: 400 }}>

                  {singleGame && !loading && <Carousel.Item>

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
                      refetchFunction={getSingleGameFromAPI}
                      result={singleGame?.result}
                      gameWithOdds={singleGame.details.idEvent in oddsGameIdMap}
                      small
                      oddsArray={oddsGameIdMap[singleGame.details.idEvent]}
                    />

                  </Carousel.Item>}
                  <Carousel.Item>
                    <img
                      src="/WorldcupImage.png"
                      alt="Second slide"
                      className="img-fluid"
                    />
                  </Carousel.Item>
                </Carousel>
              </Col>
            </Row>
          </Container>
          <Container fluid>
            <HomeTitle>Current Seasons Stats</HomeTitle>
            <Row className="mt-5 stats__wrapper">
              <Col md={3}>
                <AcheivementCard>
                  <h1>
                    <Image
                      src="/prize_pool.png"
                      height={50}
                      width={50}
                      className="me-3"
                      alt='prize_pool'
                    />
                    {stats.gamesHosted}
                  </h1>
                  <h6>Markets Hosted</h6>
                </AcheivementCard>
              </Col>
              <Col md={3}>
                <AcheivementCard>
                  <h1>
                    <Image

                      src="/your_bet.png"
                      height="60"
                      width="60"
                      className="me-3"
                      alt='your_bet'
                    />
                    {stats.betsNumber}{' '}
                  </h1>
                  <h6>TOTAL BETS </h6>
                </AcheivementCard>
              </Col>
              <Col md={3}>
                <AcheivementCard>
                  <h1>
                    <Image
                      src="/PredictionDEX.png"
                      height={40}
                      width={40}
                      className="me-3"
                      alt='PredictionDEX'
                    />
                    {stats.totalVolume}
                  </h1>
                  <h6>TOTAL VOLUME</h6>
                </AcheivementCard>
              </Col>
              <Col md={3}>
                <AcheivementCard>
                  <h1>
                    <Image
                      src="/PredictionDEX.png"
                      height={40}
                      width={40}
                      className="me-3"
                      alt='PredictionDEX'
                    />
                    0
                  </h1>
                  <h6>REWARD Distributed</h6>
                </AcheivementCard>
              </Col>
            </Row>
          </Container>

          <Container fluid>
            <HomeTitle>Available Markets</HomeTitle>
            <Row className="mt-5">
              <Col md={4}>
                <CustomLink to="/football">
                  <MarketCard background="/Football.jpeg">
                    <div className="overlay">
                      <i>FOOTBALL</i>
                    </div>
                  </MarketCard>{' '}
                </CustomLink>
              </Col>

              <Col md={4}>
                <CustomLink to="/nba">
                  <MarketCard background="/BasketballCover.jpeg">
                    <div className="overlay">
                      <i>BASKETBALL</i>
                    </div>
                  </MarketCard>
                </CustomLink>
              </Col>
              <Col md={4}>
                <CustomLink to="/nfl">
                  <MarketCard background="/NFL.jpeg">
                    <div className="overlay">
                      <i>NFL</i>
                    </div>
                  </MarketCard>
                </CustomLink>
              </Col>
              <Col md={4}>
                <CustomLink to="/nhl">
                  <MarketCard background="/nhlCover.jpeg">
                    <div className="overlay">
                      <i>NHL</i>
                    </div>
                  </MarketCard>
                </CustomLink>
              </Col>
              <Col md={4}>
                <CustomLink to="/user-market">
                  <MarketCard background="/Betting.jpeg">
                    <div className="overlay">
                      <i>USER MARKET</i>
                    </div>
                  </MarketCard>
                </CustomLink>
              </Col>
            </Row>
          </Container>
          <Container fluid>
            <HomeTitle>Previous Seasons Stats</HomeTitle>
            <Row className="mt-5 stats__wrapper">
              <Col md={3}>
                <AcheivementCard>
                  <h1>7K +</h1>
                  <h6>Markets Hosted</h6>
                </AcheivementCard>
              </Col>
              <Col md={3}>
                <AcheivementCard>
                  <h1>15K+ </h1>
                  <h6>Predictions Made</h6>
                </AcheivementCard>
              </Col>
              <Col md={3}>
                <AcheivementCard>
                  <h1>1.5M+</h1>
                  <h6>ZIL Transacted</h6>
                </AcheivementCard>
              </Col>
              <Col md={3}>
                <AcheivementCard>
                  <h1>500K+</h1>
                  <h6>REWARD Distributed</h6>
                </AcheivementCard>
              </Col>
            </Row>
          </Container>
          <Container fluid>
            <HomeTitle>Trending News</HomeTitle>
            <Row className="mt-5">
              <Col md={3}>
                <NewsCard>
                  <Card.Img variant="top" src="/Homepage.png" alt="FIFA World Cup 2022: Betting, Fantasy, and Crypto" />
                  <Card.Body>
                    <a
                      href="https://redchillies.medium.com/fifa-world-cup-2022-betting-fantasy-and-crypto-ab8af686dd26"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Card.Title>
                        FIFA World Cup 2022: Betting, Fantasy, and Crypto
                      </Card.Title>
                    </a>
                    <Card.Text>
                      Are you excited about the World Cup 2022, which will surely
                      be one of the most exciting events in the after the
                      pandemics.
                    </Card.Text>
                    {/* <a
                      href="https://redchillies.medium.com/fifa-world-cup-2022-betting-fantasy-and-crypto-ab8af686dd26"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <PrimaryButton variant="primary">Read More</PrimaryButton>
                    </a> */}
                  </Card.Body>
                </NewsCard>
              </Col>
              <Col md={3}>
                <NewsCard>
                  <Card.Img variant="top" src="/PredictionDexNews1.png" alt="PredictionDEX— Decentralized Prediction Market Using
                        Blockchain Technology" />
                  <Card.Body>
                    <a
                      href="https://redchillies.medium.com/predictiondex-decentralized-prediction-market-usinyg-blockchain-technology-787624a1dc3a"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Card.Title>
                        PredictionDEX— Decentralized Prediction Market Using
                        Blockchain Technology
                      </Card.Title>
                    </a>
                    <Card.Text>
                      Predictiondex is a decentralized platform for predicting
                      outcomes of future events. Using the power of blockchain
                      technology to make predictions
                    </Card.Text>
                    {/* <a
                      href="https://redchillies.medium.com/predictiondex-decentralized-prediction-market-using-blockchain-technology-787624a1dc3a"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <PrimaryButton variant="primary">Read More</PrimaryButton>
                    </a> */}
                  </Card.Body>
                </NewsCard>
              </Col>
              <Col md={3}>
                <NewsCard>
                  <Card.Img
                    variant="top"
                    src="https://zilchill.ams3.digitaloceanspaces.com/redcv3.png"
                    alt="RedChillies Labs Bringing The Biggest Update in its V3 Release"
                  />
                  <Card.Body>
                    <a
                      href="https://redchillies.medium.com/redchillies-labs-bringing-for-the-biggest-update-in-its-v3-release-e84d868550cd"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Card.Title>
                        RedChillies Labs Bringing The Biggest Update in its V3
                        Release
                      </Card.Title>
                    </a>
                    <Card.Text>
                      RedChillies Labs team is planning to release its biggest
                      update “V3” as a part of “Moruga” phase. This will be
                      branded into 3 dApps. token.
                    </Card.Text>
                    {/* <a
                      href="https://redchillies.medium.com/ludo-dice-lets-play-multiplayer-game-on-zilliqa-by-redchillies-redc-labs-c6e250b91692"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <PrimaryButton variant="primary">Read More</PrimaryButton>
                    </a> */}
                  </Card.Body>
                </NewsCard>
              </Col>
            </Row>
          </Container>
        </HomeWrapper>
      </NoSSRWrapper>
    </>
  )
}

export default Index
