import React from 'react'

export const NoSSRWrapper = ({
    children,
}) => {
    const [isMounted, setIsMounted] = React.useState(false)
    React.useEffect(() => {
        setIsMounted(true)
    }, [])
  return isMounted ? children : <div />
}
