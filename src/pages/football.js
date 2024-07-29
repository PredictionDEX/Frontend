import React from 'react'
import Meta from 'src/components/meta/Meta'
import { useGamePage } from 'src/hooks/pages/useGamePage'
import WeeklyStatsCard from 'src/modules/games/WeeklyStatsCard'
import GameTabs from 'src/modules/games/GameTabs'
import styled from 'styled-components'

const GameWrapper = styled.section`
  min-height: 100%;
`
const FootballPage = () => {
  const gameName = 'Football'
  const {
    games,
    toggleKey,
    gameStatus,
    totalGames,
    search,
    gameFilter,
    leagueIds,
    sidebar,
    footballLeagues,
    selectedLeagues,
    stats,
    walletAddress,
    setGameFilter,
    showSidebar,
    setToggleKey,
    handleViewMore,
    handleSelectedLeagues,
    handleSearch,
    getGamesFromAPI,
    handleFilterLeagues,
    resetFilter
  } = useGamePage(gameName)
  return (
    <GameWrapper>
      <Meta title={`${gameName} | PredictionDEX`} />
      <WeeklyStatsCard
        gameName={gameName}
        gamesHosted={stats[gameName].gamesHosted}
        betsVolume={stats[gameName].betsVolume}
        betsNumber={stats[gameName].betsNumber}
      />
      <GameTabs
        toggleKey={toggleKey}
        totalGames={totalGames}
        games={games}
        search={search}
        gameFilter={gameFilter}
        leagueIds={leagueIds}
        sidebar={sidebar}
        footballLeagues={footballLeagues}
        selectedLeagues={selectedLeagues}
        gameStatus={gameStatus}
        gameName={gameName}
        walletAddress={walletAddress}
        handleSearch={handleSearch}
        resetFilter={resetFilter}
        setGameFilter={setGameFilter}
        showSidebar={showSidebar}
        setToggleKey={setToggleKey}
        handleViewMore={handleViewMore}
        handleFilterLeagues={handleFilterLeagues}
        handleSelectedLeagues={handleSelectedLeagues}
        getGamesFromAPI={getGamesFromAPI}
        hasLeagueFilter
      />
    </GameWrapper>
  )
}

export default FootballPage
