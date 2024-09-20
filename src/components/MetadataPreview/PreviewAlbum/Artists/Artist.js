import { makeStyles } from '@material-ui/core/styles'
import { Typography, Avatar, IconButton, Tooltip } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { routes } from '../../../../Routes'
import { avatarProps } from '../../../baseProps'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'

const avatarSize = 45

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottom: `1px solid ${theme.palette.divider}`,
    borderRadius: 4,
    '&:last-child': {
      borderBottom: "none",
    },
    '& .MuiIconButton-root': {
      marginRight: 8,
      padding: 6,
      display: "none",
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      '& .MuiIconButton-root': {
        display: "block",
      },
    },
  },
  stats: {
    flexGrow: 1,
    maxWidth: `calc(100% - ${avatarSize}px)`,
    paddingLeft: 8,
    paddingRight: 8,
  },
  role: {
    fontSize: 11,
    textTransform: "capitalize"
  },
  name: {
    fontWeight: 600,
    fontSize: 14,
  },
  avatar: {
    height: avatarSize,
    width: avatarSize,
    flexShrink: "0",
    borderRight: "1px solid rgba(140,140,140,0.35)",
  },
}))

export default function Artist({ artist }) {
  const { folder } = artist

  const classes = useStyles()
  const history = useHistory()

  const redirect = () => history.push(routes.folder(folder?.google_folder_id))

  const artist_name = artist.name || folder?.name || ""
  const artist_role = artist.role || "main"

  return (
    <div className={classes.root}>
      <Avatar
        {...avatarProps}
        className={classes.avatar}
        src={folder?.picture}
        variant="square"
      />

      <div className={classes.stats}>
        <Typography noWrap className={classes.name}>
          {artist_name}
        </Typography>

        <Typography noWrap className={classes.role}>
          {artist_role}
        </Typography>
      </div>

      <Tooltip title="Open folder">
        <div>
          <IconButton
            size="small"
            color="primary"
            disabled={!folder}
            onClick={redirect}
          >
            <FolderOpenIcon />
          </IconButton>
        </div>
      </Tooltip>
    </div>
  )
}