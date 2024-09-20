import { useContext } from 'react';
import { StateContext } from '../../store'
import { makeStyles } from '@material-ui/core/styles'
import SettingsIcon from '@material-ui/icons/Settings'
import {
  Typography,
  Box,
  IconButton,
  DialogTitle,
  Button,
} from '@material-ui/core'
import { subscriptionTiers } from '../../dictionary/user'
import urls from '../../api/urls'
import Close from '@material-ui/icons/Close'

const useStyles = makeStyles(({ spacing }) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
  },
  typo: {
    // fontWeight: 600,
    flexGrow: 1,
  },
  pending: {
    fontWeight: 300,
    fontSize: 14,
  },
  buttonSettings: {
    margin: spacing(-1, 0),
  },
}))

export default function Title({ handleClose }) {
  const { user } = useContext(StateContext)
  const classes = useStyles()

  const is_free_tier = user.subscription_tier === subscriptionTiers.ROOKIE
  const payment_pending = !user.subscription_payed && !is_free_tier

  return (
    <DialogTitle disableTypography>
      <div className={classes.wrapper}>
        <Typography variant="h6" className={classes.typo} noWrap>
          My Subscription <span className={classes.pending}>
            {payment_pending ? "(Payment Pending)" : null}
          </span>
        </Typography>
        <Button
          color="primary"
          component="a"
          href={urls.openCustomerPortal()}
          target="_blank"
          className={classes.buttonSettings}
          startIcon={<SettingsIcon fontSize="small" />}
        >
          Manage
        </Button>
        <Box flexShrink={0} m={-2} ml={0}>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </div>
    </DialogTitle>
  )
}