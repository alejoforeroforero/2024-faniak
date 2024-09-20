import { useContext, useState } from 'react';
import { StateContext } from '../../../store'
import { makeStyles } from '@material-ui/core/styles'
import {
  IconButton,
  Avatar,
  CircularProgress,
} from '@material-ui/core'
import Menu from './Menu'
import { avatarProps } from '../../baseProps'

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    padding: 8,
  },
  loading: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 0,
    bottom: 0,
  }
}))

export default function User() {
  const { user } = useContext(StateContext)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const classes = useStyles()

  const handleOpenMenu = (e) => setMenuAnchor(e.currentTarget)
  const handleCloseMenu = () => setMenuAnchor(null)

  return (
    user.id && <>
      <IconButton
        onClick={handleOpenMenu}
        className={classes.root}
      >
        <Avatar
          {...avatarProps}
          alt={user.name}
          src={user.picture}
        >
          {user.name || !user.name ? null : user.name.charAt(0)}
        </Avatar>

        {/* {updating_status && <CircularProgress className={classes.loading} />} */}
      </IconButton>

      {menuAnchor && <Menu anchor={menuAnchor} handleClose={handleCloseMenu} />}
    </>
  )
}