import React from 'react'
import { Card } from 'react-bootstrap'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const StyledOpenCard = styled(Card)`
  border-radius: 10px;
  background: ${props => (props.$blue ? '#4717F6' : '#813772')};
  color: white;
  margin: 20px 0px;
  border: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  h1 {
    font-size: 180%;
    font-weight: 400;
  }
  h6 {
    font-size: 100%;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
    text-transform: uppercase;
    font-weight: 300;
  }
`

const StatsCard = props => {
  const { $statsValue, $statsTitle } = props
  return (
    <StyledOpenCard {...props}>
      <h6>{$statsTitle}</h6>
      <h1>{$statsValue}</h1>
    </StyledOpenCard>
  )
}
StatsCard.propTypes = {
  $statsValue: PropTypes.string.isRequired,
  $statsTitle: PropTypes.string.isRequired
}

export default StatsCard
