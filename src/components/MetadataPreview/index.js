import { useCallback, useContext, useMemo, useState } from 'react';
import { StateContext, PREVIEW_WIDTH } from '../../store'
import { makeStyles } from '@material-ui/core/styles'
import {
  CircularProgress,
  Drawer,
} from '@material-ui/core'
import PreviewFile from './PreviewFile'
import PreviewUser from './PreviewUser'
import PreviewArtist from './PreviewArtist'
import PreviewSong from './PreviewSong'
import PreviewAlbum from './PreviewAlbum'
import PreviewGigLegacy from './PreviewGigLegacy'
import PreviewGig from './PreviewGig'
import { folderTypes } from '../../dictionary/folder'
import PreviewEvent from './PreviewEvent'
import { canEditFile, getTargetFile } from '../../api/google/store'
import DialogEditTeam from '../credits/DialogEditTeam';

function RouteFile(props) {
  const folder = props.file.smart_folder
  if (!folder) return <PreviewFile {...props} />
  if (folder.type === folderTypes.SONG) return <PreviewSong {...props} />
  if (folder.type === folderTypes.ALBUM) return <PreviewAlbum {...props} />
  if (folder.type === folderTypes.ARTIST) return <PreviewArtist {...props} />
  if (folder.type === folderTypes.GIG) return <PreviewGigLegacy {...props} />
  return null
}

function RouteEvent(props) {
  const folder = props.event.smart_folder
  if (!folder) return <PreviewEvent {...props} />
  if (folder.type === folderTypes.GIG) return <PreviewGig {...props} />
  return null
}

const useStyles = makeStyles((theme) => ({
  hide: {
    display: 'none',
  },
  drawer: {
    width: PREVIEW_WIDTH,
    zIndex: theme.zIndex.drawer - 1,
    flexShrink: 0,
  },
  drawerPaper: {
    width: PREVIEW_WIDTH,
  },
  loading: {
    backgroundColor: theme.palette.background.paper,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}))

export default function MetadataPreview({ loading, fetchFolder, fetchChildren, fetchEvent }) {
  const classes = useStyles()
  const state = useContext(StateContext)
  const { selected_file, selected_event, curr_folder, user } = state

  const [showDialog, setShowDialog] = useState(false)
  const handleOpenTeam = useCallback(() => setShowDialog(true), [])
  const handleCloseTeam = useCallback(() => setShowDialog(false), [])

  const getContent = () => {
    const props = { handleOpenTeam }
    var route

    if (selected_file) {
      props.fetchContent = fetchChildren
      props.file = selected_file
      props.canEdit = canEditFile(getTargetFile(selected_file))
      route = <RouteFile {...props} />
    } else if (selected_event) {
      props.fetchEvent = fetchEvent
      props.event = selected_event
      route = <RouteEvent {...props} />
    } else if (curr_folder && user.google_root_folder_id !== curr_folder.id) {
      props.fetchContent = fetchFolder
      props.file = curr_folder
      props.canEdit = canEditFile(getTargetFile(curr_folder))
      route = <RouteFile {...props} />
    }

    if (route) return (<>
      {route}
      {showDialog && <DialogEditTeam {...props} handleClose={handleCloseTeam} />}
    </>)

    return <PreviewUser />
  }

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="right"
      open
      classes={{ paper: classes.drawerPaper }}
    >
      {loading ? (
        <div className={classes.loading}>
          <CircularProgress size={40} />
        </div>
      ) : getContent()}
    </Drawer>
  )
}