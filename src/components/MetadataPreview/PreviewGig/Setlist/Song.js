import { makeStyles } from '@material-ui/core/styles'
import { Box, Divider, IconButton, Tooltip, Typography } from '@material-ui/core'
import PlayIcon from '@material-ui/icons/PlayCircleFilled'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import { useHistory } from 'react-router-dom'
import { prettifySeconds } from '../../../../utils/dateUtils'
import { routes } from '../../../../Routes'
import { getFile } from '../../../../api/drive/getFile'
import { useCallback, useState } from 'react'
import SpotifyIcon from '../../../../svg/SpotifyIcon'
import SubjectIcon from '@material-ui/icons/Subject'
import DialogLyrics from '../../DialogLyrics'

const useStyles = makeStyles((theme) => ({
  row: {
    display: "flex",
    alignItems: "center",
    minHeight: 36,
    paddingLeft: 12,
    paddingRight: 4,
    fontSize: 13,
    '& .duration': {
      paddingRight: 8,
    },
    '&:last-child td': {
      borderBottom: "none"
    },
    '& .MuiIconButton-root': {
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
  title: {
    paddingRight: 8,
    flexGrow: 1,
    overflow: "hidden",
    '& .number': {
      opacity: 0.75,
      fontWeight: 600,
      marginRight: 2,
    },
  },
}))

export default function Song({ song, index, show_encore }) {
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
  } = song.folder.data

  const duration = prettifySeconds(duration_in_s || 0)
  const song_has_audio = Boolean(audio?.id)

  const playAudio = (event) => {
    event.stopPropagation()

    getFile({ id: audio.id })
      .then(res => {
        if (res.error) return
        window.open(res.file.webViewLink, '_blank').focus()
      })
  }

  const redirect = (event) => {
    history.push(routes.folder(song.folder.google_folder_id))
  }

  return (
    <>
      {show_encore && (
        <Box pl={1.5} pr={1.5} width="100%">
          <Divider variant="fullWidth" />
        </Box>
      )}

      <div className={classes.row}>
        <div className={classes.title}>
          <Typography noWrap variant="body2">
            <span className='number'>
              {index + 1}.
            </span>
            {title}
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

        <Tooltip title={song_has_audio ? "Open audio file" : "No audio file available"}>
          <div>
            <IconButton
              size="small"
              color="primary"
              onClick={playAudio}
              disabled={!song_has_audio}
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
            song={song.folder}
            handleClose={handleCloseLyrics}
          />
        )}
      </div>
    </>
  )
}