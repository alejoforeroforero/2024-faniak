import {
  Button
} from '@material-ui/core'
import { useState } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MenuPermissionRoles from './MenuPermissionRoles'
import Person from './Person'
import { googlePermissionLabels, googlePermissionRoles } from '../../../../api/google/store'
import { getTeamMember } from '../../../../utils/teamUtils'

export default function Permission({ team, setTeam, tIndex, canEditPermissions }) {
  const { email, permission } = getTeamMember(team, tIndex)
  const currentRole = permission?.role ?? ""

  const [menuAnchor, setMenuAnchor] = useState(null)
  const handleOpenMenu = (event) => setMenuAnchor(event.currentTarget)
  const handleCloseMenu = () => setMenuAnchor(null)

  return (
    <Person
      email={permission ? permission.emailAddress : email}
      picture={permission ? permission.photoLink : ""}
    >
      <Button
        size="small"
        color="primary"
        onClick={handleOpenMenu}
        startIcon={<ExpandMoreIcon />}
        disabled={currentRole === googlePermissionRoles.OWNER || !canEditPermissions}
      >
        {permission?.role ? googlePermissionLabels[permission.role] : "no access"}
      </Button>
      {!!menuAnchor && (
        <MenuPermissionRoles
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