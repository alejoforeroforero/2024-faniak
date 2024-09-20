import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'

export async function searchContacts(payload = {}) {
  const url = urls.searchContacts()
  const params = { q: payload.q }

  return await axios.get(url, { params })
    .then((res) => {
      printResponse("searchContacts", res)
      const { status, data } = res.data

      switch (status) {
        case "SUCCESS": {
          return {
            results: data.map(({ person }) => {
              return {
                email: person.emailAddresses?.find(x => x.metadata.primary).value ?? "",
                name: person.names?.find(x => x.metadata.primary).givenName ?? "",
                picture: person.photos?.find(x => x.metadata.primary).url ?? "",
                people_id: person.resourceName,
              }
            }),
          }
        }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}