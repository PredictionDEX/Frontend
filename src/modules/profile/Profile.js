import React from 'react'
import { Col, Row, Container } from 'react-bootstrap'
import { useProfile } from 'src/hooks/pages/useProfile'
import styled from 'styled-components'
import Meta from 'src/components/meta/Meta'
import Image from 'next/image'
import MyGameTabs from 'src/modules/games/MyGameTabs'
import { PieChart } from 'react-minimal-pie-chart'

const MyGameWrapper = styled.div`
  margin-top: 90px;
  background: transparent;
`

const StyledProfileCard = styled.div`
  background: ${props => props.theme.background};
  border-radius: 20px;
  min-height: 100px;
  padding: 20px;
  color: #fff;
  display: flex;
  align-items: center;
  h4 {
    font-size: 12px;
  }
  h1 {
    font-size: 16px;
  }
`
const ProfileTabWrapper = styled.div`
  display: flex;
  margin: 40px 0px 30px 0px;
  button {
    font-size: 130%;
    background: transparent;
    border: 0px;
    color: #fff;
    margin-right: 20px;
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
    border-bottom: 3px solid rgba(105,95,220,1) !important;
  }
`
const StyledDashboardWrapper = styled.section`
  padding-top: 50px;
  min-height: 200px;
  .dashboard__cards {
    margin-bottom: 30px;
    text-align: center;
    h6 {
      font-weight: 300;
      font-size: 14px;
      letter-spacing: 1px;
    }
    h4 {
      font-weight: 500;
      font-size: 20px;
      letter-spacing: 1px;
    }
  }
`
const MyGames = () => {
  const gameName = 'MyGames'
  const {
    games,
    walletAddress,
    toggleKey,
    gameStatus,
    totalGames,
    unclaimedGames,
    unclaimedHosts,
    profileToggle,
    betLoading,
    dashboardStats,
    dashboardLoading,
    updateProfileToggle,
    updateToggleKey,
    trimWallet,
    handleViewMore,
    getGamesFromAPI,
    getBetsStatus
  } = useProfile(gameName)
  const winPercentage =
    Number(dashboardStats?.total?.winCount) > 0 ||
    Number(dashboardStats?.total?.loseCount)
      ? (
          (Number(dashboardStats?.total?.winCount) /
            (Number(dashboardStats?.total?.winCount) +
              Number(dashboardStats?.total?.loseCount))) *
          100
        ).toFixed(2)
      : 0
  const losePercentage = (100 - winPercentage).toFixed(2)
  const dataMock = [
    {
      title: 'Total Loss',
      value: Number(losePercentage),
      color: '#249EA0',
      label: 'Lose Rate'
    },
    {
      title: 'Total Wins',
      value: Number(winPercentage),
      color: '#F78104',
      label: 'Win Rate'
    }
  ]
  return (
    <MyGameWrapper>
      <Meta title="Profile | PredictionDex" />
      <div className="pt-5">
        <StyledProfileCard>
          <Container fluid>
            <Row className="align-items-center">
              <Col lg={6} md={3} className="d-flex">
                <div>
                  <Image src="/ProfileIcon.png" height="50" width="50" />
                </div>
                <div className="ms-3">
                  <h6 className="text-light text-uppercase">Wallet Address</h6>
                  <h1 className="text-light">
                    {trimWallet(walletAddress.base16)}
                  </h1>
                </div>
              </Col>
              <Col lg={2} md={3} className="text-center mt-3 mt-md-0">
                <h5>XP Collected</h5>
                <small>Coming Soon</small>
              </Col>
              <Col lg={2} md={3} className="text-center mt-3 mt-md-0">
                <h5>Level</h5>
                <small>Coming Soon</small>{' '}
              </Col>
              <Col lg={2} md={3} className="text-center  mt-3 mt-md-0">
                <h5>Coupons Available</h5>
                <small>Coming Soon</small>{' '}
              </Col>
            </Row>
          </Container>
        </StyledProfileCard>
      </div>
      <ProfileTabWrapper>
        <button
          onClick={() => updateProfileToggle('Dashboard')}
          className={`${profileToggle === 'Dashboard' && 'active'}`}
          type="button"
        >
          Dashboard
        </button>
        <button
          onClick={() => updateProfileToggle('Markets')}
          className={`${profileToggle === 'Markets' && 'active'}`}
          type="button"
        >
          Your Markets
        </button>
      </ProfileTabWrapper>
      {profileToggle === 'Dashboard' && (
        <StyledDashboardWrapper>
          {dashboardLoading && <p className="text-light">Loading</p>}
          {!dashboardLoading && (
            <div className="row align-items-center">
              <div className="col-md-7 d-flex justify-content-center">
                <PieChart
                  lineWidth={30}
                  rounded
                  label={({ dataEntry }) =>
                    `${dataEntry.value}% ${dataEntry.label}`
                  }
                  labelStyle={index => ({
                    fill: dataMock[index].color,
                    fontSize: '3px',
                    margin: '0px auto'
                  })}
                  style={{ width: 500 }}
                  data={dataMock}
                />
              </div>
              <div className="col-md-5">
                <div className="row">
                  <div className="d-flex justify-content-around">
                    <div className="dashboard__cards">
                      <h4 className="text-light">
                        {dashboardStats?.total?.hostedCount}
                      </h4>
                      <h6 className="text-light">HOSTED</h6>
                    </div>
                    <div className="dashboard__cards">
                      <h4 className="text-light">
                        {dashboardStats?.total?.betCount}
                      </h4>
                      <h6 className="text-light">BETTED</h6>
                    </div>
                  </div>
                  <div className="d-flex justify-content-around">
                    <div className="dashboard__cards">
                      <h4 className="text-light">
                        {dashboardStats?.total?.winCount}
                      </h4>
                      <h6 className="text-light">WINS</h6>
                    </div>
                    <div className="dashboard__cards">
                      <h4 className="text-light">
                        {dashboardStats?.total?.loseCount}
                      </h4>
                      <h6 className="text-light">LOSSES</h6>
                    </div>
                  </div>
                  <div className="d-flex justify-content-around">
                    <div className="dashboard__cards">
                      <h4 className="text-light">{winPercentage}%</h4>
                      <h6 className="text-light">WINRATE</h6>
                    </div>
                    <div className="dashboard__cards">
                      <h4 className="text-light">
                        {dashboardStats?.total?.betVolume} BET
                      </h4>
                      <h6 className="text-light">TOKEN SPENT</h6>
                    </div>
                  </div>
                  <div className="d-flex justify-content-around">
                    <div className="dashboard__cards">
                      <h4 className="text-light">
                        {dashboardStats?.total?.claimedCount}
                      </h4>
                      <h6 className="text-light">REWARD CLAIMED</h6>
                    </div>
                    <div className="dashboard__cards">
                      <h4 className="text-light">
                        {dashboardStats?.total?.claimedAmount} BET
                      </h4>
                      <h6 className="text-light"> REWARD AMOUNT</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </StyledDashboardWrapper>
      )}
      {profileToggle === 'Markets' && (
        <MyGameTabs
          toggleKey={toggleKey}
          totalGames={totalGames}
          games={games}
          gameStatus={gameStatus}
          gameName={gameName}
          betLoading={betLoading}
          walletAddress={walletAddress}
          unclaimedGames={unclaimedGames}
          unclaimedHosts={unclaimedHosts}
          setToggleKey={updateToggleKey}
          handleViewMore={handleViewMore}
          getGamesFromAPI={getGamesFromAPI}
          getBetsStatus={getBetsStatus}
        />
      )}
    </MyGameWrapper>
  )
}

export default MyGames
