import { Button, Typography } from '@material-ui/core'
import Notice from '../PageDrive/Notice'

export default function NoAccessNotice() {
  const handleClick = async () => {
    window.location.reload()
  }

  return (
    <Notice>
      <div style={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="body1">
          Google says you don't have access to this folder...
        </Typography>
        <Typography variant="body2">
          Try refreshing this page. If this message persists change this folder's sharing permissions from your Google Drive account.
        </Typography>
      </div>
      <div>
        <Button variant="outlined" color="inherit" onClick={handleClick}>
          Refresh
        </Button>
      </div>
    </Notice>
  )
}