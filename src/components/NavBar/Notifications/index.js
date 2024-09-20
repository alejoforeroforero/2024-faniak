import { Badge, IconButton } from '@material-ui/core'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import { useCallback, useContext, useMemo, useState } from 'react'
import { StateContext } from '../../../store'
import NotificationsMenu from './NotificationsMenu'

export default function Notifications() {
  const state = useContext(StateContext)

  const [menuAnchor, setMenuAnchor] = useState(null)
  const openMenu = useCallback((e) => setMenuAnchor(e.currentTarget), [])

  const { disabled, newNotiTotal } = useMemo(() => {
    if (!state.notifications.seen_at) {
      return {
        disabled: true,
        newNotiTotal: 0
      }
    }
    const seenAt = new Date(state.notifications.seen_at)
    var newNotiCounter = 0

    for (const noti of state.notifications.items) {
      const createdAt = new Date(noti.created_at)

      if (createdAt.getTime() > seenAt.getTime()) {
        newNotiCounter++
      } else {
        break
      }
    }

    return {
      disabled: false,
      newNotiTotal: newNotiCounter
    }
  }, [state.notifications])

  return (
    <IconButton disabled={disabled} color="secondary" onClick={openMenu}>
      <Badge badgeContent={newNotiTotal} overlap="circular" color="primary">
        <NotificationsNoneIcon />
      </Badge>

      {!!menuAnchor && (
        <NotificationsMenu
          menuAnchor={menuAnchor}
          setMenuAnchor={setMenuAnchor}
        />
      )}
    </IconButton>
  )
}