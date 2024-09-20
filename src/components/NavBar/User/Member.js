import { makeStyles } from '@material-ui/core/styles'
import { Avatar } from '@material-ui/core'
import { avatarProps } from '../../baseProps'

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    padding: theme.spacing(2),
    alignItems: "center",
  },
  avatar: {
    height: 40,
    width: 40,
    marginRight: 12,
  },
}))

export default function Member({ user }) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Avatar
        {...avatarProps}
        className={classes.avatar}
        src={user.picture}
      />
      <div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>
          {user.name}
        </div>
        <div style={{ fontSize: 12 }}>
          {user.email}
        </div>
      </div>
    </div>
  )
}