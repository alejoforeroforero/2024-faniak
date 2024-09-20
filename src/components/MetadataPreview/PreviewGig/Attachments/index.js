import { useMemo, useState } from 'react';
import {
  Button, Card,
} from '@material-ui/core'
import PreviewSection from '../../PreviewSection'
import Attachment from './Attachment'
import AddIcon from '@material-ui/icons/Add'
import { updateEvent } from '../../../../api/calendar/updateEvent'
import { useSnackbar } from 'notistack'
import MenuFileSelection from '../../../MenuFileSelection'
import { getInitialMenuState, getOpenMenuHandler } from '../../../BaseMenu'
import { getId, getMimeType, googleMimeTypes } from '../../../../api/google/store'
import { useHistory } from 'react-router-dom'
import { routes } from '../../../../Routes'

export default function Attachments({ refreshEvent, event, isOrganizer }) {
  const { smart_folder, artist } = event
  const { enqueueSnackbar } = useSnackbar()
  const history = useHistory()

  const [selectionMenu, setSelectionMenu] = useState(getInitialMenuState())
  const openSelectionMenu = getOpenMenuHandler(setSelectionMenu)

  const openFile = (file) => {
    if (file.mimeType === googleMimeTypes.FOLDER) {
      history.push(routes.folder(file.fileId))
      return
    }
    window.open(file.fileUrl, '_blank').focus()
  }

  const removeFile = (file) => {
    const newAttachments = event.attachments.filter(attachment => attachment !== file)
    updateEvent({
      event_params: {
        eventId: event.id,
        calendarId: "primary",
      },
      resource: {
        attachments: newAttachments,
      },

    }).then((res) => {
      if (res.error) {
        enqueueSnackbar("We were unable to update the Google event...", { variant: "error" })
        return
      }
      enqueueSnackbar(`${file.title} has been removed from this event.`, { variant: "success" })
      refreshEvent()
    })
  }

  const addFiles = (files) => {
    if (!files.length) return

    const newFiles = files.map((file) => ({
      fileId: getId(file),
      title: file.name,
      iconLink: file.iconLink,
      mimeType: getMimeType(file),
      fileUrl: file.webViewLink,
    }))
    const newAttachments = [...event.attachments, ...newFiles]

    updateEvent({
      event_params: {
        eventId: event.id,
        calendarId: "primary",
      },
      resource: {
        attachments: newAttachments,
      },
    }).then((res) => {
      if (res.error) {
        enqueueSnackbar("We were unable to update the Google event...", { variant: "error" })
        return
      }
      const msg = files.length === 1
        ? `${files[0].name} has been added to this event.`
        : `Your files have been added to this event.`
      enqueueSnackbar(msg, { variant: "success" })
      refreshEvent()
    })
  }

  const actions = useMemo(() => {
    if (!event.attachments.length) return []
    return [{
      label: "Add file",
      icon: AddIcon,
      disabled: !isOrganizer,
      callback: openSelectionMenu,
    }]
  }, [event.attachments])

  return (
    <PreviewSection
      text="Attachments"
      actions={actions}
    >
      <Card variant="outlined">
        {event.attachments.length ? (
          <div style={{ paddingBottom: 4, paddingTop: 4 }}>
            {event.attachments.map(
              (file, i) => (
                <Attachment
                  key={i}
                  isOrganizer={isOrganizer}
                  isFolder={file.mimeType === googleMimeTypes.FOLDER}
                  openFile={openFile}
                  removeFile={removeFile}
                  file={file}
                />
              )
            )}
          </div>
        ) : (
          <Button
            disabled={!isOrganizer}
            fullWidth
            color="primary"
            onClick={openSelectionMenu}
          >
            Add file
          </Button>
        )}
      </Card>

      <MenuFileSelection
        initialParentId={Boolean(artist) && artist.google_folder_id}
        menuState={selectionMenu}
        setMenuState={setSelectionMenu}
        callback={addFiles}
        multiple
      />
    </PreviewSection>)
}