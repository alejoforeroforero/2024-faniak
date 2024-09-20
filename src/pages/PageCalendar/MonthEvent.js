import { useCallback, useContext, useMemo } from 'react';
import { DispatchContext, StateContext } from '../../store'
import CircleIcon from '@material-ui/icons/FiberManualRecord'
import EmptyCircleIcon from '@material-ui/icons/FiberManualRecordOutlined'
import { getEventProps, isFreeBusy } from '../../api/google/store'
import { getPaddedTime } from '../../utils/dateUtils'
import MonthSmartEvent from './MonthSmartEvent'

export default function MonthEvent(props) {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const { event, isAllDay, handleContextMenu } = props
  const { id, title, calendarId, resource } = event
  const { smart_folder } = resource
  const faniakShow = getEventProps.faniakShow(resource)

  const selected = state.selected_event?.id === resource.id
    && state.selected_event?.calendarId === resource.calendarId

  const startTime = useMemo(() => {
    if (event.allDay) return "All day"

    const start = getPaddedTime(event.start)

    if (!event.freeBusy) return start

    const end = getPaddedTime(event.end)

    return `${start} - ${end}`
  }, [event.start])

  const onClick = useCallback((event) => {
    event.stopPropagation()
    console.log("onClick")
    dispatch({
      type: "SET",
      data: { selected_event: resource }
    })
  }, [resource])

  const onContextMenu = useCallback((event) => {
    handleContextMenu(event)
    console.log("onContextMenu")
    dispatch({
      type: "SET",
      data: { selected_event: resource }
    })
  }, [resource])

  return smart_folder ? (
    <MonthSmartEvent
      event={event}
      onClick={onClick}
      onContextMenu={onContextMenu}
      selected={selected}
    />
  ) : (
    <div
      className={`rbc-event${selected ? " selected" : ""}${faniakShow ? "" : " hide"}`}
      tabIndex={-1}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className='rbc-event-content'>
        {faniakShow ? (
          <CircleIcon color="primary" style={iconStyle} />
        ) : (
          <EmptyCircleIcon color="primary" style={iconStyle} />
        )}
        <span className='rbc-event-time'>
          {startTime}
        </span>
        <span className='rbc-event-summary'>{faniakShow ? ` - ${title}` : title}</span>
      </div>
    </div>
  )
}

const iconStyle = { fontSize: 10, marginRight: 2 }