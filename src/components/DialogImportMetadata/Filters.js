import {
  Button, Divider,
} from '@material-ui/core'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'

export default function Filters({
  results,
  setResults,
}) {
  const all_selected = !results.some(result => !result.selected)

  const handleClick = e => {
    setResults(prev => prev.map((result, i) => {
      return ({ ...result, selected: !all_selected })
    }))
  }

  return (
    <div style={{
      paddingLeft: 16,
      paddingBottom: 8,
    }}>
      <Button
        color="primary"
        onClick={handleClick}
        startIcon={all_selected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
      >
        Select all
      </Button>
    </div >
  )
}