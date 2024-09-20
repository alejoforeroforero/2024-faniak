import { makeStyles } from '@material-ui/core/styles'
import { Card, Avatar, CardActionArea } from '@material-ui/core'
import { folderIcons, folderColors } from '../../dictionary/folder'
import FolderTag from './FolderTag'
import { avatarProps } from '../baseProps'

const useStyles = makeStyles((theme) => ({
  card: {
    border: ({ selected, color }) => selected ? `1px solid ${color}` : null,
    cursor: "default",
    width: "100%",
  },
  avatar: {
    height: "auto",
    width: "100%",
    backgroundColor: ({ color }) => color,
    '&::before': {
      content: "''",
      paddingBottom: "100%",
      display: "block",
    },
    '& .MuiSvgIcon-root': {
      width: "35%",
      height: "35%",
      color: "#fff",
    },
    '& .MuiAvatar-img': {
      position: "absolute",
    }
  },
}))

export default function Folder({
  folder = null,
  selected = false,
  button = false,
  onClick,
  onContextMenuCapture,
  children,
}) {
  const type = folder?.type || ""

  const classes = useStyles({
    selected: selected,
    color: folderColors[type],
  })

  const Icon = folderIcons[type]

  return (
    <div>
      <FolderTag type={type} selected={selected} />

      <Card
        variant="outlined"
        className={classes.card}
        onContextMenuCapture={onContextMenuCapture}
        onClick={onClick}
      >
        <CardActionArea
          component="div"
          disabled={!button}
          onClick={onClick}
        >
          <Avatar
            {...avatarProps}
            variant="square"
            src={folder?.picture}
            className={classes.avatar}
          >
            <Icon />
          </Avatar>

          {children}
        </CardActionArea>
      </Card>
    </div>
  )
}