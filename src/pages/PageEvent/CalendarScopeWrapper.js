import { useContext, useEffect } from 'react';
import { DispatchContext } from '../../store'
import { useSnackbar } from 'notistack'
import { useHistory, useParams } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@material-ui/core'
import { getEvent } from '../../api/calendar/getEvent'
import { routes } from '../../Routes'
import { Views } from 'react-big-calendar'

export default function CalendarScopeWrapper() {
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useContext(DispatchContext)
  const history = useHistory()
  const { google_event_id } = useParams()

  useEffect(() => {
    fetchEvent(google_event_id)
  }, [])

  const fetchEvent = async (eventId) => {
    await getEvent({
      event_params: {
        calendarId: "primary",
        eventId: eventId,
      },
    }, {
      includeThumbnails: true,
    }).then(res => {
      if (res.error) {
        enqueueSnackbar("We were unable to connect to Google...", { variant: "error" })
        history.push(routes.calendar())
        return
      }

      dispatch({
        type: "SET",
        data: { selected_event: res.event }
      })

      const date = new Date(res.event.start.date || res.event.start.dateTime)
      history.push(routes.calendarViewTime(Views.MONTH, date.getTime()))
    })
  }

  return (
    <Box display="flex" height="100%" alignItems="center" justifyContent="center">
      <Box textAlign="center">
        <Typography variant="h6">
          Loading event...
        </Typography>
        <Box pt={2}></Box>
        <CircularProgress />
      </Box>
    </Box>
  )
}