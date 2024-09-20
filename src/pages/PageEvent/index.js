import { useContext } from 'react';
import Page from '../../components/Page'
import NavBar from '../../components/NavBar'
import { GOOGLE_SCOPES, StateContext } from '../../store'
import CalendarScopeWrapper from './CalendarScopeWrapper'
import { scopeIsGranted } from '../../utils/authUtils'
import ScopeAuthorization from '../PageCalendar/ScopeAuthorization'

export default function PageEvent() {
  const state = useContext(StateContext)
  const needsAuth = !scopeIsGranted(GOOGLE_SCOPES.CALENDAR_EVENTS, state.credentials.scope)

  return (
    <Page disableShift>
      <NavBar />

      {needsAuth ? (
        <ScopeAuthorization />
      ) : (
        <CalendarScopeWrapper />
      )}
    </Page>
  )
}