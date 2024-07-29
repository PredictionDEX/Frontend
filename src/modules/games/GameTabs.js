import React, { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Col, Container, Row } from 'react-bootstrap'
import styled from 'styled-components'
import CompletedCard from 'src/components/card/CompletedCard'
import HostedCard from 'src/components/card/HostedCard'
import LiveCard from 'src/components/card/LiveCard'
import OpenCard from 'src/components/card/OpenCard'
import FilterCard from 'src/components/card/FilterCard'
import Loader from 'src/components/loader/Loader'
import TransparentButton from 'src/components/button/TransparentButton'
import { useGamePageTabs } from 'src/hooks/pages/useGamePageTabs'
import CustomLink from 'src/components/link/Link'
import { oddsGameIdMap } from 'src/utils/utils'
import { useRouter } from 'next/router'

const TabsWrapper = styled.div`
  display: flex;
  margin: 40px 0px 30px 0px;
  flex-flow: wrap;
  button {
    font-size: 130%;
    background: transparent;
    border: 0px;
    color: #fff;
    margin-right: 20px;
    padding: 0px 0px 10px 0px;
    width: 150px;
    border-bottom: 3px solid transparent;
    @media screen and (max-width: 690px) {
      width: 50%;
      margin: auto;
      margin-bottom: 10px;
    }
    &:hover,
    &:active,
    &:focus {
      background: transparent;
      border: 0px;
      border-bottom: 3px solid transparent;
    }
  }
  .active {
    border-bottom: 3px solid rgba(105,95,220,1) !important;

    @media screen and (max-width: 690px) {
      width: 50%;
      margin: auto;
    }
  }
`

const GameTabs = ({
  toggleKey,
  totalGames,
  games,
  search,
  gameStatus,
  gameName,
  setToggleKey,
  getGamesFromAPI,
  handleViewMore,
  handleSearch,
  isUserMarket = false
}) => {
  const { handleOpen, commonMessages } = useGamePageTabs(
    gameStatus,
    games,
    setToggleKey,
    handleSearch
  )
  const router = useRouter()


  useEffect(()=>{
    if(router.asPath.split('#').length > 1){
      const gameType = router.asPath.split('#')[1]
      setToggleKey(['Live', 'Hosted','Completed', 'Open'].includes(gameType) ? gameType : 'Hosted')
    }
  }, [router.asPath])
  // const gameIdWithOdds = ['1543899']

  return (
    <>
      {isUserMarket && (
        <Row className="justify-content-end mt-4">
          <Col md="2">
            <CustomLink to="/markets/create">
              <TransparentButton width="100%" onClick={() => handleOpen()}>
                <i className="fa fa-add me-2" /> Add a Market
              </TransparentButton>
            </CustomLink>
          </Col>
        </Row>
      )}
      <TabsWrapper>
        {[
          {
            type: 'Hosted',
            label: 'Live Markets',
          },
          {
            type: 'Open',
            label: 'New Markets',
          },
          {
            type: 'Live',
            label: 'Closed Markets',
          },
          {
            type: 'Completed',
            label: 'Resolved Markets',
          },

        ].map(tab => ( 
          <button
            key={tab.type}
            onClick={() => {
              // handleToggleKey(tab.type)
              router.replace(router.pathname, `${router.pathname  }#${tab.type}`, { shallow: true })
            }}
            className={`${toggleKey === tab.type && 'active'}`}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </TabsWrapper>

      <InfiniteScroll
        dataLength={games.length}
        className="w-100 p-0"
        next={handleViewMore}
        hasMore={totalGames !== games.length}
        loader={<Loader />}
      >
        <Container fluid>
          <FilterCard>
            <Row className="align-items-center">
              <Col md={12}>
                <input
                  type="text"
                  className="w-100 p-2"
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Search for Markets"
                />
              </Col>
            </Row>
          </FilterCard>
          <Row>
            {toggleKey === 'Hosted' && (
              <>
                {commonMessages}
                {!gameStatus.loading &&
                  games.length > 0 &&
                  games?.map(hostedGame => (
                    <Col sm={12} md={12} lg={4} key={hostedGame._id}>
                      <HostedCard
                        key={hostedGame._id}
                        gameId={hostedGame.details.idEvent}
                        gameStatus={hostedGame.gameStatus}
                        leagueName={hostedGame.details.strLeague}
                        leagueId={
                          gameName === 'UserMarkets'
                            ? hostedGame.details?.strLeague
                            : hostedGame.details?.idLeague
                        }
                        marketName={
                          gameName === 'UserMarkets'
                            ? hostedGame.details.strEvent
                            : `${hostedGame.details.strHomeTeam} vs ${hostedGame.details.strAwayTeam}`
                        }
                        homeTeamImage={hostedGame.details.homeTeamLogo}
                        awayTeamImage={hostedGame.details.awayTeamLogo}
                        startingOn={hostedGame.details.strTimestamp}
                        gameName={gameName}
                        roundName={hostedGame.details.intRound}
                        currentTime={hostedGame?.time?.minute}
                        betOptions={
                          gameName === 'UserMarkets'
                            ? [
                                hostedGame.details.strOptionA,
                                hostedGame.details.strOptionB,
                                hostedGame.details.strOptionC
                              ]
                            : [
                                `Win by ${hostedGame.details.strHomeTeam}`,
                                `Win by ${hostedGame.details.strAwayTeam}`,
                                `Draw`
                              ]
                        }
                        poolAmount={{
                          homeTeam: hostedGame?.bets?.winPoolBetAmount,
                          draw: hostedGame?.bets?.drawPoolBetAmount,
                          awayTeam: hostedGame?.bets?.losePoolBetAmount
                        }}
                        bets={hostedGame?.bets?.userBet}
                        totalPoolAmount={hostedGame?.bets?.totalBetAmount}
                        finalScore={
                          hostedGame?.result && hostedGame?.result?.finalScore
                        }
                        totalBets={hostedGame?.bets?.numberOfBets}
                        highlights={
                          hostedGame.highlights &&
                          hostedGame.highlights.data[0]?.location
                        }
                        small
                        refetchFunction={getGamesFromAPI}
                        gameWithOdds={hostedGame.details.idEvent in oddsGameIdMap}

                        oddsArray={oddsGameIdMap[hostedGame.details.idEvent]}
                      />
                    </Col>
                  ))}
              </>
            )}
            {toggleKey === 'Open' && (
              <>
                {commonMessages}
                {!gameStatus.loading &&
                  games.length > 0 &&
                  games?.map(openGame => (
                    <Col sm={12} md={12} lg={4} key={openGame._id}>
                      <OpenCard
                        gameId={openGame.details.idEvent}
                        leagueName={openGame.details.strLeague}
                        leagueId={
                          gameName === 'UserMarkets'
                            ? openGame.details?.strLeague
                            : openGame.details?.idLeague
                        }
                        marketName={
                          gameName === 'UserMarkets'
                            ? openGame.details.strEvent
                            : `${openGame.details.strHomeTeam} vs ${openGame.details.strAwayTeam}`
                        }
                        homeTeamImage={openGame.details.homeTeamLogo}
                        awayTeamImage={openGame.details.awayTeamLogo}
                        startingOn={openGame.details.strTimestamp}
                        gameName={gameName}
                        betOptions={
                          gameName === 'UserMarkets'
                            ? [
                                openGame.details.strOptionA,
                                openGame.details.strOptionB,
                                openGame.details.strOptionC
                              ]
                            : [
                                `Win by ${openGame.details.strHomeTeam}`,
                                `Win by ${openGame.details.strAwayTeam}`,
                                `Draw`
                              ]
                        }
                        refetchFunction={() => getGamesFromAPI()}
                        status="Open"
                      />
                    </Col>
                  ))}
              </>
            )}
            {toggleKey === 'Live' && (
              <>
                {commonMessages}
                {!gameStatus.loading &&
                  games.length > 0 &&
                  games?.map(liveGame => (
                    <Col sm={12} md={12} lg={4} key={liveGame._id}>
                      <LiveCard
                        key={liveGame._id}
                        gameId={liveGame.details.idEvent}
                        gameStatus={liveGame.gameStatus}
                        leagueName={liveGame.details.strLeague}
                        leagueId={
                          gameName === 'UserMarkets'
                            ? liveGame.details?.strLeague
                            : liveGame.details?.idLeague
                        }
                        marketName={
                          gameName === 'UserMarkets'
                            ? liveGame.details.strEvent
                            : `${liveGame.details.strHomeTeam} vs ${liveGame.details.strAwayTeam}`
                        }
                        homeTeamImage={liveGame.details.homeTeamLogo}
                        awayTeamImage={liveGame.details.awayTeamLogo}
                        startingOn={liveGame.details.strTimestamp}
                        gameName={gameName}
                        totalZil={liveGame?.bets?.totalBetAmount}
                        currentTime=""
                      />
                    </Col>
                  ))}
              </>
            )}
            {toggleKey === 'Completed' && (
              <>
                {commonMessages}
                {!gameStatus.loading &&
                  games.length > 0 &&
                  games?.map(completedGame => (
                    <Col sm={12} md={12} lg={4} key={completedGame._id}>
                      <CompletedCard
                        key={completedGame._id}
                        gameId={completedGame.details.idEvent}
                        gameStatus={completedGame.gameStatus}
                        leagueName={completedGame.details.strLeague}
                        leagueId={
                          gameName === 'UserMarkets'
                            ? completedGame.details?.strLeague
                            : completedGame.details?.idLeague
                        }
                        marketName={
                          gameName === 'UserMarkets'
                            ? completedGame.details.strEvent
                            : `${completedGame.details.strHomeTeam} vs ${completedGame.details.strAwayTeam}`
                        }
                        homeTeamImage={completedGame.details.homeTeamLogo}
                        awayTeamImage={completedGame.details.awayTeamLogo}
                        gameName={gameName}
                        totalZil={completedGame?.bets?.totalBetAmount}
                        score={completedGame?.result?.finalScore}
                      />
                    </Col>
                  ))}
              </>
            )}
          </Row>
        </Container>
      </InfiniteScroll>
    </>
  )
}

export default GameTabs
