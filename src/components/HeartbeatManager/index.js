import { Button, DialogContent } from "@material-ui/core"
import { useContext, useEffect, useState } from "react";
import { heartbeat } from "../../api/member/heartbeat"
import { DispatchContext, StateContext } from "../../store";
import BaseDialog from "../BaseDialog"
import BaseDialogActions from "../BaseDialogActions"
import BaseDialogTitle from "../BaseDialogTitle"
import ContainedButton from "../ContainedButton"

const delay = 15 * 1000

export default function HeartbeatManager(payload = {}) {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  const [version, setVersion] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [ctr, setCtr] = useState(0)

  useEffect(() => {
    // console.log("Connected:", navigator.onLine)
    if (document.hidden) return

    heartbeat({ updated_at: state.notifications.updated_at })
      .then(res => {
        if (res.error) return

        if (res.version !== version) {
          if (version) {
            setShowAlert(true)
          }
          setVersion(res.version)
        }

        dispatch({
          type: "UPDATE",
          set: (prev) => {
            const items = res.notifications.items.concat(prev.notifications.items)
            return { ...prev, notifications: { ...res.notifications, items } }
          }
        })
      })
  }, [ctr])

  useEffect(() => {
    const interval = setInterval(() => setCtr(x => x + 1), delay)

    return () => clearInterval(interval)
  }, [])

  const closeAlert = () => setShowAlert(false)
  const refreshPage = () => window.location.reload()

  if (!showAlert) return null

  return (
    <BaseDialog maxWidth="xs">
      <BaseDialogTitle handleClose={closeAlert}>
        A new Faniak version just came out!
      </BaseDialogTitle>
      <DialogContent>
        Refresh this page to gain access to new features and avoid versioning related errors.
      </DialogContent>
      <BaseDialogActions>
        <Button color="primary" onClick={closeAlert}>
          I have unsaved changes
        </Button>
        <ContainedButton onClick={refreshPage}>
          Refresh app
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog >
  )
}