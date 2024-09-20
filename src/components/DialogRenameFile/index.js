import { useState } from 'react';
import {
  DialogContent,
  Button,
  TextField,
  Box,
} from '@material-ui/core'
import ContainedButton from '../ContainedButton'
import BaseDialogActions from '../BaseDialogActions'
import SnackbarWithActions from '../SnackbarWithActions'
import BaseDialogTitle from '../BaseDialogTitle'
import { getId, getMimeType, getTargetFile, googleMimeTypes } from '../../api/google/store'
import BaseDialog from '../BaseDialog'
import { splitFileName } from '../../utils/fileUtils'
import { useSnackbar } from 'notistack'
import { updateFile } from '../../api/drive/updateFile'

export default function DialogRenameFile({ handleClose, callback, file }) {
  const targetFile = getTargetFile(file)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const [newName, setNewName] = useState(targetFile.name)
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    const previous_name = targetFile.name

    updateFile({
      fileId: getId(file),
      resource: {
        name: newName,
      },
    })
      .then(data => {
        setSubmitting(false)

        if (data.error) return
        callback()
        handleClose()

        var snackbarKey = null

        const handleUndo = () => {
          updateFile({
            fileId: getId(file),
            resource: {
              name: previous_name
            },
          })
            .then(res => {
              if (res.error) return
              enqueueSnackbar("The previous name has been restored.")
              closeSnackbar(snackbarKey)
              callback()
            })
        }

        snackbarKey = enqueueSnackbar(
          <SnackbarWithActions text={`"${previous_name}" was renamed to "${newName}"`}>
            <Button color="primary" onClick={handleUndo}>Undo</Button>
          </SnackbarWithActions>
        )
      })
  }

  const handleChangeField = (e) => {
    const { value } = e.target
    setNewName(value)
  }

  const handleFocus = (event) => {
    let selection_length = newName.length

    if (getMimeType(file) !== googleMimeTypes.FOLDER) {
      const [name] = splitFileName(newName)
      selection_length = name.length
    }

    event.target.setSelectionRange(0, selection_length)
  }

  return (
    <BaseDialog maxWidth="xs">
      <BaseDialogTitle handleClose={handleClose}>
        Rename "{targetFile.name}"
      </BaseDialogTitle>

      <DialogContent>
        <Box pt={0.5} pb={0.5}>
          <form id="renameFile">
            <TextField
              value={newName}
              autoFocus
              onChange={handleChangeField}
              variant="outlined"
              size="small"
              required
              autoComplete="off"
              fullWidth
              color="primary"
              onFocus={handleFocus}
            />
          </form>
        </Box>
      </DialogContent>

      <BaseDialogActions>
        <ContainedButton
          type="submit"
          form="renameFile"
          onClick={handleSubmit}
          disabled={!newName.trim()}
          loading={submitting}
        >
          Save
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog>
  )
}