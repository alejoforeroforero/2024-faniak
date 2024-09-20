import { useContext, useEffect, useState } from 'react';
import { GOOGLE_SCOPES, StateContext } from '../../../store'
import { folderTypes } from '../../../dictionary/folder'
import { getMyEvents } from '../../../api/calendar/getMyEvents'
import { scopeIsGranted } from '../../../utils/authUtils'
import DialogAuthorizeScope from '../../google/DialogAuthorizeScope'
import ForGigs from './ForGigs';
import ForEvents from './ForEvents';

export default function DialogAddEvent(props) {
  const state = useContext(StateContext)
  const granted = scopeIsGranted(GOOGLE_SCOPES.CALENDAR_EVENTS, state.credentials.scope)

  if (granted) return <EventScopeWrapper {...props} />

  return (
    <DialogAuthorizeScope
      scopes={[GOOGLE_SCOPES.CALENDAR_EVENTS]}
      handleClose={props.handleClose}
    />
  )
}

/**
 * @param {folderType} string can be "" if you want to create a normal event
 * @param {onDone} ({folder_id, calendar_id, folder_id, date}) => {} 
 */

function EventScopeWrapper({ handleClose, onDone, folderType, initialStartDate, initialEndDate }) {
  const [calendar, setCalendar] = useState(null)

  useEffect(() => {
    const date = new Date()

    getMyEvents({
      timeMin: date.toISOString(),
      timeMax: date.toISOString(),
    }).then(res => {
      if (res.error) return
      setCalendar({ ...res, id: "primary" })
    })
  }, [])

  const commonProps = {
    onDone: onDone,
    calendar: calendar,
    handleClose: handleClose,
    initialStartDate: initialStartDate,
    initialEndDate: initialEndDate,
  }

  if (folderType === folderTypes.GIG) return <ForGigs {...commonProps} />
  return <ForEvents {...commonProps} />
}