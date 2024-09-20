import { useContext, useState } from 'react';
import {
  IconButton,
} from '@material-ui/core'
import BusinessTemplate from './BusinessTemplate'
import EditIcon from '@material-ui/icons/Edit'
import { DispatchContext, StateContext } from '../../../store'
import { refreshUser } from '../../../utils/authUtils'
import DialogMyBusiness from './DialogMyBusiness'

export default function MyBusiness() {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const [showDialog, setShowDialog] = useState(false)

  const handleOpenDialog = () => setShowDialog(true)
  const handleCloseDialog = () => setShowDialog(false)

  const fetchUser = () => refreshUser(dispatch)

  return (
    <>
      <BusinessTemplate
        picture={state.user.business_picture}
        name={state.user.business_name || "My Team"}
        tier={state.user.subscription_tier}
        button={(
          <IconButton color="primary" onClick={handleOpenDialog}>
            <EditIcon />
          </IconButton>
        )}
      />
      {showDialog && <DialogMyBusiness
        handleClose={handleCloseDialog}
        fetchUser={fetchUser}
      />}
    </>
  )
}