import { Button, Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

export default function Breadcrumb({ text = "...", id, to, setCurrentFolder }) {
  const history = useHistory()

  const handleClick = () => {
    if (setCurrentFolder) {
      return setCurrentFolder(id)
    }
    history.push(to)
  }

  return (
    <Button
      onClick={handleClick}
      color="primary"
      disabled={!to}
    >
      <Typography
        color="primary"
        noWrap
        style={{ maxWidth: 140 }}
      >
        {text}
      </Typography>
    </Button>
  )
}