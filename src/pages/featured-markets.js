import React from 'react'
import Meta from 'src/components/meta/Meta'
import { useGamePage } from 'src/hooks/pages/useGamePage'
import WeeklyStatsCard from 'src/modules/games/WeeklyStatsCard'
import GameTabs from 'src/modules/games/GameTabs'
import styled from 'styled-components'

const GameWrapper = styled.section`
  min-height: 100%;
`
const WorldCupPage = () => {
  const gameName = 'FeaturedMarkets'
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
  } = useGamePage('FeaturedMarkets')
  return (
    <GameWrapper>
      <Meta title={`${gameName} | PredictionDEX`} />
      <WeeklyStatsCard
        gameName={gameName}
        gamesHosted={stats.FeaturedMarkets?.gamesHosted || 0}
        betsVolume={stats.FeaturedMarkets?.betsVolume || 0}
        betsNumber={stats.FeaturedMarkets?.betsNumber || 0}
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

export default WorldCupPage
