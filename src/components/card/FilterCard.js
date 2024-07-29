import React from 'react'
import { Card } from 'react-bootstrap'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const StyledFilterCard = styled(Card)`
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 5px 0px;
  border: transparent;
  width: 100%;
  min-height: 60px;
  display: flex;
  justify-content: center;
  background: transparent;
  color: ${props => props.theme.reverse} !important;
  h6 {
    font-size: 130%;
    color: ${props => props.theme.reverse} !important;
  }
  .search-icon {
    position: absolute;
    top: 38%;
    left: 1%;
    font-size: 20px;
  }
  input {
    position: relative;
    height: 55px;
    width: 100%;
    background: transparent;
    border: 1px solid ${props => props.theme.border} !important;
    border-radius: 5px;
    font-size: 14px;
    padding-left: 50px !important;
    color: #fff !important;
    outline: 0px;
    &::active,
    &::hover,
    &::focus {
      background: transparent !important;
      box-shadow: none !important;
      outline: 0px;
      border: 1px solid ${props => props.theme.border} !important;
    }
  }
`

const FilterCard = props => {
  const { children } = props
  return (
    <StyledFilterCard {...props}>
      <i className="fa fa-search search-icon" />
      {children}
    </StyledFilterCard>
  )
}
FilterCard.propTypes = {
  children: PropTypes.node.isRequired
}

export default FilterCard
