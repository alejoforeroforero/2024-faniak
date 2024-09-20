import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { PREVIEW_WIDTH } from '../../store'
import { FOLDER_WIDTH } from '../FileSystem'
import Folder from '../Folder'
import ButtonTeam from './ButtonTeam'
import ButtonBack from './ButtonBack'

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

export default function SmartFolder({ children, file, handleOpenTeam }) {
  const classes = useStyles()
  const { smart_folder } = file

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Folder
          folder={smart_folder}
          selected
        />
      </div>
      <ButtonBack className={classes.backButton} />
      <div className={classes.content}>
        <Typography className={classes.title} noWrap>
          {smart_folder.name}
        </Typography>
        <ButtonTeam
          file={file}
          handleOpenTeam={handleOpenTeam}
        />
        <Box pt={0.75} />
        {children}
      </div>
    </div>
  )
}