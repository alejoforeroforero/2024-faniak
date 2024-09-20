import { useContext } from 'react';
import { StateContext, DispatchContext } from '../../../store'
import { makeStyles } from '@material-ui/core/styles'
import {
  MenuItem,
  Box,
  Popover,
  Divider,
} from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import DarkModeIcon from '@material-ui/icons/InvertColors'
import Member from './Member'
import { signOut } from '../../../utils/authUtils'
import Business from './Business'
import MyBusiness from './MyBusiness'

const useStyles = makeStyles((theme) => ({
  paper: {
    width: theme.spacing(36),
    marginLeft: 16,
  },
  menuItem: {
    fontSize: 14,
  },
  label: {
    marginLeft: 8,
    padding: theme.spacing(1, 1, 0),
  },
  teamsSeparator: {
    padding: "0px 16px",
    display: "flex",
    alignItems: "center",
  },
  divider: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  }
}))


export default function Menu({ anchor, handleClose }) {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const classes = useStyles()

  const { user } = state

  const handleInvertColors = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' })
    handleClose()
  }

  return (
    <Popover
      anchorEl={anchor}
      keepMounted
      open={Boolean(anchor)}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      classes={{ paper: classes.paper }}
    >
      <Member user={user} />

      {Boolean(state.user.is_business || state.businesses.length) && (<>
        <div className={classes.teamsSeparator}>
          <div>MY TEAMS</div>
          <Divider style={{ flexGrow: 1, marginLeft: 12 }} />
        </div>
        <div>
          {state.user.is_business && <MyBusiness />}
          {state.businesses.map((b, i) => <Business key={i} business={b} />)}
        </div>
      </>)}

      <Divider className={classes.divider} />

      <MenuItem
        onClick={handleInvertColors}
        className={classes.menuItem}
      >
        <DarkModeIcon fontSize="small" />
        <Box ml={1} pb={1} pt={1}>
          Toggle palette
        </Box>
      </MenuItem>

      <Divider className={classes.divider} />

      <MenuItem
        onClick={signOut}
        className={classes.menuItem}
      >
        <ExitToAppIcon fontSize="small" />
        <Box ml={1} pb={1} pt={1}>
          Logout
        </Box>
      </MenuItem>

      <Box pt={1} />

    </Popover>
  )
}

const anchorOrigin = {
  vertical: 'center',
  horizontal: 'right',
}

const transformOrigin = {
  vertical: 'center',
  horizontal: 'left',
}