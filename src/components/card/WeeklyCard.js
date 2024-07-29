import React from 'react'
import styled from 'styled-components'

const StyledWeeklyCard = styled.div`
  border-radius: 10px;
  margin-top: 110px;
  background: transparent;
  border: 0px;
  color: #fff;
  @media only screen and (max-width: 600px) {
    margin-top: 40px;
  }
  .stats__card {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    text-align: center;
    border-radius: 10px;
    width: 100%;
    height: 90px;
    h6 {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 300;
      margin-top: 5px;
      letter-spacing: 0.5;
    }
    h4 {
      font-size: 20px;
      font-weight: 600;
      margin-top: 10px;
    }
  }
`

const WeeklyCard = ({children}) => <StyledWeeklyCard>{children}</StyledWeeklyCard>

export default WeeklyCard
