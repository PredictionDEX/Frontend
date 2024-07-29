import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

const CustomLink = ({ children, to }) => {
  if (
    ['football', 'cricket', 'basketball'].some(item =>
      to.toLowerCase().includes(item)
    )
  ) {
    return <a href={to}>{children}</a>
  }

  return (
    <Link legacyBehavior href={to}>
      <a href={to}>{children}</a>
    </Link>
  )
}

CustomLink.propTypes = {
  children: PropTypes.any.isRequired,
  to: PropTypes.string.isRequired
}
export default CustomLink
