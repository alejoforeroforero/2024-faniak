import { useContext } from 'react';
import Page from '../../components/Page'
import MetadataPreview from '../../components/MetadataPreview'
import NavBar from '../../components/NavBar'
import { DispatchContext, GOOGLE_SCOPES, StateContext } from '../../store'
import CalendarScopeWrapper from './CalendarScopeWrapper'
import { scopeIsGranted } from '../../utils/authUtils'
import { getEvent } from '../../api/calendar/getEvent'
import ScopeAuthorization from './ScopeAuthorization'

export default function PageCalendar() {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  const needsAuth = !scopeIsGranted(GOOGLE_SCOPES.CALENDAR_EVENTS, state.credentials.scope)

  const fetchEvent = async (eventId) => {
    await getEvent({
      event_params: {
        calendarId: "primary",
        eventId: eventId,
      },
    }, {
      includeThumbnails: true,
    }).then(res => {
      if (res.error) return
      dispatch({
        type: "UPDATE",
        set: (prev) => {
          // if event should be pushed into the list (new event)
          var pushEvent = true
          prev.events = prev.events.map((event) => {
            if (event.id === eventId) {
              pushEvent = false
              return res.event
            }
            return event
          })

          if (pushEvent) {
            prev.events.push(res.event)
          }

          if (prev.selected_event?.id === eventId) {
            prev.selected_event = res.event
          }

          return { ...prev }
        }
      })
    })
  }

  return (
    <Page>
      <NavBar />

      {needsAuth ? (
        <ScopeAuthorization />
      ) : (
        <CalendarScopeWrapper />
      )}

      <MetadataPreview
        // loading={loading}
        fetchEvent={fetchEvent}
      />
    </Page>
  )
}