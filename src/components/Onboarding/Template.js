import { makeStyles } from '@material-ui/core/styles'
import {
  Typography,
  Box,
  IconButton,
} from '@material-ui/core'
import SvgHarmonica from '../../svg/ElementHarmonica'
import Close from '@material-ui/icons/Close'

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  title: {
    textTransform: "uppercase",
    fontWeight: 700,
    margin: theme.spacing(0, 2),
  },
  close: {
    position: "absolute",
    top: 8,
    right: 8,
  },
}))

export default function Template({
  title,
  text,
  skip,
  children,
}) {

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography
        align="center"
        variant="h6"
        className={classes.title}
      >
        {title}
      </Typography>
      <Box mt={1} mb={1}>
        <SvgHarmonica width="120" />
      </Box>
      <Typography
        align="center"
        variant="body2"
        color="secondary"
        gutterBottom
      >
        {text}
      </Typography>

      {/* {skip ? (
        <IconButton className={classes.close} onClick={skip}  >
          <Close />
        </IconButton>
      ) : null} */}

      {children}
    </div>
  )
}