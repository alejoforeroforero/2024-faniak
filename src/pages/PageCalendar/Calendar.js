import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { Calendar as BigCalendar, luxonLocalizer } from 'react-big-calendar'
import Toolbar from './Toolbar'
import { routes } from '../../Routes'
import { DispatchContext, StateContext } from '../../store'
import MonthEvent from './MonthEvent'
import CalendarStyleWrapper from '../../components/calendar/CalendarStyleWrapper';
import { DateTime, Settings } from 'luxon';
import { getInitialMenuState } from '../../components/BaseMenu';
import EventFactory from './EventFactory';

export default function Calendar({ view, date, events, fetchEvents, handleOpenOptionsMenu }) {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const [range, setRange] = useState()
  const [newEventMenu, setNewEventMenu] = useState(getInitialMenuState())
  const history = useHistory()

  const localizer = useMemo(() => {
    Settings.defaultZone = state.time_zone
    // Settings.defaultZone = "America/Anchorage"

    return luxonLocalizer(DateTime, { firstDayOfWeek: 7 })
  }, [state.time_zone])

  const onView = useCallback((view) => {
    history.push(routes.calendarViewTime(view, date.getTime()))
  }, [date])

  const onNavigate = useCallback((newDate) => {
    // console.log("onNavigate")
    history.push(routes.calendarViewTime(view, newDate.getTime()))
  }, [view])

  const onClick = useCallback((event) => {
    dispatch({
      type: "SET",
      data: { selected_event: null }
    })
  }, [])

  const onRangeChange = useCallback((newRange) => {
    if (Array.isArray(newRange)) return
    if (!range || rangeChanged(range, newRange)) {
      // console.log("setRange", newRange.start, newRange.end)
      setRange(newRange)
      fetchEvents(newRange.start, newRange.end)
      return
    }
  }, [range, state.calendars])

  const onSelectSlot = useCallback(({ action, bounds, box, slots, start, end }) => {
    // this happens when selecting the "all day" slot
    if (!bounds && !box) return

    const { x, y } = bounds ? bounds : box

    setNewEventMenu({
      start: start,
      end: end,
      mouseX: x,
      mouseY: y,
    })
  }, [])

  const onDrillDown = useCallback((date) => {
    history.push(routes.calendarViewTime("day", date.getTime()))
  }, [])

  const components = useMemo(() => ({
    event: (props) => <MonthEvent {...props} handleContextMenu={handleOpenOptionsMenu} />,
    toolbar: Toolbar,
  }), [handleOpenOptionsMenu])

  return (
    <CalendarStyleWrapper showAllDay onClick={onClick}>
      <BigCalendar
        localizer={localizer}
        components={components}
        events={events}
        date={date}
        view={view}
        onView={onView}
        onNavigate={onNavigate}
        onRangeChange={onRangeChange}
        onDrillDown={onDrillDown}
        showAllEvents
        selectable
        onSelectSlot={onSelectSlot}
      />
      <EventFactory
        menuState={newEventMenu}
        setMenuState={setNewEventMenu}
      />
    </CalendarStyleWrapper>
  )
}

const rangeChanged = (range, newRange) => {
  return range.start.getTime() !== newRange.start.getTime()
    || range.end.getTime() !== newRange.end.getTime()
}