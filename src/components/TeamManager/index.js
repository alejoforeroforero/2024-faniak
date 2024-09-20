import { useContext, useState } from 'react';
import {
  Button,
  Link,
} from '@material-ui/core'
import { GOOGLE_SCOPES, StateContext } from '../../store'
import EmployeeList from './EmployeeList'
import DialogDirectoryPeople from './DialogDirectoryPeople'
import urls from '../../api/urls'
import SearchMembers from './SearchMembers'
import { scopeIsGranted } from '../../utils/authUtils'
import DialogAuthorizeScope from '../google/DialogAuthorizeScope'

export default function TeamManager({ fetchUser, limitTotalEmployees }) {
  const state = useContext(StateContext)
  const [showDirectoryDialog, setShowDirectoryDialog] = useState(false)
  const openDirectoryDialog = () => { setShowDirectoryDialog(true) }
  const closeDirectoryDialog = () => { setShowDirectoryDialog(false) }

  const directoryEnabled = scopeIsGranted(GOOGLE_SCOPES.DIRECTORY_CONTACTS, state.credentials.scope)
  const [showScopeDialog, setShowScopeDialog] = useState(false)
  const handleOpenScopeDialog = () => setShowScopeDialog(true)
  const handleCloseScopeDialog = () => setShowScopeDialog(false)

  const max_employees = state.user.subscription_quantity - 1
  const spots_remaining = max_employees - state.employees.length

  return (
    <>
      {limitTotalEmployees && spots_remaining <= 0 ? (
        <div>
          To add more teammates, you will need to <Link
            href={urls.openCustomerPortal()} target="_blank" rel="noopener">
            add spots to your subscription
          </Link>.
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flexGrow: 1 }}>
            <SearchMembers fetchUser={fetchUser} />
          </div>
          {state.user.business_domain && (
            <div style={{ marginLeft: 8 }}>
              <Button
                color="primary"
                variant="outlined"
                onClick={directoryEnabled ? openDirectoryDialog : handleOpenScopeDialog}
              >
                Find my colleagues
              </Button>
            </div>
          )}
        </div>
      )}

      <EmployeeList fetchUser={fetchUser} />

      {showDirectoryDialog && <DialogDirectoryPeople
        limitTotalEmployees={limitTotalEmployees}
        handleClose={closeDirectoryDialog}
        fetchUser={fetchUser}
      />}

      {showScopeDialog && (
        <DialogAuthorizeScope
          scopes={[GOOGLE_SCOPES.DIRECTORY_CONTACTS]}
          handleClose={handleCloseScopeDialog}
        />
      )}
    </>
  )
}