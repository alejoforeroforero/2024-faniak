import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    top: theme.spacing(-1),
    left: theme.spacing(-1),
    right: theme.spacing(-1),
    bottom: theme.spacing(-1),
    border: "3px solid " + theme.palette.primary.main,
    borderRadius: 3,
  },
}))

export default function DropBorder({ disabled }) {

  const classes = useStyles()

  if (disabled) return null

  return <div className={classes.root} />
}