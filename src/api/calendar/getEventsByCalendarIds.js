import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'
import { getThumbnails } from '../drive/getThumbnails'

export async function getEventsByCalendarIds(payload = {}, options = {}) {
  const url = urls.getEventsByCalendarIds()

  const params = {
    id_list: payload.id_list,
    timeMin: payload.timeMin,
    timeMax: payload.timeMax,
  }

  const response = await axios.post(url, params)
    .then((res) => {
      printResponse("getEventsByCalendarIds", res)
      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": {
          return data
        }
        case "GOOGLE_ERROR":
        case "BAD_REQUEST": return { error: status }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)

  if (response.error) return response

  if (options.includeThumbnails) {
    const picture_ids = []

    for (let calendar of Object.values(response)) {
      for (const event of calendar.items) {
        if (event.artist?.picture_id) {
          picture_ids.push(event.artist.picture_id)
        }
      }
    }

    if (picture_ids.length) {
      await getThumbnails({ id_list: picture_ids })
        .then(res => {
          if (res.error) return
          for (let calendar of Object.values(response)) {
            for (const event of calendar.items) {
              const picture_id = event.artist?.picture_id
              if (picture_id && res.thumbnails[picture_id]) {
                event.artist.picture = res.thumbnails[picture_id].thumbnailLink
              }
            }
          }
        })
    }
  }

  return response
}