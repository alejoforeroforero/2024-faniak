import { Accordion, AccordionDetails, AccordionSummary, Avatar, Badge, Box, Popover, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DispatchContext, StateContext } from '../../../store'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { notificationTypes } from '../../../dictionary/notification'
import { avatarProps } from '../../baseProps'
import { DateTime } from 'luxon'
import FileShared from './types/FileShared'
import { updateMember } from '../../../api/member/update'
import EventShared from './types/EventShared'
import { openNotification } from '../../../api/member/openNotification'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: 16,
    width: 300,
    height: 500,
    marginLeft: 16,
  },
  title: {
    marginBottom: 12,
  },
  accordion: {
    '&::before': {
      content: "none",
    }
  },
  summary: {
    padding: "0 8px",
    '& .MuiAccordionDetails-root': {
      display: "block",
    },
    '& .MuiAccordionSummary-content': {
      overflow: "hidden",
      alignItems: "center",
      margin: "8px 0",
    },
    '& .MuiAvatar-root': {
      width: 30,
      height: 30,
      marginRight: 12,
    },
    '& .MuiTypography-caption': {
      opacity: 0.75,
    },
  },
  earlier: {
    marginTop: 16,
    fontWeight: 600,
  },
}))

export default function NotificationsMenu({ menuAnchor, setMenuAnchor }) {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)

  const handleChange = useCallback((panel, notification) => (event, isExpanded) => {
    if (isExpanded && !notification.is_opened) {
      // update is_opened in server
      openNotification({ id: notification.id })

      // update is_opened in local context
      dispatch({
        type: "UPDATE",
        set: (prev) => {
          prev.notifications.items = prev.notifications.items.map((item) => {
            if (item.id === notification.id) {
              item.is_opened = true
            }
            return item
          })
          return { ...prev }
        }
      })
    }

    setExpanded(isExpanded ? panel : false);
  }, [])

  const closeMenu = useCallback(() => setMenuAnchor(null), [])

  const { newItems, olderItems } = useMemo(() => {
    const newItems = []
    const olderItems = []

    const seenAt = new Date(state.notifications.seen_at)
    // const seenAt = new Date("2022-12-13T23:22:03.500Z")

    for (const noti of state.notifications.items) {
      const createdAt = new Date(noti.created_at)

      if (createdAt.getTime() > seenAt.getTime()) {
        newItems.push(noti)
      } else {
        olderItems.push(noti)
      }
    }

    return {
      newItems,
      olderItems,
    }
  }, [])

  useEffect(() => {
    updateMember({ notifications_seen_at: state.notifications.updated_at })
    dispatch({
      type: "UPDATE",
      set: (prev => {
        prev.notifications.seen_at = state.notifications.updated_at
        return { ...prev, notifications: { ...prev.notifications } }
      })
    })
  }, [])

  const renderItem = (startIndex = 0) => (item, i) => (
    <Accordion
      className={classes.accordion}
      key={startIndex + i}
      expanded={expanded === startIndex + i}
      onChange={handleChange(startIndex + i, item)}
      TransitionProps={TransitionProps}
      elevation={0}
    >
      <AccordionSummary
        className={classes.summary}
        expandIcon={(
          <Badge
            color="primary"
            variant="dot"
            invisible={!!item.is_opened || expanded === startIndex + i}
            overlap="rectangular">
            <ExpandMoreIcon />
          </Badge>
        )}
      >
        <Avatar src={item.from.picture} {...avatarProps} />
        <div>
          {renderSummary(item)}
          <RelativeDate UTC={item.created_at} />
        </div>
      </AccordionSummary>
      <AccordionDetails>
        {renderDetails(item)}
      </AccordionDetails>
    </Accordion>
  )

  return (
    <Popover open
      onClick={stopPropagation}
      onClose={closeMenu}
      anchorEl={menuAnchor}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      classes={{ paper: classes.paper }}
    >
      <Typography variant="h6" className={classes.title}>
        Notifications
      </Typography>

      {newItems.length ? (
        newItems.map(renderItem())
      ) : (
        <Typography variant="body2">
          Nothing new to see here!
        </Typography>
      )}

      {olderItems.length > 0 && (
        <Typography className={classes.earlier}>
          Earlier:
        </Typography>
      )}

      {olderItems.map(renderItem(newItems.length))}
    </Popover>
  )
}
const stopPropagation = (e) => e.stopPropagation()

const renderSummary = (notification) => {
  const { type, from } = notification
  switch (type) {
    case notificationTypes.FILE_SHARED: return (
      <Typography variant="body2">
        <strong>{from.name}</strong> shared a <strong>file</strong> with you.
      </Typography>
    )
    case notificationTypes.EVENT_SHARED: return (
      <Typography variant="body2">
        <strong>{from.name}</strong> shared an <strong>event</strong> with you.
      </Typography>
    )
    default: return null
  }
}

const renderDetails = (notification) => {
  switch (notification.type) {
    case notificationTypes.FILE_SHARED: return <FileShared notification={notification} />
    case notificationTypes.EVENT_SHARED: return <EventShared notification={notification} />
    default: return null
  }
}

const RelativeDate = ({ UTC }) => {
  const string = useMemo(() => {
    return DateTime.fromJSDate(new Date(UTC)).toRelative()
  }, [UTC])

  return (
    <Typography variant="caption" noWrap>
      {string}
    </Typography>
  )
}

const TransitionProps = { unmountOnExit: true }

const anchorOrigin = {
  vertical: 'center',
  horizontal: 'right',
}

const transformOrigin = {
  vertical: 'center',
  horizontal: 'left',
}