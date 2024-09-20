import {
  Typography, Avatar, IconButton, Tooltip
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { folderIcons } from '../../../../dictionary/folder'
import { routes } from '../../../../Routes'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import { avatarProps } from '../../../baseProps'

const avatarSize = 45

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingRight: 8,
    cursor: "default",
    '& .MuiIconButton-root': {
      display: "none",
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      '& .MuiIconButton-root': {
        display: "block",
      },
    },
  },
  name: {
    flexGrow: 1,
    overflow: "hidden",
    fontWeight: 600,
    fontSize: 14,
    paddingLeft: 8,
    paddingRight: 8,
  },
  avatar: {
    height: avatarSize,
    width: avatarSize,
    flexShrink: "0",
    borderRight: "1px solid rgba(140,140,140,0.35)",
  },
}))

export default function Artist({ folder }) {
  const classes = useStyles()
  const history = useHistory()

  const redirect = () => history.push(routes.folder(folder.google_folder_id))

  const Icon = folderIcons[folder.type]

  return (
    <div className={classes.root}>
      <Avatar
        {...avatarProps}
        className={classes.avatar}
        src={folder.picture}
        variant="square"
      >
        <Icon />
      </Avatar>

      <Typography noWrap className={classes.name}>
        {folder.name}
      </Typography>

      <Tooltip title="Open folder">
        <IconButton component="div" color="primary" onClick={redirect} size="small">
          <FolderOpenIcon />
        </IconButton>
      </Tooltip>
    </div>
  )
}