import { CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  loading: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
}))

export default function Loading() {
  const classes = useStyles()

  return (
    <div className={classes.loading}>
      <CircularProgress size={54} />
    </div >
  )
}