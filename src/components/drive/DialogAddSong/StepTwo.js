import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Metadata from './Metadata'

const useStyles = makeStyles(theme => ({
  dropzone: {
    height: "100%",
  },
  form: {
    flexGrow: 1,
  },
  field: {
    marginBottom: 8,
  },
  checkboxLabel: {
    fontSize: 15,
  }
}))

export default function StepTwo({ songState, callback }) {

  const [song, setSong] = songState

  const classes = useStyles()

  const handleChangeTitle = e => {
    const title = e.target.value
    setSong(prev => ({ ...prev, title }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    callback()
  }

  const toggleCheckbox = (e) => {
    setSong(prev => ({
      ...prev,
      upload_file: e.target.checked
    }))
  }

  return (
    <>
      <Box display="flex" pb={2}>

        <form id="addUnsorted" className={classes.form} onSubmit={handleSubmit}>
          <TextField
            defaultValue={song.title}
            autoFocus
            onChange={handleChangeTitle}
            label="Song Title"
            required
            autoComplete="off"
            fullWidth
            color="primary"
            className={classes.field}
          />
        </form>
      </Box>

      {
        song.submitted_file
          ? <Metadata song={song} />
          : null
      }
    </>
  )
}