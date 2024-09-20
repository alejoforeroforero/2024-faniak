import { makeStyles } from '@material-ui/core/styles'
import {
  Divider,
  MenuItem,
  Popover,
} from '@material-ui/core'
import { googlePermissionLabels, googlePermissionRoles } from '../../../api/google/store'
import CheckIcon from '@material-ui/icons/Check'

const anchorOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
}
const transformOrigin = {
  vertical: 'top',
  horizontal: 'left',
}
const roles = [
  googlePermissionRoles.WRITER,
  googlePermissionRoles.COMMENTER,
  googlePermissionRoles.READER,
]

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiPaper-root': {
      paddingTop: 4,
      paddingBottom: 4,
      textTransform: "capitalize",
      minWidth: 160,
    },
    '& .MuiSvgIcon-root': {
      marginRight: 4,
      fontSize: 16,
    },
  },
}))

const stopPropagation = (event) => {
  event.stopPropagation()
}

export default function MenuLinkPermissions({
  anchorEl,
  handleClose,
  handleChangeRole,
  permission,
}) {
  const classes = useStyles()

  const currentRole = permission.role

  return (
    <Popover
      open
      getContentAnchorEl={null}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      anchorEl={anchorEl}
      onClick={stopPropagation}
      onClose={handleClose}
      className={classes.root}
    >
      {roles.map((role, i) => (
        <MenuItem key={i} dense
          onClick={handleChangeRole(role)}
          disabled={role === currentRole}
        >
          {role === currentRole && (
            <CheckIcon />
          )}
          {role ? googlePermissionLabels[role] : "No Access"}
        </MenuItem>
      ))}
      <Divider />
      <MenuItem
        dense
        onClick={handleChangeRole("")}
        disabled={"" === currentRole}
      >
        Remove Access
      </MenuItem>
    </Popover>
  )
}