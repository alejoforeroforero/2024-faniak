import { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar as BigCalendar, luxonLocalizer, Views } from 'react-big-calendar'
import CalendarStyleWrapper from '../../../../calendar/CalendarStyleWrapper';
import Toolbar from './Toolbar';
import { DateTime, Settings } from 'luxon';
import Event from './Event';

export default function Calendar({
  event,
  entries,
  setEntries,
  editEntry,
}) {
  const [view, setView] = useState(Views.DAY)
  const [date, setDate] = useState(() => new Date(event.start.date || event.start.dateTime))
  const [range, setRange] = useState()

  const localizer = useMemo(() => {
    if (event.start.timeZone) {
      Settings.defaultZone = event.start.timeZone
    }

    return luxonLocalizer(DateTime, { firstDayOfWeek: 7 })
  }, [])

  const onView = useCallback((view) => {
    console.log("onView")
    setView(view)
  }, [date])

  const onNavigate = useCallback((newDate) => {
    console.log("onNavigate")
    setDate(newDate)
  }, [view])

  const onRangeChange = useCallback((newRange) => {
    console.log("onRangeChange")
    if (Array.isArray(newRange)) return
    if (!range || rangeChanged(range, newRange)) {
      // console.log("setRange", newRange.start, newRange.end)
      setRange(newRange)
      // fetchEvents(newRange.start, newRange.end)
      return
    }
  }, [range])

  const startDate = useMemo(() => {
    return new Date(event.start.date || event.start.dateTime)
  }, [event])

  const onSelectSlot = useCallback(({ bounds, box, start, end }) => {
    const newEntry = {
      key: entries.reduce((max, entry) => Math.max(max, entry.key), 0) + 1,
      title: "",
      allDay: false,
      start: start,
      end: end,
    }

    setEntries(prev => prev.concat([newEntry]))

    const { x, y } = bounds ? bounds : box
    editEntry(newEntry.key, x, y)
  }, [entries, editEntry])

  const components = useMemo(() => ({
    toolbar: (props) => <Toolbar {...props} centerDate={startDate} />,
    event: (props) => <Event {...props} editEntry={editEntry} />,
  }), [startDate, editEntry])

  return (
    <CalendarStyleWrapper>
      <BigCalendar
        localizer={localizer}
        components={components}
        events={entries}
        date={date}
        view={view}
        onView={onView}
        onNavigate={onNavigate}
        onRangeChange={onRangeChange}
        showAllEvents
        selectable
        showMultiDayTimes
        // scrollToTime={startDate} doesn't seem to work
        onSelectSlot={onSelectSlot}
      />
    </CalendarStyleWrapper>
  )
}

const rangeChanged = (range, newRange) => {
  return range.start.getTime() !== newRange.start.getTime()
    || range.end.getTime() !== newRange.end.getTime()
}