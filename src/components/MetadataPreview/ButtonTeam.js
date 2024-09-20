import {
  Avatar,
  Button,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { avatarProps } from '../baseProps';
import AvatarGroup from '@material-ui/lab/AvatarGroup'
import PublicIcon from '@material-ui/icons/Public'
import PersonAddIcon from '@material-ui/icons/PersonAdd'

const useStyles = makeStyles((theme) => ({
  button: {
    minWidth: 0,
    flexShrink: 0,
  },
  avatar: {
    width: 24,
    height: 24,
    fontSize: 12,
  },
}))

export default function ButtonTeam({ file, event, handleOpenTeam }) {
  const classes = useStyles()

  return (
    <Button
      className={classes.button}
      color="primary"
      size="small"
      onClick={handleOpenTeam}
    >
      {Boolean(file?.permissions?.length || event?.attendees?.length) ? (
        <AvatarGroup
          max={4}
          classes={{ avatar: classes.avatar }}
        >
          {file ? (
            file.permissions.map((permission, i) => {
              if (permission.id === "anyoneWithLink") {
                return (
                  <Avatar key={i} {...avatarProps} src="" alt="Anyone with the link" >
                    <PublicIcon fontSize="small" color="secondary" />
                  </Avatar>
                )
              }
              return <Avatar key={i} {...avatarProps} src={permission?.photoLink || ""} />
            })
          ) : (
            event.attendees.map((attendee, i) => {
              return <Avatar key={i} {...avatarProps} src="" alt={attendee?.email || ""} />
            })
          )}
        </AvatarGroup>
      ) : (
        <PersonAddIcon fontSize='small' />
      )}
    </Button>
  )
}