import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledToast = styled.div`
  h5 {
    font-size: 15px;
    font-weight: 500 !important;
    color: #fff;
  }
  a {
    color: #fff !important;
  }
`

const Toast = ({ txName, txHash, gameTitle }) => (
  <StyledToast>
    <div className="row align-items-center">
      <div className="px-3 mt-3">
        <h5>{txName}</h5>
        {gameTitle && <h6>{gameTitle}</h6>}
        <h6>
          View Transaction{' '}
          <a
            href={`https://viewblock.io/zilliqa/tx/0x${txHash}?network=${process.env.NEXT_PUBLIC_NETWORK}`}
            target="_blank"
            rel="noreferrer"
          >
            <u>here.</u>
          </a>{' '}
        </h6>
      </div>
    </div>
  </StyledToast>
)
Toast.defaultProps = {
  gameTitle: ''
}
Toast.propTypes = {
  txName: PropTypes.string.isRequired,
  txHash: PropTypes.string.isRequired,
  gameTitle: PropTypes.string
}
export default Toast
