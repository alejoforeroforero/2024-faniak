import { useContext, useEffect, useState } from 'react';
import { DispatchContext, StateContext, REQUIRED_SCOPES, CHROME_EXTENSION_ID } from '../../../store'
import Loading from './Loading'
import Notice from './Notice'
import getMyCredentials from '../../../api/member/getMyCredentials'
import { createRootFolder, refreshUser, scopeIsGranted, setAccessToken } from '../../../utils/authUtils'
import { useSnackbar } from 'notistack'

// fetching credentials every 50 minutes to prevent access tokens expiration
const delay = 50 * 60 * 1000

export default function GoogleSession({ children }) {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  const [error, setError] = useState("")
  const [gapiLoaded, setGapiLoaded] = useState(false)

  const fetchCredentials = () => {
    getMyCredentials()
      .then(res => {
        if (res.error) {
          setError(res.error)
        } else {
          dispatch({ type: 'SET', data: res })
          setAccessToken(res.credentials.access_token)

          const scopeNeeded = REQUIRED_SCOPES.some(scope => !scopeIsGranted(scope, res.credentials.scope))
          if (scopeNeeded) {
            setError("NEEDS_AUTH")
          }
          else if (error) {
            setError("")
          }
        }
        setGapiLoaded(true)
      })
  }

  useEffect(() => {
    const interval = setInterval(fetchCredentials, delay)

    return () => clearInterval(interval)
  }, [])

  const updateMagicSync = () => {
    const setInstalled = (response) => {
      // if response is undefined, it's and automatic response from runtime, not from magic sync
      if (response === undefined) return

      dispatch({
        type: 'SET', data: {
          magic_sync_installed: true
        }
      })
    }

    window.chrome?.runtime?.sendMessage(CHROME_EXTENSION_ID, { code: "HEARTBEAT" }, setInstalled);
  }

  useEffect(() => {
    gapi.load('client:drive-share', fetchCredentials)
    refreshUser(dispatch)
    updateMagicSync()
  }, [])

  if (!gapiLoaded || !state.user.id) return <Loading />

  if (error) return <Notice error={error} fetchCredentials={fetchCredentials} />

  // only runs if user already authorized the required scopes
  if (!state.user.google_root_folder_id) return <AuthorizedLoading />

  return children
}

function AuthorizedLoading() {
  const dispatch = useContext(DispatchContext)
  const { enqueueSnackbar } = useSnackbar()

  const createRoot = async () => {
    const folder_id = await createRootFolder()

    console.log({ folder_id })

    if (folder_id) {
      dispatch({
        type: "UPDATE",
        set: (state) => {
          state.user.google_root_folder_id = folder_id
          return { ...state }
        }
      })
    } else {
      enqueueSnackbar("We were unable to communicate with Google Drive.", { variant: "error" })
    }
  }

  useEffect(() => {
    createRoot()
  }, [])

  return <Loading />
}