import { useContext, useEffect, useState } from 'react';
import { GOOGLE_SCOPES, StateContext } from '../../../store'
import BaseSearchField, { searchResultTypes } from '../../BaseSearchField'
import { stringIsEmail } from '../../../dictionary/validation'
import { scopeIsGranted } from '../../../utils/authUtils'
import ContactsIcon from '../../../svg/ContactsIcon'
import DialogAuthorizeScope from '../../google/DialogAuthorizeScope'
import { searchContacts } from '../../../api/people/searchContacts'

export default function SearchMembers({ submitMember, initialValue = "" }) {
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

  const fetchResults = async (string) => {
    if (!string) {
      return [{
        type: searchResultTypes.PERSON,
        data: state.user,
        selectData: () => submitMember(state.user),
      }]
    }

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
      selectData: submitMember,
    })))

    if (stringIsEmail(string) && !people.find(p => p.email === string)) {
      results.push({
        type: searchResultTypes.PERSON,
        data: {
          picture: "",
          name: string,
          email: string,
        },
        selectData: () => submitMember({ email: string }),
      })
    }

    return results
  }

  return (
    <>
      <BaseSearchField
        label="Invite contributors"
        autoFocus
        initialValue={initialValue}
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