import {
  TextField,
} from '@material-ui/core'
import { getTeamMember } from '../../../../utils/teamUtils'

export default function InputName({ team, setTeam, tIndex }) {
  const { credit } = getTeamMember(team, tIndex)

  const handleChangeName = (event) => {
    const { value } = event.target

    setTeam(prev => {
      const { credit } = getTeamMember(prev, tIndex)
      credit.name = value
      credit.is_touched = true
      return { ...prev }
    })
  }

  return (
    <TextField
      value={credit.name}
      label="Name"
      onChange={handleChangeName}
      fullWidth
      size="small"
      variant="outlined"
    />
  )
}