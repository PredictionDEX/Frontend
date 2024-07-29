import moment from 'moment'
import router from 'next/router'
import React from 'react'
import { Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { addNewUserMarket } from 'src/api/user-market/user-market'
import MarketForm from 'src/components/form/MarketForm'
import Header from 'src/components/header/Header'
import Meta from 'src/components/meta/Meta'
import {
  errorNotification,
  successNotification
} from 'src/components/notification/notification'
import { useZilpay } from 'src/hooks/mixins/useZilpay'
import styled from 'styled-components'

const StyledSection = styled.section`
  margin-top: 120px;
`
const CreateMarket = () => {
  const { walletAddress } = useSelector(state => ({
    walletAddress: state.auth.walletAddress,
  }))
  const {signMessage} = useZilpay()
  const onSaveUserMarket = async (formData, refetchFunction, outcomes) => {
    const message = `I am signing this message to create a market on PredictionDEX. Market Title: ${formData.title}\nMarket Type: ${formData.marketType}\nOption A: ${formData.option0 ?? ''}\nOption B: ${formData.option1 ?? ''}\nOption C: ${formData.option2 ?? ""}\nEnd Timestamp: ${formData.endTimestamp}`
    const signedData = await signMessage(message)

    const formSubmitData = {
      title: formData.title,
      marketType: formData.marketType,
      marketTypeImageUrl: `https://predictiondex.fra1.digitaloceanspaces.com/${formData.marketType}.png`,
      homeTeamLogo: formData.homeTeamLogo,
      awayTeamLogo: formData.awayTeamLogo,
      optionA: formData.option0,
      optionB: formData.option1,
      optionC: formData.option2,
      optionCount: outcomes,
      endTimestamp: moment(formData.endTimestamp).utc().toString(),
      ...signedData,
      message,
      wallet: walletAddress.base16,
    }

    addNewUserMarket(formSubmitData)
      .then(() => {
        successNotification('Market has been successfully created')
        router.push('/user-market')
      })
      .catch(() => {
        errorNotification('Market cannot be created')
      })
  }
  return (
    <StyledSection>
      <Container>
        <Header />

        <Meta title="Create New Market | PredictionDEX" />
        <MarketForm
          onSubmitForm={onSaveUserMarket}
          refetchFunction={() => router.back()}
        />
      </Container>
    </StyledSection>
  )
}

export default CreateMarket
