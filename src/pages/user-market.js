import React from 'react'
import styled from 'styled-components'
import Meta from 'src/components/meta/Meta'
import { useGamePage } from 'src/hooks/pages/useGamePage'
import WeeklyStatsCard from 'src/modules/games/WeeklyStatsCard'
import GameTabs from 'src/modules/games/GameTabs'

const GameWrapper = styled.section`
  min-height: 100%;
`

const NHLPage = () => {
  const gameName = 'UserMarkets'
  const {
    games,
    toggleKey,
    walletAddress,
    gameStatus,
    totalGames,
    search,
    gameFilter,
    leagueIds,
    sidebar,
    footballLeagues,
    selectedLeagues,
    stats,
    handleSearch,
    setToggleKey,
    handleViewMore,
    handleSelectedLeagues,
    getGamesFromAPI,
    handleFilterLeagues
  } = useGamePage(gameName)
  return (
    <GameWrapper>
      <Meta title={`${gameName} | PredictionDEX`} />
      <WeeklyStatsCard
        gameName={gameName}
        gamesHosted={stats[gameName]?.gamesHosted || 0}
        betsVolume={stats[gameName]?.betsVolume || 0}
        betsNumber={stats[gameName]?.betsNumber || 0}
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
        setToggleKey={setToggleKey}
        handleViewMore={handleViewMore}
        handleFilterLeagues={handleFilterLeagues}
        handleSelectedLeagues={handleSelectedLeagues}
        getGamesFromAPI={getGamesFromAPI}
        isUserMarket
      />
    </GameWrapper>
  )
}

export default NHLPage
