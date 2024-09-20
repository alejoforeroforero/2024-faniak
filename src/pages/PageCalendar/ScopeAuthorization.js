import { GOOGLE_SCOPES } from '../../store'
import GoogleScopeWrapper from '../../components/google/GoogleScopeWrapper'
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ScopeDescription from '../../components/google/ScopeDescription'
import WarningIcon from '@material-ui/icons/Warning'

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxHeight: "100%",
    width: 400,
    maxWidth: "100%",
    padding: theme.spacing(6, 2, 6),
  },
  mainTitle: {
    fontWeight: 600,
  },
}))

export default function ScopeAuthorization() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Typography align="center" variant="h6">
          Welcome to your
        </Typography>
        <Typography className={classes.mainTitle} align="center" gutterBottom variant="h4">
          Music Calendar!
        </Typography>

        <Box mt={0} mb={5}>
          <ScopeDescription scope={GOOGLE_SCOPES.CALENDAR_EVENTS} />
        </Box>

        {/* <Box mt={2} mb={4} display="flex" alignItems="center">
          <WarningIcon />
          <Box ml={3}>
            <Typography variant="body2">
              Our integration is still under evaluation by Google.
            </Typography>
            <Typography variant="body2">
              As a result, you will get a warning if you click the button below before the evaluation is over.
            </Typography>
          </Box>
        </Box> */}

        <GoogleScopeWrapper
          scopes={[GOOGLE_SCOPES.CALENDAR_EVENTS]}
          buttonText="Sync my Google Calendar"
        />
      </div>
    </div>
  )
}