import { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom'
import PageDrive from './pages/PageDrive'
import PageFolder from './pages/PageFolder'
import PageBusinessCheckout from './pages/PageBusinessCheckout'
import { isBusinessTier } from './dictionary/user'
import urls from './api/urls'
import './index.scss'
import PageCalendar from './pages/PageCalendar'
import PageEvent from './pages/PageEvent'

export const routes = {
  home: () => `/app`,
  calendar: () => `/app/calendar`,
  calendarEvent: (id = ":google_event_id") => `/app/calendar/event/${id}`,
  calendarView: (view = ":view") => `/app/calendar/${view}`,
  calendarViewTime: (view = ":view", time = ":time") => `/app/calendar/${view}/${time}`,
  folder: (id = ":google_folder_id") => `/app/folders/${id}`,
  businessCheckout: () => `/app/businessCheckout`
}

export default function Routes() {
  const history = useHistory()

  useEffect(() => {
    const search = new URLSearchParams(window.location.search)
    if (search.has("tier")) {
      if (isBusinessTier(search.get("tier"))) {
        history.push(`${routes.businessCheckout()}${window.location.search}`)
      } else {
        window.location.href = `${urls.createCheckoutSession()}${window.location.search}`
      }
    }
  }, [])

  return (
    <Switch>
      <Route exact path={routes.businessCheckout()} component={PageBusinessCheckout} />
      <Route exact path={routes.calendarEvent()} component={PageEvent} />
      <Route exact path={routes.calendarViewTime()} component={PageCalendar} />
      <Route exact path={routes.calendar()} component={PageCalendar} />
      <Route exact path={routes.folder()} component={PageFolder} />
      <Route exact path={routes.home()} component={PageDrive} />
      <Route exact path="*" component={PageDrive} />
    </Switch>
  )
}