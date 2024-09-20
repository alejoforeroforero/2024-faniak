import { makeStyles } from '@material-ui/core/styles'
import MuiAlert from '@material-ui/lab/Alert'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 16,
  },
  icon: {
    marginTop: 2,
  },
  message: {
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
}))

export default function Notice({ children }) {
  const classes = useStyles()

  return (
    <MuiAlert
      elevation={6}
      variant="filled"
      severity="error"
      className={classes.root}
      classes={classes}
    >
      {children}
    </MuiAlert>
  )
}