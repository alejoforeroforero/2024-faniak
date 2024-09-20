import { useState } from 'react';
import {
  DialogContent,
} from '@material-ui/core'
import ContainedButton from '../../../ContainedButton'
import BaseDialogActions from '../../../BaseDialogActions'
import { updateMember } from '../../../../api/member/update'
import BaseDialogTitle from '../../../BaseDialogTitle'
import BaseDialog from '../../../BaseDialog'
import { useSnackbar } from 'notistack'
import Form from './Form'
import { formTrimmers } from '../../../../utils/formUtils'

const trimExternalMemberships = (object) => {
  const trimmedObj = {}

  for (const [key, value] of Object.entries(object)) {
    if (value.trim()) {
      trimmedObj[key] = value.trim()
    }
  }

  return trimmedObj
}

export default function DialogEdit({ handleClose, metadata, fetchMember }) {
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(metadata)))
  const [submitting, setSubmitting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const handleSave = () => {
    setSubmitting(true)

    const payload = {
      artistic_name: form.artistic_name.trim(),
      birthday: formTrimmers.date(form.birthday, null),
      phone: form.phone.trim(),
      country: form.country.trim(),
      address: form.address.trim(),
      postal_code: form.postal_code.trim(),
      isni: form.isni.trim(),
      ipn: form.ipn.trim(),
      ipi_cae_number: form.ipi_cae_number.trim(),
      external_memberships: trimExternalMemberships(form.external_memberships),
    }

    updateMember(payload)
      .then(res => {
        if (res.error) {
          setSubmitting(false)
          enqueueSnackbar("An error occured while saving. Please contact support or try again", { variant: "error" })
          return
        }

        enqueueSnackbar("Metadata saved", { variant: "success" })
        handleClose()
        fetchMember()
      })
  }

  return (
    <BaseDialog maxWidth="md">
      <BaseDialogTitle handleClose={handleClose}>
        Edit my information
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