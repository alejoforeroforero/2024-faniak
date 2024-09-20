import { Avatar, IconButton, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import { avatarProps } from '../baseProps'

const avatarSize = 28

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    paddingTop: 12,
    fontWeight: 600,
    '&:first-child': {
      marginTop: 4,
    },
    '& .email': {
      // paddingLeft: 4,
      opacity: 0.6,
      fontWeight: 500,
    },
    '& .MuiIconButton-root': {
      margin: theme.spacing(-1, -1, -1, 0),
    }
  },
  avatar: {
    height: avatarSize,
    width: avatarSize,
    marginRight: 8,
  },
}))

export default function Employee({ member, handleEdit }) {

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Avatar
        {...avatarProps}
        alt={member.name}
        src={member.picture}
        className={classes.avatar}
      />
      <div style={{ flexGrow: 1, overflow: "hidden", marginRight: 8 }}>
        <Typography
          variant="body2"
          noWrap
        >{member.name} <span
          className="email"
        >{member.email}</span></Typography>
      </div>

      <IconButton disabled={!handleEdit} color="primary" onClick={handleEdit}>
        <EditIcon fontSize='small' />
      </IconButton>
    </div>
  )
}