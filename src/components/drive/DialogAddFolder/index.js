import { useState } from 'react';
import {
  DialogContent,
  TextField,
} from '@material-ui/core'
import ContainedButton from '../../ContainedButton'
import BaseDialogActions from '../../BaseDialogActions'
import { folderLabels, folderTypes } from '../../../dictionary/folder'
import BaseDialogTitle from '../../BaseDialogTitle'
import { createFolder } from '../../../api/folder/create'
import BaseDialog from '../../BaseDialog'
import { useSnackbar } from 'notistack'
import { googleMimeTypes } from '../../../api/google/store'
import { createFile } from '../../../api/drive/createFile'

const getDataByFolderType = (folder_type) => {
  switch (folder_type) {
    case "":
    case folderTypes.FOLDER: return {
      default_name: "",
      dialog_title: "Create Folder",
    }
    case folderTypes.PROMO: return {
      default_name: "Promo",
      dialog_title: "Create Promo Folder",
    }
    default: return {}
  }
}

/**
 * Creates a generic folder by asking for a name
 * @param {function} callback callback({ file_id, folder_id })
 * @param {object} parent google file with id
 * @param {string} type smart_folder type if applicable
 * @returns 
 */
export default function DialogAddFolder({ handleClose, callback, parent_id, type = "" }) {
  const { enqueueSnackbar } = useSnackbar()

  const { default_name, dialog_title } = getDataByFolderType(type)
  const [folderName, setFolderName] = useState(default_name)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    setSubmitting(true)

    const file_response = await createFile({
      resource: {
        name: folderName,
        parents: [parent_id],
        mimeType: googleMimeTypes.FOLDER,
      }
    })

    if (file_response.error) {
      setSubmitting(false)
      enqueueSnackbar("Failed to communicate with Google.", { variant: "error" })
      return
    }

    const file_id = file_response.file.id
    let folder_id = null

    if (type) {
      const folder_response = await createFolder(type)({
        google_folder_id: file_id,
        name: folderName,
        type: type,
      })

      setSubmitting(false)

      if (folder_response.error) {
        enqueueSnackbar("Failed to create your Smart Folder.", { variant: "error" })
        return
      } else {
        folder_id = folder_response.folder_id
        enqueueSnackbar(`${folderLabels[type]} created.`, { variant: "success" })
      }
    } else {
      enqueueSnackbar("Folder created.", { variant: "success" })
      setSubmitting(false)
    }

    handleClose()

    callback?.({ file_id, folder_id })
  }

  const handleChangeField = (e) => {
    const { value } = e.target
    setFolderName(value)
  }

  return (
    <BaseDialog maxWidth="xs">
      <BaseDialogTitle handleClose={handleClose}>
        {dialog_title}
      </BaseDialogTitle>

      <DialogContent>
        <form id="addFolder" onSubmit={handleSubmit}>
          <TextField
            value={folderName}
            autoFocus
            onChange={handleChangeField}
            variant="outlined"
            size="small"
            label="Folder Name"
            required
            autoComplete="off"
            fullWidth
            color="primary"
          />
        </form>
      </DialogContent>

      <BaseDialogActions>
        <ContainedButton
          type="submit"
          form="addFolder"
          disabled={!folderName}
          loading={submitting}
        >
          OK
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog >
  )
}