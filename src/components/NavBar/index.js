import { useContext } from 'react';
import { StateContext, DispatchContext, NAVBAR_WIDTH } from '../../store'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Button,
  Drawer,
} from '@material-ui/core'
import Logo from '../../svg/Favicon'
import { useHistory } from 'react-router'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import SubscriptionStatus from './SubscriptionStatus'
import Tabs from './Tabs'
import { onboardingIndexes } from '../Onboarding'
import AnchoredOnboarding from '../Onboarding/AnchoredOnboarding'
import User from './User'
import { routes } from '../../Routes'
import FactoryButton from '../factory/PermanentFactoryButton'
import Notifications from './Notifications';

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.zIndex.drawer,
    backgroundColor: theme.palette.background.paper,
    paddingRight: NAVBAR_WIDTH,
  },
  drawer: {
    width: NAVBAR_WIDTH,
    zIndex: theme.zIndex.drawer - 1,
    flexShrink: 0,
  },
  drawerPaper: {
    width: NAVBAR_WIDTH,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    paddingTop: 24,
    paddingBottom: 8,
    '& .MuiTabs-root': {
      width: "100%",
    },
    '& .MuiTab-root': {
      minWidth: 0,
    }
  },
  wrapper: {
    width: "100%",
    maxWidth: theme.breakpoints.values.lg + 16,
    margin: "auto",
  },
  logoButton: {
    marginBottom: 24,
    minWidth: 0,
    '& .MuiSvgIcon-root': {
      fontSize: 28,
    }
  },
  avatarButton: {
    padding: 8,
  },
}))

export default function NavBar({ disableRedirects, disableShift }) {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const history = useHistory()
  const theme = useTheme()
  const is_mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const { user } = state

  const handleClickLogo = () => {
    // clear path
    dispatch({
      type: 'SET',
      data: { path: [] }
    })

    history.push(routes.home())
  }

  const classes = useStyles({
    shift: !disableShift,
    is_mobile
  })

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open
      classes={{ paper: classes.drawerPaper }}
    >
      <Button
        onClick={handleClickLogo}
        className={classes.logoButton}
        disabled={disableRedirects}
      >
        <Logo />
      </Button>

      {user.id && <>
        {!disableRedirects && (
          <>
            <AnchoredOnboarding
              step={onboardingIndexes.CREATE_SMART_FOLDER}
              title="Create your first Smart Folders."
              text={`From here you'll be able to do everything from creating Smart Folders to Google Docs, Sheets and Slides. Start by adding your Artists' Smart Folders and we'll magically organize it all into albums and songs.`}
            >
              <FactoryButton />
            </AnchoredOnboarding>
            <div style={{ marginBottom: 16 }} />
          </>
        )}

        {!disableRedirects && <Tabs />}

        <div className="fk-flex-grow" />

        {!disableRedirects && <Notifications />}

        <User />

        {!disableRedirects && (
          <AnchoredOnboarding
            step={onboardingIndexes.ACCOUNT_SETTINGS}
            title="Account status and settings"
            text={`This is where you can change your settings and upgrade your plan. Check how many Smart Folders you have left and keep an eye on your Google Drive Storage.`}
          >
            <SubscriptionStatus />
          </AnchoredOnboarding>
        )}
      </>}
    </Drawer>
  )
}