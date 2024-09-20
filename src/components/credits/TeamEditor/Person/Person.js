import {
  makeStyles,
  Avatar,
  Typography,
} from '@material-ui/core'
import { avatarProps } from '../../../baseProps'

const useStyles = makeStyles(theme => ({
  avatar: {
    height: 24,
    width: 24,
    marginRight: 12,
  },
  card: {
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
  },
  email: {
    marginRight: 6,
    overflow: "hidden",
  },
}))

export default function Person({ email, picture, children }) {
  const classes = useStyles()

  return (
    <div className={classes.card}>
      <Avatar
        {...avatarProps}
        className={classes.avatar}
        src={picture || ""}
      />
      {!!email && (
        <div className={classes.email}>
          <Typography noWrap variant="body2">
            {email || ""}
          </Typography>
        </div>
      )}
      {children}
    </div>
  )
}

