import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import styled from 'styled-components'
import CustomLink from 'src/components/link/Link'
import PrimaryButton from 'src/components/button/PrimaryButton'
import { useNavbar } from 'src/hooks/components/useNavbar'
import Image from 'next/image'
import NavLink from 'src/components/link/NavLink'
import { moneyConversion } from 'src/utils/utils'

const StyledNavbar = styled(Navbar)`
  color: black;
  min-height: 90px;
  background: #2d096acf;

  .navbar-toggler {
    background-image: url('/MenuIcon.png') !important;
    height: 50px;
    width: 50px;
    border: 0px;
    outline: 0px;
    background-size: 100% 100%;
    box-shadow: none;
    &:focus,
    &:hover,
    &:active {
      border: 0px;
      outline: 0px;
      box-shadow: none;
    }
  }
`

const NavLinkDropdown = styled(NavDropdown)`
  font-weight: 500;
  margin-top: 4px;
  font-size: 130%;
  .dropdown-menu {
    @media only screen and (max-width: 600px) {
      border: 0px;
      font-size: 100%;
    }
  }
  #basic-nav-dropdown {
    outline: none !important;
    box-shadow: none !important;
    @media only screen and (max-width: 992px) {
      margin-top: 10px;
    }
  }

  a {
    color: white !important;
  }
  .dropdown-menu {
    padding: 10px;
    background: #2d096acf !important;
    width: 160px;
  }
  .dropdown-item {
    color: white !important;
    background: transparent !important;
    font-size: 130%;
    width: 100%;
    font-weight: 500;
    padding: 10px;
    @media only screen and (max-width: 992px) {
      border: 0px;
      font-size: 100%;
    }
    &:hover {
      color: white !important;
      background: transparent !important;
    }
  }

  text-decoration: none;
`
const NavbarBrand = styled(Navbar.Brand)`
  font-size: 160%;
  font-weight: 500;
  display: flex;
  align-items: center;
  color: ${props => props.theme.color} !important;
  h4 {
    span {
      height: 30px;
      width: 30px;
      background: #592cd2;
      padding: 0px 3px;
      margin-left: 5px;
      font-size: 12px;
      font-weight: 600;
    }
  }
`
const StyledBalance = styled.div`
  height: 30px;
  width: 120px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  @media only screen and (max-width: 992px) {
    margin-top: 10px;
    margin-left: 20px;
  }
`

const Topbar = () => {
  const {
    connecting,
    isAuthenticated,
    walletAddress,
    progress,
    expanded,
    router,
    userBalance,
    balanceLoading,
    setShowPrediction,
    showPrediction,
    setExpanded,
    handleConnect,
    trimWallet,
    handleDisconnect
  } = useNavbar()

  return (
    <StyledNavbar
      expand="lg"
      className="fixed-top"
      collapseOnSelect
      expanded={expanded}
    >
      <Container fluid className="mx-5">
        <CustomLink to="/" style={{ textDecoration: 'none' }}>
          <NavbarBrand>
            <Image src="/PredictionDEX.png" height={40} width={40} alt="Logo" />
            <h4 className="ms-3">PredictionDEX</h4>
          </NavbarBrand>
        </CustomLink>
        <Navbar.Toggle
          onClick={() => setExpanded(expanded ? false : 'expanded')}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-lg-flex align-items-lg-center">
            <NavLink
              to="/"
              onClick={() => setExpanded(false)}
              active={router.pathname === '/'}
            >
              Home
            </NavLink>
            <NavLink
              to="/featured-markets"
              isNew
              onClick={() => setExpanded(false)}
              active={router.pathname === '/featured-markets'}
            >
              Featured Markets
            </NavLink>
            <NavLinkDropdown
              title="Prediction Markets"
              show={showPrediction}
              onClick={() => setShowPrediction(true)}
              onMouseLeave={() => setShowPrediction(false)}
              onMouseOver={() => setShowPrediction(true)}
              className="mt-0 ms-3 ms-lg-0"
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item onClick={() => router.push('/football')}>
                <img
                  src="/FootballIcon.png"
                  height="20px"
                  width="20px"
                  alt="FI"
                  className="me-2"
                />
                Football
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => router.push('/nba')}>
                <img
                  src="/NBAIcon.png"
                  height="20px"
                  width="20px"
                  alt="NBAI"
                  className="me-2"
                />
                Basketball
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => router.push('/nfl')}>
                <img
                  src="/NFLIcon.png"
                  height="20px"
                  width="20px"
                  alt="NFLI"
                  className="me-2"
                />
                NFL
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => router.push('/nhl')}>
                <img
                  src="/NHLIcon.png"
                  height="20px"
                  width="20px"
                  alt="NHLI"
                  className="me-2"
                />
                NHL
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => router.push('/user-market')}>
                <img
                  src="/UserMarketsIcon.png"
                  height="20px"
                  width="20px"
                  alt="UMI"
                  className="me-2"
                />
                User Market
              </NavDropdown.Item>
            </NavLinkDropdown>

            <NavLink
              to="/leaderboard"
              onClick={() => setExpanded(false)}
              active={router.pathname === '/leaderboard'}
            >
              Leaderboard
            </NavLink>
            <NavLink
              to="/staking"
              onClick={() => setExpanded(false)}
              active={router.pathname === '/staking'}
            >
              Staking Portal
            </NavLink>

            {!connecting && isAuthenticated && (
              <StyledBalance>
                <img
                  src="/PredictionDEX.png"
                  height={20}
                  width={20}
                  className="me-3"
                  alt='PredictionDEX'
                />
                {balanceLoading && <i className="fa fa-spinner fa-spin" />}
                {!balanceLoading && userBalance <= 0 && (
                  <a
                    href="https://zilswap.io/swap?tokenIn=zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz&tokenOut=zil1wcjrsvf7fp7s8zeyvtzvzk35x447chny02zxjw"
                    target="_blank"
                    style={{
                      fontSize: 12,
                      textDecoration: 'underline !important',
                      cursor: 'pointer'
                    }} rel="noreferrer"
                  >
                    Buy Now
                  </a>
                )}
                {!balanceLoading &&
                  userBalance > 0 &&
                  moneyConversion(userBalance / 10 ** 9)}
              </StyledBalance>
            )}
            {connecting && <i className="fa fa-spin fa-spinner" />}

            {!connecting && isAuthenticated && (
              <NavLinkDropdown
                className="ms-4"
                title={
                  <span>
                    <img
                      src="https://zilchill.ams3.cdn.digitaloceanspaces.com/zilpay.svg"
                      alt="zil"
                      className="me-2"
                      height="25px"
                      width="25px"
                    />
                    {trimWallet(walletAddress?.bech32)}
                  </span>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  onClick={() => {
                    setExpanded(false)
                    router.push('/profile')
                  }}
                >
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleDisconnect()}>
                  Logout
                </NavDropdown.Item>
              </NavLinkDropdown>
            )}
            {!connecting && !isAuthenticated && (
              <PrimaryButton
                width="150px"
                className="mt-2 ms-0 ms-lg-4 "
                disabled={progress}
                onClick={() => handleConnect()}
              >
                {progress && <i className="fa fa-spin fa-spinner pe-2" />}
                {progress ? 'Connecting' : ' Connect Wallet'}
              </PrimaryButton>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  )
}

export default Topbar
