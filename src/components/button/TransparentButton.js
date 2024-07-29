import React from 'react'
import { Button } from 'react-bootstrap'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  background: transparent;
  border: 1px solid rgba(105,95,220,1);
  font-size: ${props => props.font || '110%'};
  height: ${props => props.height || '35px'};
  width: ${props => props.width || '120px'};
  font-weight: 500;
  box-shadow: 0px !important;
  color: ${props => props.theme.reverse} !important;
  border-radius: 10px;
  outline: none !important;
  margin: 0px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:focus,
  &:hover,
  &:active,
  &:disabled {
    background: transparent !important;
    color: ${props => props.theme.reverse} !important;
    outline: 0px !important;
    border: 1px solid #708090;
  }
`
const TransparentButton = props => <StyledButton {...props} />

export default TransparentButton
