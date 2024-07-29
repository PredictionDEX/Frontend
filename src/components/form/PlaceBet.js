import React from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import Select from 'react-select'
import PrimaryButton from '../button/PrimaryButton'

const StyledPlaceBet = styled.form`
  input {
    height: 45px;
    width: 100%;
    background: transparent;
    border: 1px solid ${props => props.theme.border} !important;
    padding: 10px;
    border-radius: 5px;
    font-size: 12px;
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
  .form-warning {
    font-size: 70%;
    color: grey !important;
    margin: 5px 0px;
  }
`
const StyledSelect = styled(Select)`
  .filter__control {
    height: 50px;
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
const PlaceBet = ({
  formParams,
  onSubmitForm,
  refetchFunction,
  buttonMessage = 'Bet Now',
  showDisclaimer = true,
  betOptions
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({ mode: 'onChange' })
  const onSubmit = data => {
    onSubmitForm(formParams, data, refetchFunction)
  }
  const generateBetOptions = () => {
    const finalOptions = []
    if (formParams.gameName === 'NBA') {
      betOptions.forEach((item, key) => {
        if (item) {
          if (key !== 2) {
            finalOptions.push({ value: key, label: item })
          }
        }
      })
    } else {
      betOptions.forEach((item, key) => {
        if (item) {
          finalOptions.push({ value: key, label: item })
        }
      })
    }
    return finalOptions
  }

  const options = generateBetOptions()

  const handleSelectInput = form => {
    setValue('team', form.value)
  }
  return (
    <StyledPlaceBet onSubmit={handleSubmit(onSubmit)}>
      <div>
        <StyledSelect
          error={errors.team}
          classNamePrefix="filter"
          onChange={handleSelectInput}
          options={options}
          placeholder="Please Select an Outcome"
          components={{
            IndicatorSeparator: () => null
          }}
          isSearchable={false}
        />
        <input
          {...register('team', { required: 'Outcome must be selected' })}
          hidden
        />
        {errors.team && <p className="error-text">{errors.team.message}</p>}
      </div>
      <div>
        <input
          type="number"
          className={`form-control ${errors.amount && 'error'} mt-3`}
          placeholder="Enter Amount in BET"
          {...register('amount', {
            required: 'Amount entered is invalid',
            min: { value: 50, message: 'BET must be greater than 50' }
          })}
        />
        {errors.amount && <p className="error-text">{errors.amount.message}</p>}
      </div>
      {showDisclaimer && (
        <div className="text-light form-warning">
          By clicking Bet Now, you acknowledge your legal jurisdiction and agree
          all “Terms and Conditions” governed by PredictionDEX dApp.
        </div>
      )}
      <PrimaryButton type="submit" className="mt-3">
        {buttonMessage}
      </PrimaryButton>
    </StyledPlaceBet>
  )
}

export default PlaceBet
