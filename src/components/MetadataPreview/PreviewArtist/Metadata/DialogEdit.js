import { useState } from 'react';
import {
  DialogContent,
} from '@material-ui/core'
import ContainedButton from '../../../ContainedButton'
import BaseDialogActions from '../../../BaseDialogActions'
import BaseDialogTitle from '../../../BaseDialogTitle'
import { updateFolder } from '../../../../api/folder/update'
import { useSnackbar } from 'notistack'
import BaseDialog from '../../../BaseDialog'
import Form from './Form'

export default function DialogEdit({
  folder,
  handleClose,
  metadata,
  fetchContent,
}) {
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(metadata)))
  const [submitting, setSubmitting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const handleSave = () => {
    setSubmitting(true)

    const payload = {
      name: form.name.trim(),
      country: form.country.trim(),
      bios: form.bios.filter(bio => bio.text.trim()),
    }

    updateFolder({
      folder_id: folder.id,
      data: payload,
    })
      .then(res => {
        if (res.error) {
          setSubmitting(false)
          enqueueSnackbar("An error occured while saving. Please contact support or try again", { variant: "error" })
          return
        }

        enqueueSnackbar("Metadata saved", { variant: "success" })
        fetchContent()
        handleClose()
      })
  }

  return (
    <BaseDialog maxWidth="md">
      <BaseDialogTitle handleClose={handleClose}>
        Metadata for "{folder.name}"
      </BaseDialogTitle>

      <DialogContent>
        <Form form={form} setForm={setForm} />
      </DialogContent>

      <BaseDialogActions>
        <ContainedButton loading={submitting} onClick={handleSave}>
          Save
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog>
  )
}