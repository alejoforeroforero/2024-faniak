import { makeStyles } from '@material-ui/core/styles'
import { FOLDER_WIDTH } from '../FileSystem'
import { folderColors, folderIcons, folderLabels } from '../../dictionary/folder'
import { Avatar, Box, Card, Typography } from '@material-ui/core'
import { avatarProps } from '../baseProps'
import ButtonTeam from './ButtonTeam'
import ButtonBack from './ButtonBack'
import { PREVIEW_WIDTH } from '../../store'

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    marginTop: 32,
    marginBottom: 24,
    alignItems: "end",
  },
  wrapper: {
    position: "relative",
    flexShrink: 0,
    width: FOLDER_WIDTH,
  },
  content: {
    position: "relative",
    overflow: "hidden",
    flexGrow: 1,
    padding: theme.spacing(1.5, 0, 0, 2),
  },
  card: {
    border: ({ color }) => `1px solid ${color}`,
    cursor: "default",
    width: "100%",
  },
  square: {
    position: "relative",
    height: "auto",
    width: "100%",
    '&::before': {
      content: "''",
      paddingBottom: "100%",
      display: "block",
    },
  },
  avatarWrapper: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "100%",
  },
  avatar: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: "transparent",
    '& .MuiSvgIcon-root': {
      width: "50%",
      height: "50%",
      color: ({ color }) => color,
    },
    '& .MuiAvatar-img': {
      position: "absolute",
    }
  },
  clip: {
    borderTopLeftRadius: "4px 4px",
    borderTopRightRadius: "4px 4px",
    width: 12,
    height: 10,
    backgroundColor: ({ color }) => color,
  },
  event: {
    height: "100%",
    width: "100%",
    color: ({ color }) => color,
  },
  top: {
    display: "flex",
    justifyContent: "space-around",
  },
  label: {
    backgroundColor: ({ color }) => color,
    height: "20%",
    color: "#fff",
    letterSpacing: 1,
    fontSize: 10,
    padding: "3px 8px",
  },
  backButton: {
    position: "fixed",
    top: 72,
    right: PREVIEW_WIDTH - 32,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
  },
}))

export default function SmartEvent({ event, children, handleOpenTeam }) {
  const { smart_folder, artist } = event
  const type = smart_folder?.type || ""
  const Icon = folderIcons[type]

  const classes = useStyles({
    color: folderColors[type],
  })

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.top}>
          <div className={classes.clip}></div>
          <div className={classes.clip}></div>
        </div>
        <Card
          variant="outlined"
          className={classes.card}
        >
          <div className={classes.square}>
            <div className={classes.avatarWrapper}>
              <div className={classes.label}>
                {folderLabels[type]}
              </div>
              <Avatar
                {...avatarProps}
                variant="square"
                src={artist?.picture}
                className={classes.avatar}
              >
                <Icon />
              </Avatar>
            </div>
          </div>
        </Card>
      </div>
      <ButtonBack className={classes.backButton} />
      <div className={classes.content}>
        <Typography className={classes.title} noWrap>
          {smart_folder.name}
        </Typography>
        <ButtonTeam
          event={event}
          handleOpenTeam={handleOpenTeam}
        />
        <Box pt={0.75} />
        {children}
      </div>
    </div>
  )
}