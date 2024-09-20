import { PREVIEW_WIDTH, NAVBAR_WIDTH } from '../store'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    height: "100vh",
    overflowY: "auto",
    paddingLeft: NAVBAR_WIDTH,
    paddingRight: ({ shift, is_mobile }) => !is_mobile && shift ? PREVIEW_WIDTH : 0,
    transition: theme.transitions.create('padding', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  wrapper: {
    padding: theme.spacing(3, 3, 4),
    width: "100%",
    height: "100%",
    maxWidth: theme.breakpoints.values.lg,
    margin: "auto",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
}))

export default function Page(props) {
  const theme = useTheme()
  const is_mobile = useMediaQuery(theme.breakpoints.down('xs'))

  const classes = useStyles({
    shift: !props.disableShift,
    is_mobile
  })

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        {props.children}
      </div>
    </div>
  )
}