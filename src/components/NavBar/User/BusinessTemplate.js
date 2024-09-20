import { makeStyles } from '@material-ui/core/styles'
import { Avatar } from '@material-ui/core'
import { getSubscriptionLabel } from '../../../dictionary/user'
import { avatarProps } from '../../baseProps'

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: "4px 8px 4px 16px",
    "&:last-child": {
      marginBottom: 8,
    },
  },
  avatar: {
    height: 32,
    width: 32,
  }
}))

export default function BusinessTemplate({ picture, name, button, tier }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Avatar
        {...avatarProps}
        className={classes.avatar}
        src={picture}
      />
      <div style={{ flexGrow: 1, paddingLeft: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>
          {name}
        </div>
        <div style={{ fontSize: 12 }}>
          {getSubscriptionLabel(tier)}
        </div>
      </div>
      {button}
    </div>
  )
}