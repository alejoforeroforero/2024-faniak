import { useContext } from 'react';
import { StateContext, STATIC_URL } from '../../store'
import BaseDialog from '../BaseDialog'
import { Box, DialogContent, DialogTitle, Divider, Link, Typography } from '@material-ui/core'
import ContainedButton from '../ContainedButton'
import urls from '../../api/urls'
import { subscriptionTiers } from '../../dictionary/user'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
    textAlign: "center",
    fontSize: 14,
    "& strong": {
      fontWeight: 600,
      fontSize: 16,
    },
    "& img": {
      width: 40,
      marginBottom: 16,
    },
    "& .MuiDivider-root": {
      height: 24,
      marginLeft: 24,
      marginRight: 24,
    },
    "& .MuiLink-root": {
      cursor: "pointer",
    },
  },
}))

export default function DialogExpiredTrial() {
  const classes = useStyles()
  const state = useContext(StateContext)

  if (!state.user.is_free_trial_expired) return null

  return (
    <BaseDialog maxWidth="xs">
      <DialogTitle>
        Your free trial has ended, so...
      </DialogTitle>
      <DialogContent>
        <div className={classes.wrapper}>
          <img alt="" src={STATIC_URL + "/app/public/party.png"} />

          <strong>
            It's time to celebrate your first month with us!
          </strong>

          <Box mb={2} />

          <div>
            Join hundreds of music creators and professionals and sign-up to a creator account now!
          </div>

          <Box mt={3} mb={1} display="flex" justifyContent={"center"} alignItems="center" textAlign="center">
            <div>
              <strong>250</strong>
              <div>Smart Folders</div>
            </div>
            <Divider orientation='vertical' />
            <div>
              <strong>Unlimited</strong>
              <div>Smart Events</div>
            </div>
          </Box>

          <Box mb={2} />

          <ContainedButton href={`${urls.createCheckoutSession()}?tier=${subscriptionTiers.CREATOR}`}>
            Start Creator Plan
          </ContainedButton>

          <Box mb={2} />

          <Typography gutterBottom variant="body2" align='center'>
            Not enough? <Link href={"/pricing"}>
              Check your options
            </Link>.
          </Typography>
        </div>
      </DialogContent>
    </BaseDialog >
  )
}