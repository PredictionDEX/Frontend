import { Zilliqa } from '@zilliqa-js/zilliqa'
import { useSelector } from 'react-redux'

export const useZilliqa = () => {
  const { network } = useSelector(state => ({
    network: state.auth.network
  }))
  const zilliqa = new Zilliqa(
    network === 'testnet'
      ? 'https://dev-api.zilliqa.com'
      : 'https://api.zilliqa.com'
  )
  const getStateZilliqa = async contractAddr => {
    const contract = zilliqa.contracts.at(contractAddr)
    return contract.getState()
  }

  const getSubStateZilliqa = async (contractAddr, subState) => {
    const contract = zilliqa.contracts.at(contractAddr)
    return contract.getSubState(subState)
  }

  const getCurrentBlock = async () => {
    const { result } = await zilliqa.blockchain.getLatestTxBlock()
    return result
  }
  return { getStateZilliqa, getCurrentBlock, getSubStateZilliqa }
}
