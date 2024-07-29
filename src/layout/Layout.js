import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import PropTypes from 'prop-types'
import Topbar from 'src/components/navbar/Topbar'
import SSRProvider from 'react-bootstrap/SSRProvider'
import { Container } from 'react-bootstrap'
import { NoSSRWrapper } from './NoSSRWrapper'

const StyledContainer = styled.section`
  min-height: calc(100vh - 110px);
  width: 95%;
  margin: auto;
  .body-wrapper {
    @media screen and (max-width: 690px) {
      margin-top: 100px;
    }
  }
`
const FooterCard = styled.div`
  min-height: 70px;
  margin-top: 40px;
  background: rgba(0, 0, 0, 0.3) !important;
  color: #fff;
  padding: 10px;
  display: flex;
  min-height: 70px;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  a {
    color: #fff !important;
    margin: 0px 10px;
    font-size: 14px;
  }
`

const Layout = ({ children }) => {
  const globalTheme = {
    background: 'rgba(255, 255, 255, 0.1)',
    reverse: '#ffffff',
    color: '#ffffff',
    border: 'rgba(255,255,255,0.6)',
    shadow: 'rgba(255,255,255,0.03)',
    pageBg: 'rgb(22, 22, 35)'
  }

  return (
    <ThemeProvider theme={globalTheme}>
      <SSRProvider>
        <StyledContainer>
          <NoSSRWrapper>
            <Topbar />
          </NoSSRWrapper>
          <div className="body-wrapper">{children}</div>
        </StyledContainer>
        <FooterCard className="p-0 px-md-5">
          <Container fluid>
            <div className="row">
              <div className="col-md-6">
                <div>
                  @{new Date().getFullYear()} PredictionDEX.com. All Right
                  Reserved
                </div>
              </div>
              <div className="col-md-6 mt-3 mt-md-0">
                <div className="d-flex justify-content-start justify-content-md-end">
                  <div>
                    <a
                      href="https://docs.predictiondex.com/resources/whitepaper"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Whitepaper
                    </a>
                    <a
                      href="https://docs.predictiondex.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Documentation
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </FooterCard>
      </SSRProvider>
    </ThemeProvider>
  )
}
Layout.propTypes = {
  children: PropTypes.node.isRequired
}
export default Layout
