import { Card, CircularProgress, IconButton, Tooltip, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getEvent } from '../../../../api/calendar/getEvent'
import { openNotification } from '../../../../api/member/openNotification'
import { routes } from '../../../../Routes'
import { DispatchContext, StateContext } from '../../../../store'
import useIsMounted from '../../../../utils/useIsMounted'
import ContainedButton from '../../../ContainedButton'
import EventIcon from '@material-ui/icons/Event'
import CalendarIcon from '../../../../svg/CalendarIcon'
import { simplifyDate, simplifyDatetime } from '../../../../utils/dateUtils'

const useStyles1 = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: "100%",
  },
  buttons: {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    marginTop: 24,
  },
  loadingWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
  },
}))

export default function EventShared({ notification }) {
  const dispatch = useContext(DispatchContext)
  const history = useHistory()
  const classes = useStyles1()
  const isMounted = useIsMounted()

  const [error, setError] = useState(false)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEvent({
      event_params: {
        eventId: notification.data.event_id,
        calendarId: "primary",
      }
    })
      .then(res => {
        if (res.error) {
          setError(true)
          return
        }
        if (!isMounted()) return
        setEvent(res.event)
        setLoading(false)
      })
  }, [notification])

  const openInCalendar = () => {
    history.push(routes.calendarEvent(notification.data.event_id))
  }

  return (
    <div className={classes.root}>
      {event ? (
        <Event event={event} />
      ) : (
        <div className={classes.loadingWrapper}>
          {error ? (
            <div>
              {"You lost connection to the event :("}
            </div>
          ) : (
            <CircularProgress size={24} />
          )}
        </div>
      )}
      <div className={classes.buttons}>
        <ContainedButton
          onClick={openInCalendar}
          size="small"
          loading={loading}
          disabled={error}
        >
          Open in calendar
        </ContainedButton>
      </div>
    </div>
  )
}

const avatarSize = 45

const useStyles2 = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    '& .stats': {
      // maxWidth: `calc(100% - ${avatarSize}px)`,
      padding: theme.spacing(1, 1, 1, 0),
      flexGrow: 1,
      overflow: "hidden",
    },
    '& .MuiIconButton-root': {
      display: "none",
      marginRight: 8,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      '& .MuiIconButton-root': {
        display: "block",
      },
    },
  },
  location: {
    fontSize: 11,
  },
  summary: {
    // fontSize: 14,
    fontWeight: 600,
  },
  thumbnail: {
    width: avatarSize,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
}))

function Event({ event }) {
  const classes = useStyles2()

  const dateString = useMemo(() => {
    if (event.start.date) {
      const date = new Date(`${event.start.date}T00:00:00.000Z`)
      return simplifyDate(date, { timeZone: "UTC" })
    }
    const date = new Date(event.start.dateTime)
    return simplifyDatetime(date)
  }, [event])

  return (
    <Card variant="outlined" className={classes.root}>
      <div className={classes.thumbnail}>
        <EventIcon color="primary" />
      </div>

      <div className="stats">
        <Typography variant="body2" noWrap className={classes.summary}>
          {event["summary"]}
        </Typography>
        <Typography noWrap className={classes.location}>
          {event["location"]}
        </Typography>
        <Typography noWrap className={classes.location}>
          {dateString}
        </Typography>
      </div>

      <Tooltip title="Open in Google Calendar">
        <IconButton
          component="a"
          href={event.htmlLink}
          target="_blank"
          color="primary"
          size="small"
        >
          <CalendarIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Card>
  )
}
