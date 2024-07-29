import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Image from 'next/image'

const StyleTitle = styled.p`
  font-size: 16px;
  font-weight: 500px;
  text-align: center;
  height: 300px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding-top: 20px;
  color: ${props => props.theme.color} !important;
  i {
    font-size: 40px;
    margin-bottom: 30px;
  }
`

const Message = ({ text }) => (
  <StyleTitle>
    <Image src="/NotFound.png" height="100px" width="100px" />
    <h4 className="mt-3">{text}</h4>
  </StyleTitle>
)
Message.defaultProps = {
}
Message.propTypes = {
  text: PropTypes.string.isRequired,
}
export default Message
