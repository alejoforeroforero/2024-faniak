import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import { getThumbnails } from './getThumbnails'
import axios from 'axios'

export const getChildrenFiles = async (payload = {}, options = {}) => {
  const params = {
    q: `'${payload.id}' in parents and trashed=false`,
    pageSize: payload.pageSize ?? 100,
  }
  return await getFiles(params, options)
}

export const searchFiles = async (payload = {}, options = {}) => {
  const params = {
    q: [
      `name contains '${payload.q}'`,
      `trashed=false`,
      ...(payload.filters ?? []),
    ].join(" and "),
    pageSize: payload.pageSize ?? 50,
  }

  return await getFiles(params, options)
}

export const getFiles = async (params, options = {}) => {
  const url = urls.getFiles()

  const response = await axios.post(url, params)
    .then((res) => {
      printResponse("getFiles", res)
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
    const picture_ids = response.files.reduce((array, file) => {
      const picture_id = file.smart_folder?.picture_id
      if (picture_id) {
        array.push(picture_id)
      }
      return array
    }, [])
    if (picture_ids.length) {
      await getThumbnails({ id_list: picture_ids })
        .then(res => {
          if (res.error) return
          for (const file of response.files) {
            const picture_id = file.smart_folder?.picture_id
            if (picture_id && res.thumbnails[picture_id]) {
              file.smart_folder.picture = res.thumbnails[picture_id].thumbnailLink
            }
          }
        })
    }
  }

  return response
}