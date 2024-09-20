import { Button, Typography } from '@material-ui/core'
import ArrowIcon from '@material-ui/icons/ArrowDropDown'

export default function Current({ onClick, text }) {
  return (
    <Button color="primary" onClick={onClick}>
      <Typography
        color="primary"
        noWrap
        style={{ maxWidth: 140 }}
      >
        {text}
      </Typography>
      <ArrowIcon style={{ marginRight: -8 }} />
    </Button>
  )
}