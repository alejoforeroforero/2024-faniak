import { useContext, useEffect } from 'react';
import { DispatchContext, StateContext } from '../../store'
import Content from './Content'
import Title from './Title'
import BaseDialog from '../BaseDialog'
import { refreshUser } from '../../utils/authUtils'
import { getStorageQuota } from '../../api/drive/getStorageQuota'

export function showSubscriptionLimits(dispatch) {
  dispatch({
    type: "SET",
    data: { show_subscription_limit: true }
  })
}

export default function DialogSubscriptions() {
  const { show_subscription_limit } = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  useEffect(() => {
    getStorageQuota()
      .then(res => {
        if (res.error) return

        dispatch({ type: 'SET', data: res })
      })
  }, [])

  if (!show_subscription_limit) return null

  const handleClose = () => {
    dispatch({
      type: "SET",
      data: { show_subscription_limit: false }
    })

    refreshUser(dispatch)
  }

  return (
    <BaseDialog maxWidth="xs">
      <Title handleClose={handleClose} />
      <Content />
    </BaseDialog >
  )
}