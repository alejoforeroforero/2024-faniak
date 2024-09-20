import { makeStyles } from '@material-ui/core/styles'
import { Button, IconButton, Typography } from '@material-ui/core'
import LinkIcon from '@material-ui/icons/Link'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import { useCallback } from 'react'

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    height: 30,
    paddingLeft: 12,
    paddingRight: 8,
    '& .MuiSvgIcon-root': {
      height: 18,
    },
    '& .MuiIconButton-root': {
      display: "none",
      marginLeft: 8,
    },
    '&:hover .MuiIconButton-root': {
      display: "block",
    },
  },
  url: {
    flexGrow: 1,
    fontSize: 13,
    direction: "rtl",
    textAlign: "left",
    textTransform: "none",
    opacity: 0.7,
    paddingRight: 8,
    paddingLeft: 8,
  },
}))

export default function Links({ icon, url, handleCopy }) {
  const classes = useStyles()

  const Icon = icon || LinkIcon

  const copy = useCallback(() => {
    handleCopy(url)
  }, [url, handleCopy])

  return (
    <div className={classes.root}>
      <Icon />
      <Typography className={classes.url} variant="body2" noWrap>
        {url}
      </Typography>
      <IconButton
        color="primary"
        size="small"
        target="_blank"
        rel="noopener"
        href={url}
      >
        <OpenInNewIcon fontSize="small" />
      </IconButton>
      <IconButton
        color="primary"
        size="small"
        onClick={copy}
      >
        <FileCopyOutlinedIcon fontSize="small" />
      </IconButton>
    </div>
  )
}