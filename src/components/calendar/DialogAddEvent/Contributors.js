import { useEffect } from 'react';
import useIsMounted from '../../../utils/useIsMounted'
import { getFolderCredits } from '../../../api/drive/getFolderCredits'
import Contributor from './Contributor'
import SearchMembers from './SearchMembers'
import { Box } from '@material-ui/core'
import { getMemberByEmail } from '../../../api/member/getMemberByEmail'

export default function Contributors({ artist, credits, setCredits }) {
  const isMounted = useIsMounted()

  useEffect(() => {
    if (!artist) return
    getFolderCredits({ folder_id: artist.id })
      .then(data => {
        if (data.error) return
        if (!isMounted()) return

        setCredits(data.credits)
      })
  }, [artist])

  const removePerson = (index) => {
    setCredits(prev => prev.filter((x, i) => i !== index))
  }

  const addPerson = async (person) => {
    var member = null

    if (person.email) {
      await getMemberByEmail({ email: person.email })
        .then(res => {
          if (res.error) return
          member = res.member
        })
    }

    const new_person = {
      member: member ?? null,
      email: person.email ?? "",
      name: member?.artistic_name || member?.name || person.name || person.email || "",
      percentage_owned: 0,
      played: member?.default_credits.played ?? [],
      wrote: member?.default_credits.wrote ?? [],
      others: member?.default_credits.others ?? [],
    }

    setCredits(prev => [...prev, new_person])
  }

  return (
    <Box flexGrow={1}>
      {credits.map((person, i) => (
        <Contributor
          key={i}
          index={i}
          person={person}
          removePerson={removePerson}
        />
      ))}
      {!!credits.length && <Box mt={2} />}
      <SearchMembers submitMember={addPerson} />
    </Box>
  )
}