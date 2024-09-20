import { makeStyles } from '@material-ui/core/styles'
import {
  Divider,
  MenuItem,
  Popover,
} from '@material-ui/core'
import { googlePermissionLabels, googlePermissionRoles } from '../../../../api/google/store'
import CheckIcon from '@material-ui/icons/Check'
import { addPermission, getTeamMember, removePermission } from '../../../../utils/teamUtils'

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

export default function MenuPermissionRoles({
  anchorEl,
  handleClose,
  team,
  setTeam,
  tIndex,
}) {
  const classes = useStyles()

  const { permission } = getTeamMember(team, tIndex)
  const currentRole = permission ? permission.role : ""

  const handleChange = (role) => (e) => {
    setTeam(prev => {
      const { permission, email } = getTeamMember(prev, tIndex)

      if (permission) {
        permission.role = role
        permission.is_touched = true

        if (!role) {
          removePermission(prev, tIndex)
        }
      }

      else {
        addPermission(prev, {
          role: role,
          type: "user",
          emailAddress: email,
          is_touched: true,
        })
      }

      return { ...prev }
    })
  }

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
          onClick={handleChange(role)}
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
        onClick={handleChange("")}
        disabled={"" === currentRole}
      >
        Remove Access
      </MenuItem>
    </Popover>
  )
}

const stopPropagation = (event) => {
  event.stopPropagation()
}