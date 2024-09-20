import { dafaultCatch, printResponse } from '../common'
import urls from '../urls'
import axios from "axios"

export const listDirectoryContacts = async (payload = {}) => {
  const url = urls.listDirectoryContacts()
  const params = {
    pageToken: payload.pageToken,
  }

  return await axios.post(url, params)
    .then(res => {
      printResponse("listDirectoryContacts", res)
      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": {
          const people = data.people ?? []
          return {
            nextPageToken: data.nextPageToken ?? "",
            people: people.map((person) => {        
              return {
                email: person.emailAddresses?.find(x => x.metadata.primary).value ?? "",
                name: person.names?.find(x => x.metadata.primary).givenName ?? "",
                picture: person.photos?.find(x => x.metadata.primary).url ?? "",
                people_id: person.resourceName,
              }
            }),
          }
        }
        case "GOOGLE_ERROR": return { error: status }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}