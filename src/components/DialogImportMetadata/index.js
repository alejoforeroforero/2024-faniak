import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Typography,
  Box,
  Divider,
} from '@material-ui/core'
import BaseDialog from '../BaseDialog'
import BaseDialogTitle from '../BaseDialogTitle'
import BaseDialogActions from '../BaseDialogActions'
import ContainedButton from '../ContainedButton'
import { DispatchContext, StateContext } from '../../store'
import { getSpotifyReleases } from '../../api/connections/getSpotifyReleases'
import { getDiscogsReleases } from '../../api/connections/getDiscogsReleases'
import { connectionNames } from '../../dictionary/connection'
import { getAlbumChunks, getProcessFunction, prepareSubmission } from './prepareSubmission'
import { addAlbumsAndSongs } from '../../api/drive/addAlbumsAndSongs'
import Content from './Content'
import Filters from './Filters'
import { onboardingEvents, skipOnboarding } from '../Onboarding'
import { useSnackbar } from 'notistack'
import { runBackgroundJob } from '../../utils/backgroundUtils'
import { showSubscriptionLimits } from '../DialogSubscriptions'

const delay = 1500

export default function DialogImportMetadata({
  folder,
  source,
  handleClose,
  callback,
}) {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const { enqueueSnackbar } = useSnackbar()

  const connection = folder.data.connections[source]

  const [updating, setUpdating] = useState(true)
  const [results, setResults] = useState([])

  const smart_folders = useMemo(() => {
    const data = {
      current: state.user.current_smart_folders,
      max: state.user.max_smart_folders,
      selected: results.reduce((acc, curr) => {
        if (!curr.selected) return acc
        return acc + curr.common.n_tracks + 1
      }, 0),
    }

    data.available = data.max - (data.selected + data.current)

    return data
  }, [results])

  // const fetchDiscogs = useCallback(() => {
  //   runBackgroundJob({
  //     apiFunction: getDiscogsReleases,
  //     apiPayload: { source_id: connection?.id },
  //     processResponse: (res) => {
  //       if (res.error) {
  //         enqueueSnackbar("Something went wrong :(", { variant: "error" })
  //         handleClose()
  //         return
  //       }

  //       if (res.results?.length) {
  //         setResults(prev => res.results.map((result, i) => ({
  //           selected: true,
  //           ...result,
  //           ...(prev[i] || {})
  //         })))
  //       }

  //       if (res.is_updating) {
  //         setUpdating(false)

  //         if (!results.length && !res.results.length) {
  //           enqueueSnackbar("We couldn't find any releases...", { variant: "info" })
  //           handleClose()
  //         }
  //       }
  //     },
  //     delay: 1500,
  //   })
  // }, [connection?.id, handleClose, results])

  const fetchSpotify = useCallback(() => {
    getSpotifyReleases({ source_id: connection?.id })
      .then(res => {
        setUpdating(false)

        if (res.error) {
          enqueueSnackbar("Something went wrong :(", { variant: "error" })
          return
        }

        if (res.results.length) {
          setResults(res.results.map(result => ({ ...result, selected: true })))
        } else {
          handleClose()
        }
      })
  }, [connection?.id, handleClose])

  useEffect(() => {
    switch (source) {
      // case connectionNames.DISCOGS: fetchDiscogs(); break;
      case connectionNames.SPOTIFY: fetchSpotify(); break;
      default: break;
    }
  }, [])

  const process = async () => {
    if (smart_folders.max > 0 && smart_folders.available < 0) {
      showSubscriptionLimits(dispatch)
      enqueueSnackbar("You have selected to many albums.", { variant: "warning" })
      return
    }

    enqueueSnackbar("Fetching more metadata for your albums...")
    handleClose()

    const parser = getProcessFunction(source)
    const parent_id = folder.google_folder_id

    lockParentId(parent_id, dispatch)

    parser({ results, folder })
      .then(albums => {
        prepareSubmission({ parent_id, albums })
          .then(submit)
      })
  }

  const submit = async ({ albums, parent_id }) => {
    enqueueSnackbar("Applying changes to your catalog...")

    for (const chunk of getAlbumChunks(albums)) {
      await runBackgroundJob({
        apiFunction: addAlbumsAndSongs,
        apiPayload: {
          albums: chunk,
          parent_id: parent_id
        },
        processResponse: (res) => {
          if (res.error) {
            enqueueSnackbar("Some of your albums cound not be loaded...", { variant: "error" })
            return
          }
          enqueueSnackbar(`${chunk.length} albums have been successfully loaded.`)
        },
        delay: 2000,
      })
    }

    enqueueSnackbar(`Your catalog is ready!`, { variant: "success" })

    unlockParentId(parent_id, dispatch)

    callback?.()

    skipOnboarding(dispatch, onboardingEvents.IMPORT_METADATA)
  }

  return (
    <BaseDialog maxWidth="md">
      <BaseDialogTitle handleClose={handleClose}>
        {updating
          ? "Fetching your albuns..."
          : "Select which albums you want to import"}
      </BaseDialogTitle>

      <Filters results={results} setResults={setResults} />

      <div style={{ paddingBottom: 12 }}>
        <Divider />
      </div >

      <Content updating={updating} results={results} setResults={setResults} />

      <BaseDialogActions>
        {(smart_folders.max > 0 && smart_folders.available < 0) && (
          <Typography variant="body2">
            You have too many Smart Folders selected.
          </Typography>
        )}
        <Box pl={1} />
        <ContainedButton
          onClick={process}
          loading={updating}
          disabled={!smart_folders.selected}
        >
          These are my albums!
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog>
  )
}

const lockParentId = (parent_id, dispatch) => {
  dispatch({
    type: "UPDATE",
    set: (prev) => {
      prev.locked_parent_file_ids = [...prev.locked_parent_file_ids, parent_id]
      return { ...prev }
    }
  })
}

const unlockParentId = (parent_id, dispatch) => {
  dispatch({
    type: "UPDATE",
    set: (prev) => {
      prev.locked_parent_file_ids = prev.locked_parent_file_ids.filter(id => id !== parent_id)
      return { ...prev }
    }
  })
}