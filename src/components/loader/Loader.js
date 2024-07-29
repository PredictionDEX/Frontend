import React from 'react'
import styled from 'styled-components'

const StyledLoader = styled.div`
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
`
const Loader = () => (
    <StyledLoader>
      <h5 className="pt-5">
        Please wait, our bots are loading the markets for you.
      </h5>
    </StyledLoader>
  )

export default Loader
