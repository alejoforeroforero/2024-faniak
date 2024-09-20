import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Calendar from './Calendar'
import { DispatchContext, StateContext } from '../../store'
import { useSnackbar } from 'notistack'
import { useParams } from 'react-router-dom'
import { counter } from '../../reducer'
import { getInitialMenuState, getOpenMenuHandler } from '../../components/BaseMenu'
import OptionsMenu from './OptionsMenu'
import { getMyEvents } from '../../api/calendar/getMyEvents'
import { Box } from '@material-ui/core'
import Loading from './Loading'

const excessDaysFetched = 0

export default function CalendarScopeWrapper() {
  const { enqueueSnackbar } = useSnackbar()
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const [optionsMenu, setOptionsMenu] = useState(getInitialMenuState())
  const handleOpenOptionsMenu = useCallback(getOpenMenuHandler(setOptionsMenu), [])

  const params = useParams()
  const view = params.view ?? "month"

  const date = useMemo(() => {
    const time = parseInt(params.time)
    if (time) return new Date(time)
    return new Date()
  }, [params.time])

  useEffect(() => {
    return () => {
      dispatch({ type: 'RESET_CURR' })
    }
  }, [])

  useEffect(() => {
    refreshEvents()
  }, [state.calendar_anchor])

  const refreshEvents = useCallback(() => {
    const timeMin = new Date(date)
    // make sure the counter starts at midnight
    timeMin.setHours(0)
    timeMin.setMinutes(0)
    timeMin.setSeconds(0)
    timeMin.setDate(1)
    const timeMax = new Date(timeMin)
    // set the time period to 1 month
    timeMax.setMonth(timeMax.getMonth() + 1)

    fetchEvents(timeMin, timeMax)
  }, [fetchEvents, date])

  useEffect(() => {
    setEvents(state.events.map(event => ({
      id: event.id,
      calendarId: "primary",
      title: event.summary || "",
      allDay: Boolean(event.start.date),
      start: new Date(event.start.date || event.start.dateTime),
      end: new Date(event.start.date || event.end.dateTime),
      resource: event,
    })))
  }, [state.events])

  const fetchEvents = useCallback(async (start, end) => {
    setLoading(true)

    counter.fetchEvents++
    const currentCounter = counter.fetchEvents

    const timeMin = new Date(start)
    const timeMax = new Date(end)
    // timeMin.setDate(timeMin.getDate() - excessDaysFetched)
    // timeMax.setDate(timeMax.getDate() + excessDaysFetched)

    const response = await getMyEvents({
      // sharedExtendedProperty: "faniakArtist=1",
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
    }, {
      includeThumbnails: true,
    })

    if (response.error) {
      enqueueSnackbar(`We were unable to fetch your events.`, { variant: "error" })
      return
    }

    console.table(response.items)

    if (currentCounter !== counter.fetchEvents) return console.log("Event fetching cancelled...")

    dispatch({
      type: "SET",
      data: {
        time_zone: response.timeZone,
        events: response.items,
      }
    })

    setLoading(false)
  }, [])

  return (
    <>
      <Calendar
        handleOpenOptionsMenu={handleOpenOptionsMenu}
        fetchEvents={fetchEvents}
        view={view}
        date={date}
        events={events}
      />
      <OptionsMenu
        fetchContent={refreshEvents}
        menuState={optionsMenu}
        setMenuState={setOptionsMenu}
      />
      {loading && <Loading />}
    </>
  )
}