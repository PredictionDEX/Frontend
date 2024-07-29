import { useRouter } from 'next/dist/client/router'
import React from 'react'
import { Row } from 'react-bootstrap'
import styled from 'styled-components'

const StyledHeader = styled(Row)`
  div {
    height: 45px;
    width: 45px;
    background: ${props => props.theme.background};
    color: #fff;
    display: flex;
    align-items: center;
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

    justify-content: center;
  }
`
const Header = () => {
  const history = useRouter()
  return (
    <StyledHeader
      className="mb-3"
      onClick={() => {
        if (
          history.pathname.includes('[game_id]') &&
          !history.pathname.includes('[league_name]')
        ) {
          history.replace(history.pathname.replace('/[game_id]', ''))
        } else history.back()
      }}
    >
      <div>
        <i className="fas fa-arrow-left " />
      </div>
    </StyledHeader>
  )
}

export default Header
