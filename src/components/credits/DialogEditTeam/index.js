import { useEffect, useState } from 'react';
import { Box, CircularProgress, DialogContent } from '@material-ui/core'
import ContainedButton from '../../ContainedButton'
import BaseDialogActions from '../../BaseDialogActions'
import TeamEditor from '../TeamEditor'
import { createCredit } from '../../../api/credit/create'
import { deleteCredit } from '../../../api/credit/delete'
import { updateCredit } from '../../../api/credit/update'
import BaseDialogTitle from '../../BaseDialogTitle'
import BaseDialog from '../../BaseDialog'
import { folderTypes } from '../../../dictionary/folder'
import { createPermission } from '../../../api/drive/createPermission'
import { deletePermission } from '../../../api/drive/deletePermission'
import { updatePermission } from '../../../api/drive/updatePermission'
import { useSnackbar } from 'notistack'
import ButtonCopyLink from './ButtonCopyLink'
import { updateEvent } from '../../../api/calendar/updateEvent'
import { canEditFile, getId, getTargetFile } from '../../../api/google/store'
import { getFolderCredits } from '../../../api/drive/getFolderCredits'
import { zipTeam } from '../../../utils/teamUtils'
import { setFileIsShared } from '../../../utils/fileUtils'

const getSmartFolder = (file, event) => {
  if (file) return file.smart_folder
  if (event) return event.smart_folder
  return null
}

const getFolderReference = (file, event) => event ? {
  event_params: {
    eventId: event.id,
    calendarId: "primary",
  }
} : {
  folder_id: file.smart_folder.id,
}

const folderSupportsSplits = (folder) => {
  switch (folder?.type) {
    case folderTypes.SONG:
    case folderTypes.ALBUM:
    case folderTypes.ARTIST: return true
    default: false
  }
}

export default function DialogEditTeam({ initial, handleClose, fetchContent, fetchEvent, file, event }) {
  const fileMode = !!file
  const folder = getSmartFolder(file, event)
  const disableCredits = !folder
  const showSplits = folderSupportsSplits(folder)
  const canEditPermissions = fileMode ? canEditFile(getTargetFile(file)) : false

  const { enqueueSnackbar } = useSnackbar()
  const [submitting, setSubmitting] = useState(false)
  const [team, setTeam] = useState(null)

  const setInitialTeam = async () => {
    if (initial) {
      setTeam(deepcopy(initial))
      return
    }

    const data = {
      credits: [],
      permissions: fileMode ? getTargetFile(file).permissions : [],
      attendees: !fileMode ? event.attendees : [],
    }

    if (!disableCredits) {
      const reference = getFolderReference(file, event)
      await getFolderCredits(reference)
        .then(res => {
          if (res.error) {
            enqueueSnackbar("We were unable to load your credits.", { variant: "error" })
            return
          }
          data.credits = res.credits
        })
    }

    setTeam(deepcopy(zipTeam(data)))
  }

  useEffect(() => {
    setInitialTeam()
  }, [])

  const handleSave = () => {
    setSubmitting(true)
    const promises = []

    if (!disableCredits) {
      const reference = getFolderReference(file, event)
      promises.push(saveCredits(team.credits, reference))
    }

    if (fileMode) {
      promises.push(savePermissions(team.permissions, file, enqueueSnackbar))
    } else {
      promises.push(saveAttendees(team.attendees, event))
    }

    Promise.all(promises).then(() => {
      enqueueSnackbar("Team saved", { variant: "success" })
      if (fileMode) {
        fetchContent()
      } else {
        fetchEvent(event.id)
      }
      handleClose()
    })
  }

  return (
    <BaseDialog maxWidth="sm">
      <BaseDialogTitle handleClose={handleClose}>
        Share {disableCredits ? "" : "& Credit"}
      </BaseDialogTitle>

      <DialogContent>
        {team ? (
          <TeamEditor
            fileMode={fileMode}
            showSplits={showSplits}
            team={team}
            setTeam={setTeam}
            disableCredits={disableCredits}
            canEditPermissions={canEditPermissions}
          />
        ) : (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
      </DialogContent>

      <BaseDialogActions>
        {!!team && fileMode && (
          <ButtonCopyLink
            enqueueSnackbar={enqueueSnackbar}
            canEditPermissions={canEditPermissions}
            file={file}
          />
        )}
        <ContainedButton loading={submitting || !team} onClick={handleSave}>
          Save
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog>
  )
}

const deepcopy = (obj) => JSON.parse(JSON.stringify(obj))

const saveCredits = async (list, references) => {
  const promises = []

  for (const person of list) {
    if (person.is_deleted && !person.id) continue

    // person yet to be added
    if (!person.id) {
      promises.push(
        createCredit({ ...person, ...references })
      )
    }
    // person has been deleted
    else if (person.is_deleted) {
      promises.push(
        deleteCredit({ ...person, ...references })
      )
    }
    // person has been updated
    else if (person.is_touched) {
      promises.push(
        updateCredit({ ...person, ...references }, {
          updateIdentity: person.update_identity
        })
      )
    }
  }

  await Promise.all(promises)
}

const savePermissions = async (list, file, enqueueSnackbar) => {
  setFileIsShared(getTargetFile(file))

  const promises = []

  for (const permission of list) {
    if (permission.is_deleted && !permission.id) continue

    // permission yet to be added
    if (!permission.id) {
      promises.push(
        createPermission({ ...permission, fileId: getId(file) })
          .then((res) => {
            if (res.error) return
            enqueueSnackbar(`We have sent an invitation email to ${permission.emailAddress}`, { variant: "info" })
          })
      )
    }
    // permission has been deleted
    else if (permission.is_deleted) {
      promises.push(
        deletePermission({ ...permission, fileId: getId(file) })
      )
    }
    // permission has been updated
    else if (permission.is_touched) {
      promises.push(
        updatePermission({ ...permission, fileId: getId(file) }, {
          updateIdentity: permission.update_identity
        })
      )
    }
  }

  await Promise.all(promises)
}

const saveAttendees = async (list, event) => {
  await updateEvent({
    event_params: {
      eventId: event.id,
      calendarId: "primary",
    },
    resource: {
      attendees: list.filter(item => !item.is_deleted)
    },
  })
}