import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import Profile from 'src/modules/profile/Profile'

function ProfilePage() {
  const { isAuthenticated, isInitialized } = useSelector(state => state.auth)

  const history = useRouter()

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      history.push('/')
    }
  }, [isAuthenticated, isInitialized])

  return (
    <>
      <Profile />
    </>
  )
}

export default ProfilePage
