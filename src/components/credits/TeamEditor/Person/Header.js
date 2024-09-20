import {
  Button,
} from '@material-ui/core'
import { useState } from 'react';
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import { getInitialMenuState, getOpenMenuHandler } from '../../../BaseMenu'
import MenuIdentify from './MenuIdentify'
import Permission from './Permission'
import Attendee from './Attendee'
import Person from './Person'
import { getTeamMember } from '../../../../utils/teamUtils'

export default function Header({ team, setTeam, tIndex, fileMode, canEditPermissions }) {
  const { email } = getTeamMember(team, tIndex)

  if (email && fileMode) return (
    <Permission
      team={team}
      setTeam={setTeam}
      tIndex={tIndex}
      canEditPermissions={canEditPermissions}
    />
  )

  if (email && !fileMode) return (
    <Attendee
      team={team}
      setTeam={setTeam}
      tIndex={tIndex}
    />
  )

  return (
    <EmailOnly
      team={team}
      setTeam={setTeam}
      tIndex={tIndex}
    />
  )
}

function EmailOnly({ team, setTeam, tIndex }) {
  const { credit } = getTeamMember(team, tIndex)
  const [identifyMenu, setIdentifyMenu] = useState(getInitialMenuState())

  const openIdentifyMenu = getOpenMenuHandler(setIdentifyMenu)

  return (
    <Person>
      <Button
        size="small"
        color="primary"
        onClick={openIdentifyMenu}
        startIcon={<PersonAddIcon />}
      >
        Invite {credit.name}
      </Button>

      <MenuIdentify
        menuState={identifyMenu}
        setMenuState={setIdentifyMenu}
        team={team}
        setTeam={setTeam}
        tIndex={tIndex}
      />
    </Person>
  )
}