import React from 'react'
import { Button } from 'react-bootstrap'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  background: white;
  color: black;
  border-radius: 20px;
  background-size: 100% 100%;
  border: transparent;
  font-size: ${props => props.font || '100%'};
  height: ${props => props.height || '45px'};
  width: ${props => props.width || '120px'};
  font-weight: 500;
  font-size: 14px;
  box-shadow: 0px;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover,
  &:focus,
  &:active {
    outline: 0px !important;
    border: 0px !important;
    box-shadow: none !important;
    background: rgba(105,95,220,1);
    color: white;
  }
  &:visited {
    color: white;
  }
  &:disabled {
    background: #708090 !important;
    cursor: not-allowed !important;
  }
  margin: 0px;
`
const PrimaryButton = props => <StyledButton {...props} />

export default PrimaryButton
