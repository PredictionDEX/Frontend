import router from 'next/router'
import React from 'react'
import PrimaryButton from 'src/components/button/PrimaryButton'
import Meta from 'src/components/meta/Meta'
import styled from 'styled-components'

const StyledErrorPage = styled.div`
  padding-top: 200px;
  color: #fff;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  h4 {
    font-size: 40px;
  }
  p {
    font-size: 24px;
    font-weight: 300;
    margin-top: 20px;
    color: rgba(255, 255, 255, 0.5);
  }
`
const ErrorPage = () => (
    <>
      <Meta
        title="Page Not Found"
        description="PredictionDEX is the Peer to Peer Prediction Platform, powered by RedChillies Labs"
        image="/Homepage.png"
      />
      <StyledErrorPage>
        <div className="error-content">
          <div className="container">
            <h4>Oops! This page Could Not Be Found!</h4>
            <p>
              Sorry bit the page you are looking for does not exist, have been
              removed or name changed.
            </p>
            <PrimaryButton
              width="300px"
              className="mt-5"
              onClick={() => router.back()}
            >
              Go Back
            </PrimaryButton>
          </div>
        </div>
      </StyledErrorPage>
    </>
  )

export default ErrorPage
