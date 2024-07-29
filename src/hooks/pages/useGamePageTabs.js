import { useState } from 'react'

export const useGamePageTabs = (
  gameStatus,
  games,
  setToggleKey,
  handleSearch
) => {
  const commonMessages = (
    <div className="pt-3">
      {gameStatus.loading && <h6 className="text-light">Loading</h6>}
      {!gameStatus.loading && games.length === 0 && (
        <h6 className="text-light">No Markets Found</h6>
      )}
    </div>
  )
  const [show, setShow] = useState(false)
  const handleOpen = () => setShow(true)
  const handleClose = () => setShow(false)



  const handleToggleKey = key => {
    setToggleKey(key)
    handleSearch('')
  }
  return {
    show,
    commonMessages,
    handleOpen,
    handleClose,
    handleToggleKey
  }
}
