import { useState } from 'react';
import {
  Box,
  DialogContent,
  TextField,
} from '@material-ui/core'
import ContainedButton from '../../ContainedButton'
import BaseDialogActions from '../../BaseDialogActions'
import BaseDialogTitle from '../../BaseDialogTitle'
import BaseDialog from '../../BaseDialog'
import { useSnackbar } from 'notistack'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import { formParsers, formTrimmers } from '../../../utils/formUtils'
import { generateDatesFromEventForm, generateEventSource, getEventDateObject } from '../../../utils/eventUtils';
import { routes } from '../../../Routes'
import { createArtistGig } from '../../../api/relation/create'
import { createGig } from '../../../api/folder/create'
import { createEvent } from '../../../api/calendar/createEvent'
import { createCredit } from '../../../api/credit/create'

const buildInitialFormState = (initialStartDate, initialEndDate) => {
  const form = {
    summary: "",
    date: "",
    time: "",
    venue: "",
    location: "",
  }

  if (initialStartDate) {
    form.date = formParsers.date(initialStartDate.toISOString())
  }

  return form
}

/**
 * @param {onDone} ({folder_id, calendar_id, folder_id, date}) => {} 
 */
export default function ForEvents({ calendar, handleClose, onDone, initialStartDate, initialEndDate }) {
  const { enqueueSnackbar } = useSnackbar()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(() => buildInitialFormState(initialStartDate, initialEndDate))

  async function handleSubmit(e) {
    e.preventDefault()

    const payload = {
      date: formTrimmers.date(form.date),
      time: form.time.trim(),
    }

    setSubmitting(true)

    const allDay = !payload.time
    const [startDate, endDate] = generateDatesFromEventForm(payload)

    var event_id = ""

    await createEvent({
      calendarId: calendar.id,
      resource: {
        summary: form.summary.trim(),
        start: getEventDateObject(allDay, startDate, calendar.timeZone),
        end: getEventDateObject(allDay, endDate, calendar.timeZone),
        source: generateEventSource(startDate),
        extendedProperties: {
          private: {
            faniakShow: "1",
          }
        },
      },
    })
      .then(res => {
        if (res.error) {
          setSubmitting(false)
          enqueueSnackbar("Failed to communicate with Google.", { variant: "error" })
        } else {
          event_id = res.event.id
        }
      })

    if (!event_id) return

    onDone?.({
      event_id: event_id,
      calendar_id: calendar.id,
      date: new Date(`${payload.date}T00:00:00Z`)
    })

    handleClose()
  }

  const handleChangeField = (event) => {
    const { value, name } = event.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  return (
    <BaseDialog maxWidth="sm">
      <BaseDialogTitle handleClose={handleClose}>
        Create event
      </BaseDialogTitle>

      <DialogContent>
        <form id="addGig" onSubmit={handleSubmit}>
          <Box display="flex" alignItems="center" mb={2}>
            <Box pl={5} />
            <StyledField
              required
              value={form.summary}
              name="summary"
              onChange={handleChangeField}
              label="Title"
            />
          </Box>
          <Box display="flex" alignItems="center">
            <AccessTimeIcon />
            <Box pl={2} />
            <StyledField
              required
              value={form.date}
              name="date"
              type="date"
              InputLabelProps={dateInputProps}
              onChange={handleChangeField}
              label="Date"
            />
            <Box pl={2} />
            <StyledField
              value={form.time}
              name="time"
              type="time"
              InputLabelProps={dateInputProps}
              onChange={handleChangeField}
              label="Time"
            />
          </Box>
        </form>
      </DialogContent>

      <BaseDialogActions>
        <ContainedButton
          type="submit"
          form="addGig"
          loading={submitting || !calendar}
        >
          SAVE
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog>
  )
}

const dateInputProps = { shrink: true }

function StyledField(props) {
  return (
    <TextField
      fullWidth
      autoComplete="off"
      variant="outlined"
      size="small"
      {...props}
    />
  );
}