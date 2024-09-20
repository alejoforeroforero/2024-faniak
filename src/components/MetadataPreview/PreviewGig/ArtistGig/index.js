import { useCallback, useEffect, useMemo, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit'
import {
  getInitialMenuState,
  getOpenMenuHandler
} from '../../../BaseMenu'
import {
  Box,
  Button,
  Card,
  CircularProgress
} from '@material-ui/core'
import { createArtistGig } from '../../../../api/relation/create'
import { deleteRelation } from '../../../../api/relation/delete'
import { folderTypes } from '../../../../dictionary/folder'
import MenuFileSelection from '../../../MenuFileSelection'
import PreviewSection from '../../PreviewSection'
import Artist from './Artist'
import { updateFolder } from '../../../../api/folder/update'
import { useSnackbar } from 'notistack'
import { conditionalGigUpdate } from '../../../../utils/eventUtils'

export default function ArtistGig({ isOrganizer, refreshEvent, artistGig, event }) {
  const [selectionMenu, setSelectionMenu] = useState(getInitialMenuState())
  const openSelectionMenu = useCallback(getOpenMenuHandler(setSelectionMenu), [])
  const { enqueueSnackbar } = useSnackbar()
  const [submitting, setSubmitting] = useState(true)

  useEffect(() => {
    setSubmitting(false)
  }, [artistGig])

  const event_params = {
    eventId: event.id,
    calendarId: "primary",
  }

  const changeArtist = async (files) => {
    if (!files.length) return
    setSubmitting(true)

    const [artist_file] = files

    if (artistGig) {
      deleteRelation({
        relation_id: artistGig.relation.id,
        event_params,
      })
    }

    var res = {}

    const printError = (error) => {
      setSubmitting(false)
      if (error === "GOOGLE_ERROR") {
        return enqueueSnackbar("Google seems to be asleep... Try again later.", { variant: "error" })
      }
      return enqueueSnackbar("Something went wrong... Please contact support.", { variant: "error" })
    }

    res = await createArtistGig({
      parent_folder: {
        folder_id: artist_file.smart_folder.id,
      },
      child_folder: {
        event_params,
      }
    })
    if (res.error) return printError(res.error)

    const new_folder_data = {
      artist_name: artist_file.smart_folder.name,
      artist_id: artist_file.smart_folder.id,
    }

    res = await updateFolder({
      event_params,
      data: new_folder_data,
    })
    if (res.error) return printError(res.error)

    await conditionalGigUpdate(event, new_folder_data)
    if (res.error) return printError(res.error)

    refreshEvent()
  }

  const actions = useMemo(() => {
    const list = []

    if (artistGig) {
      list.push({
        label: "Change artist",
        disabled: !isOrganizer,
        icon: EditIcon,
        callback: openSelectionMenu
      })
    }

    return list
  }, [artistGig, isOrganizer])

  return (
    <PreviewSection
      text="Performer"
      actions={actions}
    >
      {submitting ? (
        <Box display="flex" alignItems="center" justifyContent="center" height={44}>
          <CircularProgress />
        </Box>
      ) : (
        <Card variant="outlined">
          {
            artistGig ? (
              <Artist folder={artistGig.folder} />
            ) : (
              <Button
                color="primary"
                fullWidth
                disabled={!isOrganizer}
                onClick={openSelectionMenu}
              >
                Add Artist
              </Button>
            )
          }
        </Card >
      )}


      <MenuFileSelection
        menuState={selectionMenu}
        setMenuState={setSelectionMenu}
        callback={changeArtist}
        smartFolderType={folderTypes.ARTIST}
      />
    </PreviewSection >
  )
}