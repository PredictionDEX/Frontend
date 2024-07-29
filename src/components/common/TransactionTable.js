import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Table } from 'react-bootstrap'
import Moment from 'react-moment'

const StyledTable = styled.div`
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  background: white;
  padding: 10px;
  border-radius: 20px;
  table {
    padding-left: 20px;
    font-size: 110%;
    tbody a {
      color: #000080 !important;
    }
  }
`

function TransactionTable({transactions}) {
  const transitions = {
    bet: 'Predict',
    gameStarted: 'Start Game',
    gameAborted: 'Abort Game',
    flashGameResults: 'Flash Result',
    verifyGameResults: 'Verify Result',
    redeem: 'Claim Reward',
    withdrawFromAborted: 'Refund Aborted',

  }
  const handleTransitionName = name => {
    if(name in transitions){
        return transitions[name];
    }
  
    const result = typeof name === 'string' ? name.replace(/([A-Z])/g, " $1") : 'TransferFund';
const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
return finalResult;
    // return 'Admin Transaction'
  }
  const eventName = {
    transferFromSuccess: 'TransferFromSuccess',
    transferSuccess: 'TransferSuccess'
  }
  return (
    <StyledTable>
      <Table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Hash</th>
            <th>Amount</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.hash}>
              <td
                style={{
                  width: '20%',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  maxWidth: 1
                }}
              >
                {handleTransitionName(JSON.parse(tx.data)._tag)}
              </td>
              <td style={{ width: '20%' }}>
                <a
                  target="_blank"
                  href={`https://viewblock.io/zilliqa/tx/${tx.hash}?network=${process.env.NEXT_PUBLIC_NETWORK}`}
                  rel="noreferrer"
                >
                  {tx.hash.slice(0, 4)}...
                  {tx.hash.slice(tx.hash.length - 4, tx.hash.length)}
                </a>
              </td>
              <td className="text-center" style={{ width: '10%' }}>
                {tx.events.some(
                  txn =>
                    txn.name === eventName.transferFromSuccess ||
                    txn.name === eventName.transferFromSuccess
                )
                  ? `${
                      tx.events.find(
                        txn =>
                          txn.name === eventName.transferFromSuccess ||
                          txn.name === eventName.transferFromSuccess
                      )?.params?.amount /
                        10 ** 9 || 0.1
                    } REDC`
                  : `${Math.floor(
                      tx.events.find(
                        txn =>
                          !(
                            txn.name === eventName.transferFromSuccess ||
                            txn.name === eventName.transferFromSuccess
                          )
                      )?.params?.amount /
                        10 ** 12 || 0
                    )} ZIL`}
              </td>
              <td
                style={{
                  width: '20%',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  maxWidth: 1
                }}
              >
                <Moment fromNow>{tx.timestamp}</Moment>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </StyledTable>
  )
}

TransactionTable.propTypes = {
  transactions: PropTypes.array.isRequired
}

export default TransactionTable
