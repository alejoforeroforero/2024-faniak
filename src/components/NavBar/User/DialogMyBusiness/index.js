import { useContext, useState } from 'react';
import {
  DialogContent,
  Box,
  TextField,
  Typography,
} from '@material-ui/core'
import BaseDialogTitle from '../../../BaseDialogTitle'
import { StateContext } from '../../../../store'
import BaseDialog from '../../../BaseDialog'
import TeamManager from '../../../TeamManager'
import BaseDialogActions from '../../../BaseDialogActions'
import ContainedButton from '../../../ContainedButton'
import { updateMember } from '../../../../api/member/update'
import Picture from './Picture'
import { useSnackbar } from 'notistack'

export default function DialogMyBusiness({ handleClose, fetchUser }) {
  const { enqueueSnackbar } = useSnackbar()
  const state = useContext(StateContext)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    business_name: state.user.business_name,
  })

  const handleChangeForm = (e) => {
    const { value, name } = e.target

    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    if (form.business_name !== state.user.business_name) {
      updateMember({ ...form })
        .then(res => {
          setSubmitting(false)
          if (res.error) {
            enqueueSnackbar("An error occured :(", { variant: "error" })
            return
          }

          enqueueSnackbar("Your changes have been saved.", { variant: "success" })
          fetchUser()
        })
      return
    }

    handleClose()
  }

  return (
    <BaseDialog maxWidth="sm">
      <BaseDialogTitle handleClose={handleClose}>
        Edit my team
      </BaseDialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" mb={3}>
          <Picture fetchUser={fetchUser} />
          <Box pl={1.5} flexGrow={1}>
            <form id="businessName" onSubmit={handleSubmit}>
              <TextField
                required
                fullWidth
                label="Team Name"
                color="primary"
                size="small"
                onChange={handleChangeForm}
                value={form["business_name"]}
                name="business_name"
                autoComplete="off"
              />
            </form>
          </Box>
        </Box>
        <div style={{ display: "flex" }}>
          <Typography variant="h6" gutterBottom>
            My team:
          </Typography>
          <div style={{ flexGrow: 1 }} />
        </div>
        <TeamManager fetchUser={fetchUser} limitTotalEmployees />
      </DialogContent>
      <BaseDialogActions>
        <ContainedButton
          type="submit"
          form="businessName"
          loading={submitting}
        >
          {form.business_name !== state.user.business_name ? "Save" : "Close"}
        </ContainedButton>
      </BaseDialogActions>
    </BaseDialog>
  )
}