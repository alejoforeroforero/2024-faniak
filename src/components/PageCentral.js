import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  wrapper: {
    flexGrow: 1,
    padding: theme.spacing(2, 3, 2, 11),
    minHeight: "100%",
    width: "100%",
    maxWidth: ({ maxWidth }) => maxWidth ? maxWidth : theme.breakpoints.values.lg,
    margin: "auto",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
}))

export default function PageCentral(props) {
  const classes = useStyles({
    maxWidth: props.maxWidth
  })

  return (
    <div className={classes.wrapper}>
      {props.children}
    </div>
  )
}