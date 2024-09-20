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
import RoomIcon from '@material-ui/icons/RoomOutlined'
import PeopleIcon from '@material-ui/icons/PeopleOutlineOutlined'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import SearchArtists from './SearchArtists'
import Artist from './Artist'
import { formParsers, formTrimmers } from '../../../utils/formUtils'
import { createArtistGig } from '../../../api/relation/create'
import { createGig } from '../../../api/folder/create'
import { createEvent } from '../../../api/calendar/createEvent'
import { createCredit } from '../../../api/credit/create'
import { generateDatesFromEventForm, generateEventSource, getEventDateObject } from '../../../utils/eventUtils'


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

export default function ForGigs({ calendar, handleClose, onDone, initialStartDate, initialEndDate }) {
  const { enqueueSnackbar } = useSnackbar()
  const [submitting, setSubmitting] = useState(false)
  const [artist, setArtist] = useState(null)
  const [credits, setCredits] = useState([])
  const [form, setForm] = useState(() => buildInitialFormState(initialStartDate, initialEndDate))

  async function handleSubmit(e) {
    e.preventDefault()

    const payload = {
      summary: form.summary.trim(),
      date: formTrimmers.date(form.date),
      time: form.time.trim(),
      location: form.location.trim(),
      venue: form.venue.trim(),
    }

    setSubmitting(true)

    const allDay = !payload.time
    const where = [payload.venue, payload.location].filter(x => x.trim()).join(", ")
    const [startDate, endDate] = generateDatesFromEventForm(payload)

    var event_id = ""

    await createEvent({
      calendarId: calendar.id,
      resource: {
        summary: where ? `${artist.data.name} @ ${where}` : artist.data.name,
        start: getEventDateObject(allDay, startDate, calendar.timeZone),
        end: getEventDateObject(allDay, endDate, calendar.timeZone),
        source: generateEventSource(startDate),
        location: where,
        attendees: credits
          .filter(x => x.email || x.member)
          .map(x => ({
            email: x.member?.email || x.email,
            displayName: x.member?.name || x.name,
          })),
        extendedProperties: {
          private: {
            faniakShow: "1",
          },
          shared: {
            faniakArtist: artist.id.toString(),
          },
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

    var folder_id = ""

    await createGig({
      data: {
        ...payload,
        artist_name: artist.data.name
      },
      google_event_id: event_id,
      google_calendar_id: calendar.id,
    })
      .then(res => {
        if (res.error) {
          setSubmitting(false)
          enqueueSnackbar("Failed to create your gig.", { variant: "error" })
        } else {
          folder_id = res.folder_id
          enqueueSnackbar("Gig created.", { variant: "success" })
        }
      })

    if (!folder_id) return

    await createArtistGig({
      parent_folder: {
        folder_id: artist.id
      },
      child_folder: {
        event_params: {
          faniakShow: "1",
          eventId: event_id,
          calendarId: calendar.id,
        }
      },
    })
      .then(res => {
        if (res.error) {
          setSubmitting(false)
          enqueueSnackbar("Failed to add your artist to the gig.", { variant: "error" })
        }
      })

    credits.forEach(person => createCredit({
      event_params: {
        eventId: event_id,
        calendarId: calendar.id,
      },
      ...person
    }))

    onDone?.({
      event_id: event_id,
      calendar_id: calendar.id,
      folder_id: folder_id,
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
        Create gig
      </BaseDialogTitle>

      <DialogContent>
        <form id="addGig" onSubmit={handleSubmit}>
          <Box display="flex" alignItems="center" mb={2}>
            <PeopleIcon />
            <Box pl={2} />
            <Box flexGrow={1}>
              {Boolean(artist) ? (
                <Artist
                  artist={artist}
                  setArtist={setArtist}
                  credits={credits}
                  setCredits={setCredits}
                />
              ) : (
                <SearchArtists
                  submitArtist={setArtist}
                />
              )}
            </Box>
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

          <Box display="flex" alignItems="center" mt={2}>
            <RoomIcon />
            <Box pl={2} />
            <StyledField
              value={form.location}
              name="location"
              onChange={handleChangeField}
              label="Location"
            />
            <Box pl={2} />
            <StyledField
              value={form.venue}
              name="venue"
              onChange={handleChangeField}
              label="Venue"
            />
          </Box>
        </form>
      </DialogContent>

      <BaseDialogActions>
        <ContainedButton
          type="submit"
          form="addGig"
          disabled={!artist}
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