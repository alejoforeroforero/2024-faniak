import {
  Box,
  Button,
  Card,
  CardActionArea,
  DialogContent, Typography,
} from '@material-ui/core'
import ContainedButton from '../../ContainedButton'
import BaseDialogActions from '../../BaseDialogActions'
import BaseDialogTitle from '../../BaseDialogTitle'
import BaseDialog from '../../BaseDialog'
import { useSnackbar } from 'notistack'
import { useContext, useEffect, useState } from 'react'
import MenuFileSelection from '../../MenuFileSelection'
import { getInitialMenuState, getOpenMenuHandler } from '../../BaseMenu'
import { getTargetFile, googleMimeTypes } from '../../../api/google/store'
import { getFile } from '../../../api/drive/getFile'
import { StateContext } from '../../../store'
import FileThumbnail from '../../FileThumbnail'
import { buildDocument } from '../../../api/google/buildDocument'
import { updateEvent } from '../../../api/calendar/updateEvent'

const getFileKeyLabel = (fileKey) => {
  switch (fileKey) {
    case "run_sheet": return "run sheet"
    default: return "document"
  }
}

export default function DialogExport({ file, event, handleClose, fetchContent, fileKey, defaultParentId, canEdit }) {
  const folder = file?.smart_folder || event?.smart_folder
  const state = useContext(StateContext)
  const [submitting, setSubmitting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [parent, setParent] = useState(null)
  const [selectionMenu, setSelectionMenu] = useState(getInitialMenuState())
  const openSelectionMenu = getOpenMenuHandler(setSelectionMenu)

  const submit = async () => {
    setSubmitting(true)

    enqueueSnackbar("Creating template...", { variant: "info" })

    const folder_reference = folder.google_event_id ? {
      event_params: {
        eventId: folder.google_event_id,
        calendarId: "primary",
      }
    } : {
      folder_id: folder.id,
    }

    const res = await buildDocument({
      ...folder_reference,
      type: fileKey,
      params: {
        parent_id: parent.id
      },
    })

    if (res.error) {
      enqueueSnackbar("Google services seem to be unavailable...", { variant: "error" })
      setSubmitting(false)
      return
    }

    window.open(res.file.webViewLink, '_blank')?.focus()
    enqueueSnackbar("Document saved", { variant: "success" })

    if (event && canEdit) {
      await addFileToAttachments(event, res.file, enqueueSnackbar)
    }

    fetchContent()

    handleClose()
  }

  const setInitialCurr = (file) => {
    setParent(file)
  }

  const fetchInitialParent = async (fileId) => {
    return await getFile({ id: fileId }, { includeSmartFolders: true })
      .then(res => {
        if (res.error) return
        return res.file
      })
  }

  const setInitialState = async () => {
    let file = null

    if (defaultParentId) {
      file = await fetchInitialParent(defaultParentId)
    } else if (state.curr_folder) {
      file = state.curr_folder
    }
    if (!file) {
      file = await fetchInitialParent(state.user.google_root_folder_id)
    }

    if (file) {
      setInitialCurr(file)
    } else {
      enqueueSnackbar("Loading failed. Please contact support if error persists.", { variant: "error" })
      handleClose()
    }
  }

  useEffect(() => {
    setInitialState()
  }, [])

  const handleSelectFile = (files) => {
    if (!files.length) return
    const [file] = files

    setParent(getTargetFile(file))
  }

  return (
    <BaseDialog maxWidth="xs">
      <BaseDialogTitle handleClose={handleClose}>
        Create new {getFileKeyLabel(fileKey)}
      </BaseDialogTitle>

      <DialogContent>
        <Typography variant="body1">
          {"We are about to create a Google Sheet containing your metadata."}
        </Typography>

        <Box pb={2} pt={2}>
          <Typography variant="caption" gutterBottom>
            {"Select a destination for the document:"}
          </Typography>
          <Box pt={1} />
          {!!parent && (
            <Card variant="outlined">
              <CardActionArea onClick={openSelectionMenu}>
                <Box display="flex" alignItems="center">
                  <FileThumbnail file={parent} />
                  <Box pl={2} flexGrow={1} overflow="hidden">
                    <Typography variant="body2" noWrap>
                      {parent.name}
                    </Typography>
                  </Box>
                  <Box pl={2} pr={2} flexShrink={0}>
                    <Typography variant="button" color="primary">
                      Change destination
                    </Typography>
                  </Box>
                </Box>
              </CardActionArea>
            </Card>
          )}
        </Box>

        <Typography variant="caption">
          {"To download the document after it has been generated, go to File > Download and select the preferred format."}
        </Typography>
      </DialogContent>

      <BaseDialogActions>
        <ContainedButton
          loading={submitting}
          disabled={!parent}
          onClick={submit}
        >
          Export
        </ContainedButton>
      </BaseDialogActions>

      <MenuFileSelection
        initialParentId={parent?.id || null}
        menuState={selectionMenu}
        setMenuState={setSelectionMenu}
        callback={handleSelectFile}
        mimeType={googleMimeTypes.FOLDER}
      />
    </BaseDialog >
  )
}

const addFileToAttachments = async (event, file, enqueueSnackbar) => {
  const newFile = {
    fileId: file.id,
    title: file.name,
    iconLink: file.iconLink,
    mimeType: file.mimeType,
    fileUrl: file.webViewLink,
  }

  await updateEvent({
    event_params: {
      eventId: event.id,
      calendarId: "primary",
    },
    resource: {
      attachments: [...event.attachments, newFile],
    },
  }).then((res) => {
    if (res.error) {
      enqueueSnackbar("We were unable to update the Google event attachments...", { variant: "error" })
      return
    }
    enqueueSnackbar(`The document has been saved in the event's attachments.`, { variant: "success" })
  })
}