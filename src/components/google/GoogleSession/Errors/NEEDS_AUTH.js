import { useContext, useEffect, useMemo, useRef } from 'react';
import { Typography } from '@material-ui/core'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import LockIcon from '@material-ui/icons/Lock'
import ButtonGoogle from '../../ButtonGoogle'
import { GOOGLE_SCOPES, REQUIRED_SCOPES, StateContext } from '../../../../store'
import { getAuthorizationClient, scopeIsGranted } from '../../../../utils/authUtils'
import { useSnackbar } from 'notistack'
import ScopeDescription from '../../ScopeDescription'

export default function NEEDS_AUTH() {
  const client = useRef(null)
  const state = useContext(StateContext)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    client.current = getAuthorizationClient(REQUIRED_SCOPES.join(" "), res => {
      if (res.error) {
        switch (res.error) {
          case 'INVALID_ACCOUNT': {
            enqueueSnackbar("You have selected the wrong Google account.", { variant: "error" })
            return
          }
          default: {
            enqueueSnackbar("Something went wrong :(", { variant: "error" })
            return
          }
        }
      }
      window.location.reload()
    })
  }, [])

  const driveEnabled = useMemo(() => {
    if (!state.credentials) return false
    return scopeIsGranted(GOOGLE_SCOPES.DRIVE, state.credentials.scope)
  }, [state.credentials])

  return (
    <>
      <Typography variant="h4" align="center">
        One more thing!
      </Typography>

      <ScopeDescription granted={enabled(driveEnabled)} scope={GOOGLE_SCOPES.DRIVE} />

      <div style={{ paddingBottom: 24 }} />
      <ButtonGoogle
        text="Sync My Google Drive"
        onClick={() => client.current.requestCode()}
      />
    </>
  )
}

const enabled = (enabled) => enabled ? <LockOpenIcon /> : <LockIcon />