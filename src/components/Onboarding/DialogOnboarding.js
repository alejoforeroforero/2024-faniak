import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  Dialog,
} from '@material-ui/core'
import Template from './Template'

const useStyles = makeStyles(theme => ({
  dialog: {
    '& .MuiBackdrop-root': {
      backgroundColor: theme.palette.background.default + "88",
    },
  },
  root: {
    padding: theme.spacing(3, 3),
    width: "100%",
  },
  paper: {
    maxWidth: theme.spacing(36),
  },
  mainButton: {
    marginTop: 12,
    marginBottom: 8,
    color: "#fff",
  },
}))

export default function DialogOnboarding({
  title,
  text,
  buttonText,
  buttonOnClick,
}) {

  const classes = useStyles()

  return (
    <Dialog open fullWidth maxWidth="xs" classes={{ root: classes.dialog, paper: classes.paper }}>
      <div className={classes.root}>
        <Template title={title} text={text}>
          <Button
            color="primary"
            variant="contained"
            onClick={buttonOnClick}
            disabled={!buttonOnClick}
            className={classes.mainButton}
          >
            {buttonText}
          </Button>
        </Template>
      </div>
    </Dialog>
  )
}