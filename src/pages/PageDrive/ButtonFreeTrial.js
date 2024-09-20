import { useContext, useMemo } from 'react';
import { StateContext } from '../../store'
import { Box, Link } from '@material-ui/core'
import { subscriptionTiers } from '../../dictionary/user'

export default function ButtonFreeTrial() {
  const state = useContext(StateContext)

  const message = useMemo(() => {
    if (state.user.free_trial_ends_at) {
      const endDate = new Date(state.user.free_trial_ends_at)
      const nowDate = new Date()
      const daysLeft = Math.ceil(Math.abs(endDate - nowDate) / (1000 * 60 * 60 * 24))
      return `Your free trial ends in ${daysLeft} days.`
    }
    return "Want more out of Faniak?"
  }, [state.user])

  if (state.user.subscription_tier !== subscriptionTiers.ROOKIE) return null

  return (
    <Box textAlign="right">
      <Box opacity={0.5}>
        {message}
      </Box>
      <Link href="/pricing">
        Upgrade now
      </Link>
    </Box>
  )
}