import { TextField } from '@material-ui/core'
import { getTeamMember } from '../../../../utils/teamUtils'

export default function InputPercentageOwned({ team, setTeam, tIndex }) {
  const { credit } = getTeamMember(team, tIndex)

  const handleChange = (event) => {
    const { value } = event.target

    if (isNaN(value)) return

    if (parseInt(value) > 100) return

    setTeam(prev => {
      const { credit } = getTeamMember(prev, tIndex)
      credit.percentage_owned = value
      credit.is_touched = true
      return { ...prev }
    })
  }

  return (
    <TextField
      type="number"
      InputProps={InputProps}
      value={credit.percentage_owned}
      label="Song % owned"
      onChange={handleChange}
      fullWidth
      size="small"
      variant="outlined"
    />
  )
}

const InputProps = { inputProps: { min: 0, max: 100 } }