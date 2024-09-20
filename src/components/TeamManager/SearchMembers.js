import { useContext, useEffect, useState } from 'react';
import { GOOGLE_SCOPES, StateContext } from '../../store'
import BaseSearchField, { searchResultTypes } from '../BaseSearchField'
import { stringIsEmail } from '../../dictionary/validation'
import { addEmployee } from '../../api/member/addEmployee'
import { useSnackbar } from 'notistack'
import { scopeIsGranted } from '../../utils/authUtils'
import ContactsIcon from '../../svg/ContactsIcon'
import DialogAuthorizeScope from '../google/DialogAuthorizeScope'
import { searchContacts } from '../../api/people/searchContacts'

export default function SearchMembers({ fetchUser }) {
  const { enqueueSnackbar } = useSnackbar()
  const state = useContext(StateContext)
  const [showScopeDialog, setShowScopeDialog] = useState(false)
  const handleOpenScopeDialog = () => setShowScopeDialog(true)
  const handleCloseScopeDialog = () => setShowScopeDialog(false)

  const contactsEnabled = (() => {
    if (!scopeIsGranted(GOOGLE_SCOPES.CONTACTS, state.credentials.scope)) return false
    if (!scopeIsGranted(GOOGLE_SCOPES.OTHER_CONTACTS, state.credentials.scope)) return false
    return true
  })()

  useEffect(() => {
    if (contactsEnabled) {
      searchContacts({ q: "" })
    }
  }, [contactsEnabled])

  const addMember = (member) => {
    const is_me = member.email === state.user.email
    const is_teammate = !!state.employees.find(x => x.member.email === member.email)
    if (is_me || is_teammate) {
      enqueueSnackbar("That person is already in your team.", { variant: "warning" })
      return
    }

    addEmployee({ ...member })
      .then(res => {
        if (res.error) {
          enqueueSnackbar("An error occured :(", { variant: "error" })
          return
        }

        enqueueSnackbar("A teammate was added!", { variant: "success" })
        fetchUser()
      })
  }

  const fetchResults = async (string) => {
    if (string.length < 3) return []

    const people = []
    const results = []

    if (contactsEnabled) {
      await searchContacts({ q: string })
        .then(res => {
          if (res.error) return
          people.push(...res.results
            .filter(x => x.email || x.id) // we need a way to reference the members
            .slice(0, 10))
        })
    } else {
      results.push({
        type: searchResultTypes.ACTION,
        data: {
          label: "Sync My Google Contacts",
          icon: <ContactsIcon />,
        },
        selectData: () => handleOpenScopeDialog(),
      })
    }

    results.push(...people.map(person => ({
      type: searchResultTypes.PERSON,
      data: person,
      selectData: addMember,
    })))

    if (stringIsEmail(string) && !people.find(p => p.email === string)) {
      results.push({
        type: searchResultTypes.PERSON,
        data: {
          picture: "",
          name: string,
          email: string,
        },
        selectData: () => addMember({ email: string }),
      })
    }

    return results
  }

  return (
    <>
      <BaseSearchField
        label="Type to add teammates"
        fetchResults={fetchResults}
      />
      {showScopeDialog && (
        <DialogAuthorizeScope
          scopes={[GOOGLE_SCOPES.CONTACTS, GOOGLE_SCOPES.OTHER_CONTACTS]}
          handleClose={handleCloseScopeDialog}
        />
      )}
    </>
  )
}