import { useContext, useEffect, useRef } from 'react';
import { getAuthorizationClient, scopeIsGranted, setAccessToken } from '../../utils/authUtils'
import getMyCredentials from '../../api/member/getMyCredentials'
import { DispatchContext, StateContext } from '../../store'
import ButtonGoogle from './ButtonGoogle'

// Used to wrap an element that requires a specific scope
export default function GoogleScopeWrapper({ children, scopes = [], buttonProps = {}, buttonText }) {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const client = useRef(null)

  const needs_auth = scopes.some(scope => !scopeIsGranted(scope, state.credentials.scope))

  useEffect(() => {
    if (needs_auth && !client.current) {
      client.current = getAuthorizationClient(scopes.join(" "), res => {
        if (res.error) return
        getMyCredentials()
          .then(res => {
            if (res.error) return
            setAccessToken(res.credentials.access_token)
            dispatch({ type: 'SET', data: res })
          })
      })
    }
  }, [needs_auth])

  if (!needs_auth) return children ?? null

  return (
    <ButtonGoogle
      text={buttonText}
      {...buttonProps}
      onClick={() => client.current.requestCode()}
    />
  )
}