import React from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import PrimaryButton from '../button/PrimaryButton'

const StyledPlaceBet = styled.form`
  input,
  select {
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
  textarea {
    background: transparent;
    color: #fff !important;
    height: 300px;
    font-size: 13px;
    border: 1px solid ${props => props.theme.border} !important;
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

const DisputeGame = ({
  formParams,
  onSubmitForm,
  buttonMessage = 'Dispute Game'
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: 'onChange' })
  const onSubmit = data => {
    onSubmitForm(formParams, data)
  }
  return (
    <StyledPlaceBet onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          type="text"
          className={`form-control ${errors.correctScore && 'error'} mt-3`}
          placeholder="Enter the correct outcome"
          {...register('correctScore', {
            required: 'Correct Score  is invalid'
          })}
        />
        {errors.correctScore && (
          <p className="error-text">{errors.correctScore.message}</p>
        )}
      </div>
      <div>
        <textarea
          className={`form-control ${errors.description && 'error'} mt-3`}
          placeholder="Please provide more details"
          rows={10}
          {...register('description')}
        />
        {errors.description && (
          <p className="error-text">{errors.description.message}</p>
        )}
      </div>
      <p className="text-light py-3" style={{ fontSize: 14 }}>
        <i className="fa fa-warning me-2" />
        Please note that you have to pay 100 BET to dispute the game.
      </p>
      <PrimaryButton type="submit" className="mt-3">
        {buttonMessage}
      </PrimaryButton>
    </StyledPlaceBet>
  )
}

export default DisputeGame
