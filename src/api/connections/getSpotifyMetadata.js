import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse } from '../common'
import { getBackgroundData, getBackgroundParams } from '../../utils/backgroundUtils'

export async function getSpotifyMetadata(payload = {}) {
  const url = urls.getSpotifyMetadata()

  const params = {
    ...getBackgroundParams(payload),
    album_ids: payload.album_ids,
  }

  return await defaultAxios()
    .post(url, params)
    .then(res => {
      printResponse("getSpotifyMetadata", res)
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