import { Avatar, Card, makeStyles } from '@material-ui/core'
import { avatarProps } from '../../components/baseProps'
import { folderColors, folderIcons } from '../../dictionary/folder'

const useStyles = makeStyles(theme => ({
  avatar: {
    width: 42,
    height: 42,
    backgroundColor: ({ color }) => color,
    '& .MuiSvgIcon-root': {
      color: "#fff",
    },
  },
  event: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    borderLeft: `3px solid ${theme.palette.primary.main} !important`,
    fontSize: 12,
    fontWeight: 600,
    borderRight: "none",
    borderRadius: 0,
    backgroundColor: ({ selected }) => selected ? theme.palette.action.selected : "transparent",
    borderTop: "none",
    transition: "background-color 0.1s",
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  text: {
    position: "relative",
    overflow: "hidden",
    padding: theme.spacing(0.5, 1),
    '& > div': {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    '& .location': {
      fontSize: 11,
      fontWeight: 400,
    },
  },
}))

export default function MonthSmartEvent({ event, onClick, onContextMenu, selected }) {
  const { smart_folder, artist } = event.resource
  const Icon = folderIcons[smart_folder.type]

  const classes = useStyles({
    color: folderColors[smart_folder.type],
    selected,
  })

  const where = [
    smart_folder.data.venue,
    smart_folder.data.location
  ].filter(x => x.trim()).join(", ")

  return (
    <Card
      variant="outlined"
      className={classes.event}
      tabIndex={-1}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {Boolean(artist) && (
        <Avatar
          {...avatarProps}
          src={artist.picture}
          variant="square"
          className={classes.avatar}
        >
          <Icon />
        </Avatar>
      )}
      <div className={classes.text}>
        <div className="artist">{artist?.name || "Unknown artist"}</div>
        <div className="location">{where || "Unknown Location"}</div>
      </div>
    </Card>
  );
}