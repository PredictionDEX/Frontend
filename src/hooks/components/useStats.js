import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStats } from 'src/api/stats/stats'
import { setStats } from 'src/store/action/stats/stats'

export const useStats = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { stats } = useSelector(state => ({
    stats: state.stats.data
  }))
  const getStatsData = async () => {
    setLoading(true)
    getStats()
      .then(data => {
        dispatch(setStats(data))
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
      })
  }

  useEffect(() => {
    getStatsData()
  }, [])
  return { stats, loading, error }
}
