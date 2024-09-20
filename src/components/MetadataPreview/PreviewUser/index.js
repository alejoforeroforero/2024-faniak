import { useContext, useEffect, useState } from 'react';
import Metadata from './Metadata'
import { DispatchContext, StateContext } from '../../../store'
import { refreshUser } from '../../../utils/authUtils'
import Preview from '../Preview'
import useIsMounted from '../../../utils/useIsMounted'
import getMember from '../../../api/member/getMember'
import DefaultCredits from './DefaultCredits'
import Profile from './Profile'

export default function PreviewUser() {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  const [member, setMember] = useState(null)
  const isMounted = useIsMounted()

  useEffect(fetchMember, [])

  function fetchMember() {
    getMember()
      .then(data => {
        if (data.error) return
        if (!isMounted()) return

        setMember(data.member)
      })
  }

  function fetchUser() {
    refreshUser(dispatch)
  }

  return (
    <Preview>
      <Profile
        member={member}
        picture={state.user.picture}
        fetchUser={fetchUser}
      />
      {Boolean(member) && (
        <DefaultCredits
          member={member}
          setMember={setMember}
          fetchMember={fetchMember}
        />
      )}
      {Boolean(member) && (
        <Metadata
          member={member}
          fetchMember={fetchMember}
        />
      )}
    </Preview>
  )
}