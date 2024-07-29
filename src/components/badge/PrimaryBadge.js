import React from 'react'
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const StyledBadge = styled(Badge)`
  background: transparent !important;
  border: 1px solid ${props => props.theme.border};
  justify-content: center;
  color: black;
  border-radius: 10px;
  height: 30px;
  opacity: ${props => (props.$disabled ? '0.3' : '1')};
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  p {
    font-size: 12px;
  }
`

const PrimaryBadge = props => {
  // eslint-disable-next-line react/prop-types
  const { tooltipContent, children, disabled = false, ...rest } = props
  return tooltipContent ? (
    <OverlayTrigger
      key="bottom"
      placement="bottom"
      overlay={<Tooltip id="tooltip-bottom">{tooltipContent}</Tooltip>}
    >
      <StyledBadge $disabled={disabled} {...rest}>
        {children}
      </StyledBadge>
    </OverlayTrigger>
  ) : (
    <StyledBadge $disabled={disabled}>{children}</StyledBadge>
  )
}

PrimaryBadge.defaultProps = {
  tooltipContent: '',
  bets: 0
}
PrimaryBadge.propTypes = {
  tooltipContent: PropTypes.any,
  children: PropTypes.node.isRequired,
  bets: PropTypes.any
}
export default PrimaryBadge
