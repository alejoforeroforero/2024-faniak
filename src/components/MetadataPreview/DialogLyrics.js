import {
  DialogContent,
} from '@material-ui/core'
import ContainedButton from '../ContainedButton'
import BaseDialogActions from '../BaseDialogActions'
import BaseDialogTitle from '../BaseDialogTitle'
import BaseDialog from '../BaseDialog'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  pre: {
    margin: 0,
    fontFamily: theme.typography.fontFamily,
  },
}))

export default function DialogLyrics({ handleClose, song }) {
  const classes = useStyles()

  return (
    <BaseDialog maxWidth="sm">
      <BaseDialogTitle handleClose={handleClose}>
        Lyrics for "{song.name}"
      </BaseDialogTitle>
      <DialogContent>
        <pre className={classes.pre}>
          {song.data.lyrics}
        </pre>
      </DialogContent>
      <BaseDialogActions>
        <ContainedButton onClick={handleClose}>
          Close
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog>
  )
}