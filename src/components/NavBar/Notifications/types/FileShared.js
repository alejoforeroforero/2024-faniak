import { Box, Button, Card, CircularProgress, IconButton, Tooltip, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'
import { useContext, useEffect, useState } from 'react'
import { createFile } from '../../../../api/drive/createFile'
import { getFile } from '../../../../api/drive/getFile'
import { getChildrenFiles } from '../../../../api/drive/getFiles'
import { getMimeType, getTargetFile, googleMimeTypes } from '../../../../api/google/store'
import { openNotification } from '../../../../api/member/openNotification'
import { DispatchContext, StateContext } from '../../../../store'
import DriveIcon from '../../../../svg/DriveIcon'
import { simplifyDatetime } from '../../../../utils/dateUtils'
import { splitFileName } from '../../../../utils/fileUtils'
import useIsMounted from '../../../../utils/useIsMounted'
import ContainedButton from '../../../ContainedButton'
import FileThumbnail from '../../../FileThumbnail'

const useStyles1 = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: "100%",
  },
  buttons: {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    marginTop: 24,
  },
  loadingWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
  },
}))

export default function FileShared({ notification }) {
  const { enqueueSnackbar } = useSnackbar()
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const classes = useStyles1()
  const isMounted = useIsMounted()

  const [error, setError] = useState(false)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFile({ id: notification.data.file_id })
      .then(res => {
        if (res.error) {
          setError(true)
          return
        }
        if (!isMounted()) return
        setFile(res.file)
        setLoading(false)
      })
  }, [notification])

  const addShortcut = () => {
    setLoading(true)
    createFile({
      resource: {
        name: file.name,
        mimeType: googleMimeTypes.SHORTCUT,
        parents: [state.user.google_root_folder_id],
        shortcutDetails: {
          targetId: file.id,
        }
      }
    }).then(res => {
      if (res.error) return
      setLoading(false)
      enqueueSnackbar("This file has been added to your Music Drive.", { variant: "success" })

      // refresh page (fetching will be ignored if we're not in the root folder)
      getChildrenFiles({ id: state.user.google_root_folder_id }, { includeThumbnails: true })
        .then(res => {
          if (!isMounted()) return

          const folders = []
          const files = []

          for (const file of res.files) {
            if (getMimeType(file) === googleMimeTypes.FOLDER) {
              folders.push(file)
            } else {
              files.push(file)
            }
          }

          dispatch({
            type: 'UPDATE_CHILDREN',
            data: {
              parent_id: state.user.google_root_folder_id,
              files: folders.concat(files)
            }
          })
        })
    })
  }

  return (
    <div className={classes.root}>
      {file ? (
        <File file={file} />
      ) : (
        <div className={classes.loadingWrapper}>
          {error ? (
            <div>
              {"You lost connection to the file :("}
            </div>
          ) : (
            <CircularProgress size={24} />
          )}
        </div>
      )}
      <div className={classes.buttons}>
        <ContainedButton
          onClick={addShortcut}
          size="small"
          loading={loading}
          disabled={error}
        >
          Add to dashboard
        </ContainedButton>
      </div>
    </div>
  )
}

const useStyles2 = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    '& .stats': {
      maxWidth: `calc(100% - ${avatarSize}px)`,
      paddingLeft: 8,
      paddingRight: 8,
      flexGrow: 1,
      overflow: "hidden",
      '& .name': {
        lineHeight: 0,
      }
    },
    '& .MuiIconButton-root': {
      display: "none",
      marginRight: 8,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      '& .MuiIconButton-root': {
        display: "block",
      },
    },
  },
  subtitle: {
    fontSize: 11,
  },
  fileName: {
    fontSize: 14,
    display: "inline-block",
    maxWidth: "100%",
    paddingRight: theme.spacing(4),
    overflow: "hidden",
    textOverflow: "ellipsis",
    position: "relative",
    whiteSpace: "nowrap",
    textAlign: "center",
    fontWeight: 600,
  },
  extension: {
    position: "absolute",
    top: 0,
    right: 0,
    width: theme.spacing(4),
    textAlign: "left",
  },
}))

const avatarSize = 45

function File({ file }) {
  const classes = useStyles2()
  const [name, extension] = splitFileName(file.name)

  return (
    <Card variant="outlined" className={classes.root}>
      <FileThumbnail file={file} />

      <div className="stats">
        <div className="name">
          <Typography className={classes.fileName}>
            {name}<span className={classes.extension}>.{extension}</span>
          </Typography>
        </div>
        <Typography component="div" noWrap className={classes.subtitle}>
          {simplifyDatetime(file.modifiedTime)}
        </Typography>
      </div>

      <Tooltip title="Open in Google Drive">
        <IconButton
          component="a"
          href={getTargetFile(file).webViewLink}
          target="_blank"
          color="primary"
          size="small"
        >
          <DriveIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Card>
  )
}
