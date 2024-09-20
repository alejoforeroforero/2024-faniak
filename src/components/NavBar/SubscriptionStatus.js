import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  Typography,
} from '@material-ui/core'
import { bytesToSize } from '../../utils/fileUtils'
import { subscriptionTiers } from '../../dictionary/user'
import { DispatchContext, StateContext } from '../../store'
import ProgressBar from '../DialogSubscriptions/ProgressBar'
import { showSubscriptionLimits } from '../DialogSubscriptions'

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 0,
    '& .MuiButton-label': {
      alignItems: "normal",
      flexDirection: "column",
    },
  },
}))

const limitPercentage = (number) => Math.min(Math.max(number, 0), 100)

export default function SubscriptionStatus() {
  const { user, storageQuota } = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const classes = useStyles()

  const valid = user.subscription_payed || user.subscription_tier === subscriptionTiers.ROOKIE

  const sm_value = user.current_smart_folders
  const sm_total = user.max_smart_folders
  const sm_progress = limitPercentage(Math.round((sm_value / sm_total) * 100))

  const gb_value = storageQuota.usage ?? 0
  const gb_total = storageQuota.limit ?? -1
  const gb_progress = limitPercentage(Math.round((gb_value / gb_total) * 100))

  const openSubscriptionDialog = () => {
    showSubscriptionLimits(dispatch)
  }

  return (
    <Button className={classes.root} onClick={openSubscriptionDialog}>
      <Typography
        variant="caption"
        component="div"
        align='center'
        color="textSecondary">
        {sm_value} SM
      </Typography>
      <ProgressBar
        error={!valid || sm_progress === 100 || gb_progress === 100}
        value={Math.max(sm_progress, gb_progress)}
      />
      <Typography
        variant="caption"
        component="div"
        align='center'
        color="textSecondary">
        {bytesToSize(gb_value)}
      </Typography>
    </Button >
  )
}