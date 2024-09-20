import { useContext, useEffect, useMemo, useState } from 'react';
import { Box, DialogContent } from '@material-ui/core'
import BaseDialogTitle from '../BaseDialogTitle'
import BaseDialog from '../BaseDialog'
import ScopeDescription from './ScopeDescription'
import { StateContext } from '../../store'
import { scopeIsGranted } from '../../utils/authUtils'
import GoogleScopeWrapper from './GoogleScopeWrapper'

export default function DialogAuthorizeScope({ handleClose, scopes = [] }) {
  const state = useContext(StateContext)

  const items = useMemo(() => {
    return scopes.map(scope => ({
      key: scope,
      scope: scope,
      granted: scopeIsGranted(scope, state.credentials.scope)
    }))
  }, [scopes, state.credentials])

  useEffect(() => {
    if (items.every(item => item.granted)) {
      handleClose()
    }
  }, [items])

  return (
    <BaseDialog maxWidth="xs">
      <BaseDialogTitle handleClose={handleClose}>
        Google sync authorization
      </BaseDialogTitle>

      <DialogContent>
        {items.map(item => <ScopeDescription {...item} />)}

        <Box pt={5} pb={3} display="flex" justifyContent="center">
          <GoogleScopeWrapper
            scopes={scopes}
            buttonText="Sync My Google Account"
          />
        </Box>
      </DialogContent>
    </BaseDialog>
  )
}