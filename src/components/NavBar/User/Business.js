import { useState } from 'react';
import { IconButton } from '@material-ui/core'
import BaseMenu, { getInitialMenuState, getOpenMenuHandler } from '../../BaseMenu'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'
import { removeEmployee } from '../../../api/member/removeEmployee'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import BusinessTemplate from './BusinessTemplate'

export default function Business({ business }) {
  const [menu, setMenu] = useState(getInitialMenuState())
  const handleOpenMenu = getOpenMenuHandler(setMenu)

  const data = business.business

  const actions = [{
    label: "Leave team",
    icon: MeetingRoomIcon,
    items: [{
      label: "Yes, I'm sure!",
      callback: () => {
        removeEmployee({ id: business.id })
          .then(() => window.location.reload())
      },
    }]
  }]

  return (
    <>
      <BusinessTemplate
        picture={data.picture}
        name={data.name}
        tier={data.subscription_tier}
        button={(
          <IconButton color="primary" onClick={handleOpenMenu}>
            <MoreHorizIcon />
          </IconButton>
        )}
      />
      <BaseMenu
        items={actions}
        header={data.name}
        menuState={menu}
        setMenuState={setMenu}
      />
    </>
  )
}