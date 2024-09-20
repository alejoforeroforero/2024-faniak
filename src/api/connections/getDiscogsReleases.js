import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse } from '../common'
import { getBackgroundData, getBackgroundParams } from '../../utils/backgroundUtils'

export async function getDiscogsReleases(payload = {}) {
  const url = urls.getDiscogsReleases()

  const params = {
    ...getBackgroundParams(payload),
    discogs_id: payload.source_id
  }

  return await defaultAxios()
    .post(url, params)
    .then(res => {
      printResponse("getDiscogsReleases", res)
      const { status, data } = res.data

      switch (status) {
        case 'SUCCESS': {
          const response = getBackgroundData(res)

          if (data) {
            const results = data?.release || []
            response.results = results.map(result => ({
              common: {
                name: result.title,
                picture: result.thumb,
                n_tracks: result.tracklist.length,
                url: result.url,
              },
              metadata: result
            }))
          }

          return response
        }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}