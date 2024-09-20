import { makeStyles } from '@material-ui/core/styles'
import {
  Divider,
  MenuItem,
  Popover,
} from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'
import { addAttendee, getTeamMember, removeAttendee } from '../../../../utils/teamUtils'

const anchorOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
}
const transformOrigin = {
  vertical: 'top',
  horizontal: 'left',
}

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

export default function MenuAttendeeAccess({
  anchorEl,
  handleClose,
  team,
  setTeam,
  tIndex,
}) {
  const classes = useStyles()

  const { attendee } = getTeamMember(team, tIndex)
  const hasAccess = !!attendee

  const handleGiveAccess = (e) => {
    setTeam(prev => {
      const { email } = getTeamMember(prev, tIndex)

      addAttendee(prev, { email })

      return { ...prev }
    })
  }

  const handleRemoveAccess = (e) => {
    setTeam(prev => {
      removeAttendee(prev, tIndex)
      
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
      <MenuItem dense disabled={hasAccess} onClick={handleGiveAccess}>
        {hasAccess && <CheckIcon />}
        Full Access
      </MenuItem>
      <Divider />
      <MenuItem dense disabled={!hasAccess} onClick={handleRemoveAccess}>
        Remove Access
      </MenuItem>
    </Popover>
  )
}

const stopPropagation = (event) => {
  event.stopPropagation()
}