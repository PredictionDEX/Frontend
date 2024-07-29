import React from 'react'
import { Button } from 'react-bootstrap'
import styled from 'styled-components'

const StyledOutlinedButton = styled(Button)`
  background-color: transparent !important;
  border-color: ${props => props.theme.border};
  color: ${props => props.theme.reverse};
  font-size: 110%;
  height: 35px;
  width: ${props => props.width || '150px'};
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0px;
  border-radius: 10px;
  &:disabled {
    border: 1px solid #cacaca;
    color: ${props => props.theme.reverse} !important;
  }

  margin: 0px;
  &:hover,
  &:focus {
    color: ${props => props.theme.reverse}; !important;
     border-color: ${props => props.theme.border};
  }
`
const OutlinedButton = props => <StyledOutlinedButton {...props} />

export default OutlinedButton
