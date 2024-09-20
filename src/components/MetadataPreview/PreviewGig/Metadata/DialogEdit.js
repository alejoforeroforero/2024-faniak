import { useContext, useState } from 'react';
import {
  DialogContent,
} from '@material-ui/core'
import ContainedButton from '../../../ContainedButton'
import BaseDialogActions from '../../../BaseDialogActions'
import BaseDialogTitle from '../../../BaseDialogTitle'
import { updateFolder } from '../../../../api/folder/update'
import BaseDialog from '../../../BaseDialog'
import { conditionalGigUpdate } from '../../../../utils/eventUtils'
import { formTrimmers } from '../../../../utils/formUtils'
import Form from './Form'
import { useSnackbar } from 'notistack'
import { DispatchContext } from '../../../../store';

export default function DialogEditMetadata({
  event,
  handleClose,
  metadata,
  refreshEvent,
  isOrganizer,
}) {
  const [form, setForm] = useState({ ...metadata })
  const dispatch = useContext(DispatchContext)
  const [submitting, setSubmitting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const folder = event.smart_folder

  const handleSave = async () => {
    setSubmitting(true)

    const payload = {
      // when
      date: formTrimmers.date(form.date),
      time: form.time.trim(),
      duration_min: formTrimmers.number(form.duration_min),
      time_zone: form.time_zone,
      // where
      location: form.location.trim(),
      venue: form.venue.trim(),
      address: form.address.trim(),
      postal_code: form.postal_code.trim(),
      // status
      tickets_url: form.tickets_url.trim(),
      is_confirmed: form.is_confirmed,
      is_sold_out: form.is_confirmed && form.is_sold_out,
      is_paid: form.is_confirmed && form.is_paid,
      is_cancelled: form.is_cancelled,
    }

    const res = await updateFolder({
      event_params: {
        eventId: event.id,
        calendarId: "primary",
      },
      data: payload,
    })

    if (res.error) {
      setSubmitting(false)
      enqueueSnackbar("An error occured while saving. Please contact support or try again", { variant: "error" })
      return
    }

    await conditionalGigUpdate(event, payload)

    // shallow refresh the calendar
    dispatch({ type: "SET", data: { calendar_anchor: {} } })
    // deep refresh the event
    refreshEvent()
    
    enqueueSnackbar("Metadata saved", { variant: "success" })
    handleClose()
  }

  return (
    <BaseDialog maxWidth="md">
      <BaseDialogTitle handleClose={handleClose}>
        Metadata for "{folder.name}"
      </BaseDialogTitle>

      <DialogContent>
        <Form form={form} setForm={setForm} isOrganizer={isOrganizer} />
      </DialogContent>

      <BaseDialogActions>
        <ContainedButton loading={submitting} onClick={handleSave}>
          Save
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog>
  )
}