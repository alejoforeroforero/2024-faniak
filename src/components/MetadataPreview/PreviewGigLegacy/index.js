import { useEffect, useState } from 'react';
import { Box, Typography } from '@material-ui/core'
import GoogleScopeWrapper from '../../google/GoogleScopeWrapper'
import { GOOGLE_SCOPES } from '../../../store'
import { routes } from '../../../Routes'
import ContainedButton from '../../ContainedButton'
import { migrateLegacyGig } from '../../../api/drive/migrateLegacyGig'
import { Views } from 'react-big-calendar'
import { useHistory } from 'react-router-dom'
import { dateToEventDatetime, getCurrentTimeZone } from '../../../utils/dateUtils'
import { getFolderRelationships } from '../../../api/drive/getFolderRelationships'
import { getMyEvents } from '../../../api/calendar/getMyEvents'
import { relationTypes } from '../../../dictionary/relation'
import { createEvent } from '../../../api/calendar/createEvent'
import Preview from '../Preview';

export default function PreviewGigLegacy({ file }) {
  const folder = file.smart_folder
  const history = useHistory()
  const [submitting, setSubmitting] = useState(false)
  const [artistGig, setArtistGig] = useState(null)
  const [calendar, setCalendar] = useState(null)

  useEffect(() => {
    // just to get the artist
    getFolderRelationships({ folder_id: folder.id })
      .then(data => {
        if (data.error) return
        setArtistGig(data[relationTypes.ARTIST_GIG][0] || null)
      })

    // just to get the timezone
    const date = new Date()
    getMyEvents({
      timeMin: date.toISOString(),
      timeMax: date.toISOString(),
    }).then(res => {
      if (res.error) return
      setCalendar({ ...res, id: "primary" })
    })
  }, [folder])


  const migrate = async () => {
    setSubmitting(true)

    const artist_name = artistGig ? artistGig.folder.name : "Unknown Artist"
    const timeZone = calendar?.timeZone || getCurrentTimeZone()

    const where = [folder.data.venue, folder.data.location].filter(x => x.trim()).join(", ")
    const [startDate, endDate] = getDates(folder.data.date)

    var event_id = ""

    const payload = {
      calendarId: "primary",
      resource: {
        summary: where ? `${artist_name} @ ${where}` : artist_name,
        source: getSource(startDate),
        location: where,
        start: {
          dateTime: dateToEventDatetime(startDate),
          timeZone: timeZone,
        },
        end: {
          dateTime: dateToEventDatetime(endDate),
          timeZone: timeZone,
        },
        extendedProperties: {
          private: {
            faniakShow: "1",
          },
          shared: {
            faniakArtist: artistGig ? artistGig.folder.id.toString() : undefined,
          },
        },
      },
    }

    await createEvent(payload).then(res => {
      if (res.error) return
      event_id = res.event.id
    })

    if (!event_id) return

    migrateLegacyGig({
      folder_id: folder.id,
      google_event_id: event_id,
    }).then(res => {
      if (res.error) return

      history.push(routes.calendarViewTime(Views.MONTH, startDate.getTime()))
    })
  }

  return (
    <Preview>
      <Box pt={2} pb={3}>
        <Typography align="center" variant="h6" gutterBottom>
          Gigs are now where they belong.
        </Typography>
        <Typography align="center" variant="body2">
          Click below to turn this<br />
          <span style={{ fontWeight: "600" }}>Smart Folder</span> into a <span style={{ fontWeight: "600" }}>Smart Event</span>.
        </Typography>
      </Box>
      <Box display="flex" justifyContent={"center"}>
        <GoogleScopeWrapper
          buttonText={"Sync my Google Calendar"}
          scopes={[GOOGLE_SCOPES.CALENDAR_EVENTS]}
        >
          <div>
            <ContainedButton
              color="primary"
              loading={submitting}
              fullWidth
              onClick={migrate}
            >
              Send to Calendar
            </ContainedButton>
          </div>

        </GoogleScopeWrapper>
      </Box>
    </Preview>
  )
}

const getDates = (date) => {
  const startDate = new Date(date)
  const endDate = new Date(startDate.getTime())
  endDate.setHours(endDate.getHours() + 1)
  return [startDate, endDate]
}

const getSource = (startDate) => ({
  title: "Faniak Calendar",
  url: `${window.location.protocol}//${window.location.host}${routes.calendarViewTime("month", startDate.getTime())}`,
})