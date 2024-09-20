import { useContext, useEffect, useState } from 'react';
import { GOOGLE_SCOPES, StateContext } from '../../../store'
import BaseSearchField, { searchResultTypes } from '../../BaseSearchField'
import { stringIsEmail } from '../../../dictionary/validation'
import AddIcon from '@material-ui/icons/Add'
import ContactsIcon from '../../../svg/ContactsIcon'
import { scopeIsGranted } from '../../../utils/authUtils'
import DialogAuthorizeScope from '../../google/DialogAuthorizeScope'
import { searchContacts } from '../../../api/people/searchContacts'

export default function SearchMembers({ submitMember, initialValue = "", allowName }) {
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
    // if (!string) {
    //   return [{
    //     type: searchResultTypes.PERSON,
    //     data: state.user,
    //     selectData: () => submitMember(state.user),
    //   }]
    // }

    if (string.length < 3) return []

    const people = []
    const results = []

    if (contactsEnabled) {
      await searchContacts({ q: string })
        .then(res => {
          if (res.error) return

          const contactsWithEmail = res.results
            .filter(result => result.email)
            .slice(0, 10)

          people.push(...contactsWithEmail)
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

    if (allowName) {
      results.unshift({
        type: searchResultTypes.ACTION,
        data: {
          label: "Add name to credits",
          icon: <AddIcon />,
        },
        selectData: () => submitMember({ name: string }),
      })
    }

    if (stringIsEmail(string) && !people.find(p => p.email === string)) {
      results.unshift({
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
        label="Type a name or email"
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