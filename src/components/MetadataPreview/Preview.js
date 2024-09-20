import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    height: "100%",
    overflow: "auto",
    padding: theme.spacing(0, 2, 10, 2),
  },
}))

export default function Preview({ header, children }) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      {children}
    </div >
  )
}