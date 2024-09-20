import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'
import { getThumbnails } from '../drive/getThumbnails'

export async function getMyEvents(payload = {}, options = {}) {
  const url = urls.getMyEvents()

  const params = {
    q: payload.q,
    privateExtendedProperty: payload.privateExtendedProperty,
    sharedExtendedProperty: payload.sharedExtendedProperty,
    timeMin: payload.timeMin,
    timeMax: payload.timeMax,
  }

  const response = await axios.post(url, params)
    .then((res) => {
      printResponse("getMyEvents", res)
      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": return data
        case "GOOGLE_ERROR":
        case "BAD_REQUEST": return { error: status }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)

  if (response.error) return response

  if (options.includeThumbnails) {
    const picture_ids = []

    for (const event of response.items) {
      if (event.artist?.picture_id) {
        picture_ids.push(event.artist.picture_id)
      }
    }

    if (picture_ids.length) {
      await getThumbnails({ id_list: picture_ids })
        .then(res => {
          if (res.error) return
          for (const event of response.items) {
            const picture_id = event.artist?.picture_id
            if (picture_id && res.thumbnails[picture_id]) {
              event.artist.picture = res.thumbnails[picture_id].thumbnailLink
            }
          }
        })
    }
  }

  return response
}