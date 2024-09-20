import { useSnackbar } from 'notistack'
import { useEffect, useRef } from 'react';
import { registerGoogle } from '../../../api/member/registerGoogle'
import { GOOGLE_CLIENT_ID } from '../../../store'

export default function Identification() {
  const { enqueueSnackbar } = useSnackbar()
  const ref = useRef()

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: associateGoogleAccount
    })

    google.accounts.id.renderButton(ref.current, {})
  }, [])

  const associateGoogleAccount = ({ credential }) => {
    registerGoogle({ token: credential })
      .then(res => {
        if (res.error) {
          enqueueSnackbar("Google account already in use!", { variant: "error" })
        }

        window.location.reload()
      })
  }

  return <div ref={ref} />
}