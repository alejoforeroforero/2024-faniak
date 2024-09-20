import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse } from '../common'
import { parseMember } from './object'

export default async function getMember() {
  const url = urls.getMember()

  return await defaultAxios()
    .get(url)
    .then((res) => {
      printResponse("getMember", res)
      const { status, data } = res.data
      switch (status) {
        case 'SUCCESS': {
          return {
            member: parseMember(data)
          }
        }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}