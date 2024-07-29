import React from 'react'
import { Card } from 'react-bootstrap'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledCard = styled(Card)`
  font-size: 130%;
  padding: 10px;
  border: 0px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.border};
  box-shadow: ${props => props.theme.shadow} 0px 4px 12px;
  background: ${props => props.theme.background};
  .card-body {
    border-radius: 10px;
  }
  .list-group {
    border: 0px;
  }
  .list-group-item {
    padding: 15px;
    cursor: pointer;
    opacity: 0.7;
    border: 0px;
    background: transparent;
    color: ${props => props.theme.reverse};
    outline: 0px !important;
  }
  .active {
    background: #080b47;
    border-radius: 10px;
    color: white;
    opacity: 1;
  }
`

const SidebarCard = ({ children }) => <StyledCard>{children}</StyledCard>
SidebarCard.propTypes = {
  children: PropTypes.node.isRequired
}

export default SidebarCard
