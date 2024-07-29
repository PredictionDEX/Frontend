import { useState } from 'react'

export const useHelpCenter = () => {
  const helpNames = {
    DISCLAIMER: 'Disclaimer',
    RULES: 'Rules',
    TOC: 'Terms and Conditions',
    GEOLOCATION: 'Excluded Jurisdictions',
    CHESS:'Chess Rules',
    LUDO:'Ludo Dice'

  }
  const [activeHelp, setActiveHelp] = useState(helpNames.DISCLAIMER)
  const handleHelpChange = name => {
    setActiveHelp(name)
  }
  return { helpNames, activeHelp, handleHelpChange }
}
