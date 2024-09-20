import {
  Button
} from '@material-ui/core'
import { useState } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Person from './Person'
import MenuAttendeeAccess from './MenuAttendeeAccess'
import { getTeamMember } from '../../../../utils/teamUtils'

export default function Attendee({ team, setTeam, tIndex }) {
  const { email, attendee } = getTeamMember(team, tIndex)
  const hasAccess = !!attendee

  const [menuAnchor, setMenuAnchor] = useState(null)
  const handleOpenMenu = (event) => setMenuAnchor(event.currentTarget)
  const handleCloseMenu = () => setMenuAnchor(null)

  return (
    <Person
      email={email}
      picture={""}
    >
      <Button
        size="small"
        color="primary"
        onClick={handleOpenMenu}
        startIcon={<ExpandMoreIcon />}
      >
        {hasAccess ? "full" : "no"} access
      </Button>
      {!!menuAnchor && (
        <MenuAttendeeAccess
          anchorEl={menuAnchor}
          handleClose={handleCloseMenu}
          team={team}
          setTeam={setTeam}
          tIndex={tIndex}
        />
      )}
    </Person>
  )
}