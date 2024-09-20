import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse } from '../common'
import { getBackgroundData, getBackgroundParams } from '../../utils/backgroundUtils'

export async function getSpotifyReleases(payload = {}) {

  const url = urls.getSpotifyReleases()

  const params = {
    ...getBackgroundParams(payload),
    spotify_id: payload.source_id,
  }

  return await defaultAxios()
    .post(url, params)
    .then(res => {
      printResponse("getSpotifyReleases", res)
      const { status, data } = res.data

      switch (status) {
        case 'SUCCESS': {
          const response = getBackgroundData(res)

          if (data) {
            response.results = data.map(result => ({
              common: {
                name: result.name,
                picture: result.images[0]?.url,
                n_tracks: result.total_tracks,
                url: result.external_urls.spotify,
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