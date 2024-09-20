import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'
import { getThumbnails } from '../drive/getThumbnails'

export const getEvent = async (payload = {}, options = {}) => {
  const url = urls.getEvent()
  const params = {
    event_params: payload.event_params,
  }

  const response = await axios.post(url, params)
    .then((res) => {
      printResponse("getEvent", res)
      const { status, data, code } = res.data

      switch (status) {
        case "SUCCESS": {
          return { event: data }
        }
        case "GOOGLE_ERROR": {
          switch (code) {
            case 404: return { error: "NOT_FOUND" }
            default: return { error: status }
          }
        }
        case "BAD_REQUEST": return { error: status }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)

  if (response.error) return response

  const thumbnail_file_id = response.event.smart_folder?.picture_id
  if (options.includeThumbnails && thumbnail_file_id) {
    await getThumbnails({ id_list: [thumbnail_file_id] })
      .then(res => {
        if (res.error) return
        if (res.thumbnails[thumbnail_file_id]) {
          response.event.smart_folder.picture = res.thumbnails[thumbnail_file_id].thumbnailLink
        }
      })
  }

  return response
}