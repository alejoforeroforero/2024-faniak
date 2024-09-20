import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import DialogExport from '../DialogExport';
import { buildDocument } from '../../../api/google/buildDocument';

export default function FromTemplateDialog({
  defaultParentId,
  folder,
  fileKey,
  handleClose,
  fetchContent,
}) {
  const { enqueueSnackbar } = useSnackbar()

  // returns true if successful
  const exportDocument = useCallback(async (type, params = {}) => {
    enqueueSnackbar("Creating template...", { variant: "info" })

    const folder_reference = folder.google_event_id ? {
      event_params: {
        eventId: folder.google_event_id,
        calendarId: "primary",
      }
    } : {
      folder_id: folder.id,
    }

    return await buildDocument({
      ...folder_reference,
      type: type,
      params,
    })
      .then(res => {
        if (res.error) {
          enqueueSnackbar("Google services seem to be unavailable...", { variant: "error" })
          return false
        }
        window.open(res.file.webViewLink, '_blank')?.focus()
        enqueueSnackbar("Document saved", { variant: "success" })
        fetchContent()

        return true
      })
  }, [folder, enqueueSnackbar, fetchContent])


  return (
    <DialogExport
      fileKey={fileKey}
      defaultParentId={defaultParentId}
      exportDocument={exportDocument}
      handleClose={handleClose}
    />
  )
}