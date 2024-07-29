import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import { Alert, Col, Row } from 'react-bootstrap'
import { uploadMarketImage } from 'src/api/user-market/user-market'
import Select from 'react-select'
import OpenCard from '../card/OpenCard'
import PrimaryButton from '../button/PrimaryButton'


const StyledSelect = styled(Select)`
  .filter__control {
    height: 45px;
    width: 100%;
    background: #2d096acf;
    border: 1px solid ${props => (props.error ? 'red' : props.theme.border)};
    border-radius: 5px;
    color: #fff !important;
    margin: 3px 0px;
    outline: none !important;
    &:active,
    &:hover,
    &:focus {
      background: #2d096a !important;
      box-shadow: none !important;
      border: 1px solid ${props => props.theme.border};
    }
  }

  .filter__placeholder {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    font-weight: 400;
    padding: 0px 5px;
  }
  .filter__single-value {
    color: #fff;
    font-size: 14px;
    padding: 0px 5px;
  }
  .filter__value-container {
    padding: 0px;
    outline: none !important;
    color: #fff !important;
  }
  .filter__menu {
    background: #2d096acf;
    color: #fff;
    border: 1px solid ${props => props.theme.border};
  }
  .css-26l3qy-menu {
    font-size: 14px;

    background: #2d096acf;
    color: #fff;
    border: 1px solid ${props => props.theme.border};
  }
  .filter__option {
    background-color: #2d096acf;
    color: rgba(255, 255, 255, 0.6) ;
    &:hover {
      color: #fff !important;
      background-color: rgba(127, 127,127, 0.4) !important;
      
    }
  }
  .filter__option--is-selected {
    background-color: #2d096acf;
    color: rgba(255, 255, 255, 0.6) ;
  }
  .error-text {
    border-color: #ed4337 !important;
    &:active,
    &:hover,
    &:focus {
      border-color: #ed4337 !important;
    }
  }
`

const StyledMarketForm = styled.form`
  color: #fff;
  input,
  select {
    height: 45px;
    width: 100%;
    background: transparent;
    border: 1px solid ${props => props.theme.border} !important;
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
    color: #fff !important;
    margin: 3px 0px;
    &:active,
    &:hover,
    &:focus {
      background: transparent !important;
      box-shadow: none !important;
      border: 1px solid ${props => props.theme.border};
    }
  }
  small {
    font-size: 14px;
  }
  .transparent__card {
    background: rgba(255, 255, 255, 0.5);
    padding: 5px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    height: 100px;
    width: 100px;
    position: relative;
  }
  .error {
    border-color: #ed4337 !important;
    &:active,
    &:hover,
    &:focus {
      border-color: #ed4337 !important;
    }
  }
  .error-text {
    font-size: 12px;
    color: #ed4337;
    margin-top: 5px;
    font-weight: 300;
  }
`

const MarketForm = ({ onSubmitForm, refetchFunction }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  })
  useEffect(() => {
    setValue(
      'homeTeamLogo',
      'https://predictiondex.fra1.digitaloceanspaces.com/homeTeamLogo.png'
    )
    setValue(
      'awayTeamLogo',
      'https://predictiondex.fra1.digitaloceanspaces.com/awayTeamLogo.png'
    )
    setValue('endTimestamp', new Date().toString())
  }, [])
  const [outcomes, setOutcomes] = useState(2)

  const onSubmit = data => {
    onSubmitForm(data, refetchFunction, outcomes)
  }
  const generateOutcomeForms = () => {
    const finalForms = []
    for (let i = 0; i < outcomes; i+=1) {
      finalForms.push(
        <div>
          <input
            type="text"
            className={`form-control ${errors[`option${i}`] && 'error'} mt-3`}
            placeholder={`Enter the Outcome ${i}`}
            {...register(`option${i}`, {
              required: `Outcome ${i} is required`
            })}
          />
          {errors[`option${i}`] && (
            <p className="error-text">{errors[`option${i}`].message}</p>
          )}
        </div>
      )
    }
    return finalForms
  }
  const uploadImages = async (e, key) => {
    const formData = new FormData()
    formData.append(
      'market',
      e.target.files[0],
      `${Math.floor(Math.random() * 100)}${e.target.files[0].name}`
    )
    const url = await uploadMarketImage(formData)
    setValue(key, url)
  }
  return (
    <Row>
      <Col md={7}>
        <StyledMarketForm onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div>
            <small>Enter a Market Title</small>
            <input
              type="text"
              className={`form-control ${errors.title && 'error'} mt-3`}
              placeholder="Enter the Market Title"
              {...register('title', {
                required: 'Market Title is required'
              })}
            />
            {errors.title && (
              <p className="error-text">{errors.title.message}</p>
            )}
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className='pt-3'>
                <small>Select a Market Type</small>

                <StyledSelect
                  error={errors.marketType}
                  classNamePrefix="filter"
                  onChange={(data) => {
                    setValue('marketType', data.value)
                  }}
                  options={[
                    { value: 'Crypto', label: 'Crypto' },
                    { value: 'Sports', label: 'Sports' },
                    { value: 'Politics', label: 'Politics' },
                    { value: 'Esports', label: 'Esports' },
                    { value: 'Science', label: 'Science' }
                  ]}
                  placeholder="Please Select a Market Type"
                  components={{
                    IndicatorSeparator: () => null
                  }}
                  isSearchable={false}
                />
                <input
                  {...register('marketType', {
                    required: 'Market Type must be selected'
                  })}
                  hidden
                />
                {errors.marketType && (
                  <p className="error-text">{errors.marketType.message}</p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="pt-3">
                <small>Select Market Ending Time</small>

                <input
                  type="datetime-local"
                  className={`form-control ${errors.endTimestamp && 'error'
                    } mt-3`}
                  placeholder="Enter the Market Ending Time"
                  {...register('endTimestamp', {
                    required: 'Market Ending Time is required'
                  })}
                />
                {errors.endTimestamp && (
                  <p className="error-text">{errors.endTimestamp.message}</p>
                )}
              </div>
            </div>
          </div>
          <div className="pt-3">
            <small>How many outcomes will be there?</small>
            <select
              className=" mt-3 form-control"
              onChange={e => setOutcomes(e.target.value)}
              value={outcomes}
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
          <div className="pt-3">
            <small>Fill the Outcomes</small>
            {generateOutcomeForms()}
          </div>

          <div className="py-3">
            <small>Manage Images</small>
            <div className="d-flex justify-content-between my-3">
              <div className="d-flex justify-content-center align-items-center pe-3">
                <div className="transparent__card">
                  <img
                    height="80px"
                    width="80px"
                    className="me-3"
                    alt="default_league"
                    src={watch('homeTeamLogo')}
                  />
                </div>

                <input
                  type="text"
                  className={`form-control ${errors.homeTeamLogo && 'error'
                    } mt-3`}
                  placeholder="First Image URL"
                  {...register('homeTeamLogo', {
                    required: 'Image URL is required'
                  })}
                  hidden
                />
                {errors.homeTeamLogo && (
                  <p className="error-text">{errors.homeTeamLogo.message}</p>
                )}
                <input
                  type="file"
                  className="w-100"
                  onChange={e => uploadImages(e, 'homeTeamLogo')}
                />
              </div>

              <div className="d-flex justify-content-center align-items-center">
                <div className="transparent__card">
                  <img
                    src={watch('awayTeamLogo')}
                    height="80px"
                    width="80px"
                    alt="default_league"
                  />
                </div>
                <input
                  type="text"
                  className={`form-control ${errors.awayTeamLogo && 'error'
                    } mt-3`}
                  placeholder="Second Image URL"
                  {...register('awayTeamLogo', {
                    required: 'Image URL is required'
                  })}
                  hidden
                />
                {errors.awayTeamLogo && (
                  <p className="error-text">{errors.awayTeamLogo.message}</p>
                )}
                <div className="mt-3">
                  <input
                    type="file"
                    className="w-100"
                    onChange={e => uploadImages(e, 'awayTeamLogo')}
                  />
                </div>
              </div>
            </div>
          </div>
          <PrimaryButton type="submit" className="mt-3">
            Create Market
          </PrimaryButton>
        </StyledMarketForm>
      </Col>
      <Col md={5}>
        <h4 className="text-light">Live Preview </h4>
        <OpenCard
          leagueName={watch('marketType')}
          marketName={watch('title')}
          leagueId={watch('marketType')}
          homeTeamImage={watch('homeTeamLogo')}
          awayTeamImage={watch('awayTeamLogo')}
          startingOn={watch('endTimestamp')}
          gameName="UserMarket"
          status="Open"
          disabled
        />
        <Alert className="p-4">
          It might take 24 hours for markets to get verfied by governers and
          published on the platform.
        </Alert>
      </Col>
    </Row>
  )
}

export default MarketForm
