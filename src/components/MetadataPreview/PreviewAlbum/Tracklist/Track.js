import { makeStyles } from '@material-ui/core/styles'
import { IconButton, Tooltip, Typography } from '@material-ui/core'
import PlayIcon from '@material-ui/icons/PlayCircleFilled'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import { useHistory } from 'react-router-dom'
import { prettifySeconds } from '../../../../utils/dateUtils'
import { routes } from '../../../../Routes'
import { getFile } from '../../../../api/drive/getFile'
import SpotifyIcon from '../../../../svg/SpotifyIcon'
import { useCallback, useState } from 'react'
import DialogLyrics from '../../DialogLyrics'
import SubjectIcon from '@material-ui/icons/Subject'

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    minHeight: 36,
    paddingLeft: 12,
    paddingRight: 4,
    fontSize: 13,
    '& .duration': {
      paddingRight: 8,
    },
    '& .MuiIconButton-root': {
      margin: '-6px 0px',
      padding: 6,
      display: "none",
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      '& .MuiIconButton-root': {
        display: "block",
      },
      '& .duration': {
        display: "none",
      },
    },
  },
  left: {
    flexGrow: 1,
    overflow: "hidden",
  },
  title: {
    maxWidth: 200,
  },
}))

export default function Track({ track, track_index }) {
  const history = useHistory()
  const classes = useStyles()
  const [showLyrics, setShowLyrics] = useState(false)
  const handleOpenLyrics = useCallback(() => setShowLyrics(true), [])
  const handleCloseLyrics = useCallback(() => setShowLyrics(false), [])

  const {
    duration_in_s,
    title,
    audio,
    connections,
    lyrics,
  } = track.folder.data

  const duration = prettifySeconds(duration_in_s || 0)
  const track_has_audio = Boolean(audio?.id)

  const playAudio = (event) => {
    event.stopPropagation()

    getFile({ id: audio.id })
      .then(res => {
        if (res.error) return
        window.open(res.file.webViewLink, '_blank').focus()
      })
  }

  const redirect = (event) => {
    history.push(routes.folder(track.folder.google_folder_id))
  }

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <Typography
          noWrap
          variant="body2"
          className={classes.title}
        >
          {track_index + 1}. {title}
        </Typography>
      </div>
      <div className='duration'>{duration}</div>

      {!!connections?.spotify?.url && (
        <Tooltip title="Open in Spotify">
          <div>
            <IconButton
              size="small"
              color="primary"
              component="a"
              href={connections.spotify.url}
              target="_blank"
            >
              <SpotifyIcon fontSize="small" />
            </IconButton>
          </div>
        </Tooltip>
      )}

      <Tooltip title={track_has_audio ? "Open audio file" : "No audio file available"}>
        <div>
          <IconButton
            size="small"
            color="primary"
            onClick={playAudio}
            disabled={!track_has_audio}
          >
            <PlayIcon fontSize="small" />
          </IconButton>
        </div>
      </Tooltip>

      <Tooltip title={lyrics ? "Open lyrics" : "No lyrics available"}>
        <div>
          <IconButton
            size="small"
            color="primary"
            onClick={handleOpenLyrics}
            disabled={!lyrics}
          >
            <SubjectIcon fontSize="small" />
          </IconButton>
        </div>
      </Tooltip>

      <Tooltip title="Open folder">
        <div>
          <IconButton
            size="small"
            color="primary"
            onClick={redirect}
          >
            <FolderOpenIcon />
          </IconButton>
        </div>
      </Tooltip>

      {showLyrics && (
        <DialogLyrics
          song={track.folder}
          handleClose={handleCloseLyrics}
        />
      )}
    </div>
  )
}