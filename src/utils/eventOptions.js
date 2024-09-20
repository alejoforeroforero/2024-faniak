import CalendarIcon from "../svg/CalendarIcon"
import MapsIcon from "../svg/MapsIcon"
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined'
import { updateEvent } from "../api/calendar/updateEvent"
import { getEventProps } from "../api/google/store"
import SnackbarWithActions from "../components/SnackbarWithActions"
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import { Button } from "@material-ui/core"
import { getAvailableExportNames, getExportLabel } from "../dictionary/folder"
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined'

export const eventOptions = {}

eventOptions.open = (event) => {
  return {
    label: "Open in Google Calendar",
    icon: CalendarIcon,
    callback: () => {
      const url = event.htmlLink
      window.open(url, '_blank').focus()
    }
  }
}

eventOptions.openLocation = (event) => {
  return {
    label: "Open in Google Maps",
    icon: MapsIcon,
    disabled: !event.location,
    callback: () => {
      const encoded_location = (event.location ?? "")
        .replace(" ", "+")
        .replace("=", "")
        .replace("?", "")
        .replace("|", "")
      const url = `https://www.google.com/maps/search/${encoded_location}`
      window.open(url, '_blank').focus()
    }
  }
}

eventOptions.toggleShow = (event, {
  fetchContent,
  enqueueSnackbar,
}) => {
  const faniakShow = getEventProps.faniakShow(event)
  return {
    label: faniakShow ? "Hide details" : "Show details",
    icon: faniakShow ? VisibilityOffOutlinedIcon : VisibilityOutlinedIcon,
    disabled: !!event.smart_folder,
    callback: () => updateEvent({
      event_params: {
        eventId: event.id,
        calendarId: "primary",
      },
      resource: {
        extendedProperties: {
          private: {
            faniakShow: faniakShow ? "0" : "1"
          }
        }
      },
    })
      .then((res) => {
        if (res.error) {
          enqueueSnackbar?.(`We were unable to update your event.`, { variant: "error" })
          return
        }

        fetchContent?.()
      })
  }
}

eventOptions.share = (event, { setShowDialog }) => {
  return {
    label: "Share",
    icon: PersonAddOutlinedIcon,
    callback: () => setShowDialog(true)
  }
}

eventOptions.cancel = (event, {
  fetchContent,
  dispatch,
  closeSnackbar,
  enqueueSnackbar,
}) => {
  return {
    label: "Delete",
    icon: DeleteOutlineIcon,
    callback: () => updateEvent({
      event_params: {
        eventId: event.id,
        calendarId: "primary",
      },
      resource: {
        status: "cancelled",
      },
    })
      .then((res) => {
        if (res.error) {
          enqueueSnackbar?.(`We were unable to update your event.`, { variant: "error" })
          return
        }

        if (enqueueSnackbar) {
          var snackbarKey = null
          const handleUndo = () => {
            updateEvent({
              event_params: {
                eventId: event.id,
                calendarId: "primary",
              },
              resource: {
                status: "confirmed",
              },
            })
              .then(res => {
                if (res.error) return

                closeSnackbar?.(snackbarKey)
                enqueueSnackbar("Your event has been restored.", { variant: "success" })
                fetchContent?.()
              })
          }

          snackbarKey = enqueueSnackbar(
            <SnackbarWithActions text={`Your event has been cancelled.`}>
              <Button color="primary" onClick={handleUndo}>Undo</Button>
            </SnackbarWithActions>
          )
        }

        fetchContent?.()
        dispatch?.({
          type: "SET",
          data: { selected_event: null }
        })
      })
  }
}

eventOptions.export = (event, { setFileKey }) => {
  const exportNames = getAvailableExportNames(event.smart_folder?.type)
  return {
    label: "Export",
    disabled: !exportNames.length,
    hidden: !event.smart_folder,
    icon: InsertDriveFileOutlinedIcon,
    items: exportNames.map(fileKey => ({
      label: getExportLabel(fileKey),
      callback: () => setFileKey(fileKey),
    })),
  }
}