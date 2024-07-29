import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const StyleTitle = styled.h1`
  font-size: 20px;
  font-weight: 500px;
  margin-bottom: 20px;
  color: ${props => props.theme.color} !important;
  span {
    font-size: 12px;
    padding-left: 10px;
  }
`

const Title = ({ text, subText }) => (
  <StyleTitle>
    {text}
    {subText && <span>{subText}</span>}
  </StyleTitle>
)
Title.defaultProps = {
  subText: ''
}

Title.propTypes = {
  text: PropTypes.string.isRequired,
  subText: PropTypes.string
}
export default Title
