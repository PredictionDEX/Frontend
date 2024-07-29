import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import styled from 'styled-components'

const NavLinkStyled = styled(Link)`
  color: ${props => (props.color ? props.color : props.theme.color)} !important;
  font-weight: 500 !important;
  font-size: 130%;
  margin: 0px 15px !important;
  text-decoration: none !important;
  border-bottom: ${props =>
    props.$active ? '2px solid rgba(105,95,220,1)' : '2px solid transparent'};
  padding: 10px 12px;
  @media only screen and (max-width: 992px) {
    margin: 10px 0px 0px 0px !important;
    border: 0px;
  }
  position: relative;
  ${props =>
    props.$isNew &&
    `
  &:after {
    content: 'New';
    color: #fff;
    position: absolute;
    top: 0px;
    right: -14px;
      @media only screen and (max-width: 992px) {
    display:none;
  }
    background: #592cd2;
    height: 15px;
    font-size: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
  }`}
`

const NavLink = ({ children, to, active = false, isNew = false, color }) => (
      <NavLinkStyled href={to} $active={active} $isNew={isNew} color={color}>
        {children}
      </NavLinkStyled>
  )
NavLink.propTypes = {
  children: PropTypes.any.isRequired,
  to: PropTypes.string.isRequired
}
export default NavLink
