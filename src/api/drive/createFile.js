import { dafaultCatch, printResponse } from '../common'
import { getUploadProgressHandler, startUpload } from '../../components/UploadManager'
import axios from "axios"
import urls from '../urls'
import * as mm from 'music-metadata-browser'
import { showSubscriptionLimits } from '../../components/DialogSubscriptions'
import { getAccessToken } from '../../utils/authUtils'
import { logUserEvent, userEventNames } from '../metrics/logUserEvent'

export async function createFile(payload = {}) {
  const url = urls.createFile()

  return await axios.post(url, payload)
    .then(res => {
      printResponse("createFile", res)
      const { status, data, code } = res.data
      switch (status) {
        case "SUCCESS": return { file: data }
        case "GOOGLE_ERROR": return { error: status }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}

export const uploadFile = async (payload = {}, options = {}) => {
  logUserEvent(userEventNames.UPLOAD_FILE)

  const { file, parent } = payload

  const metadata = file.type?.includes("audio") ? await getMetadata(file) : {}

  var data = {
    name: file.name,
    mimeType: file.type,
    parents: parent ? [parent] : [],
    appProperties: metadata
  }

  var formData = new FormData()
  formData.append("metadata", new Blob([JSON.stringify(data)], { type: "application/json" }))
  formData.append("file", file)

  const url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"

  const config = {}

  config.headers = { "Authorization": "Bearer " + getAccessToken() }

  if (options.dispatch) {
    const source = axios.CancelToken.source()
    config.cancelToken = source.token

    const uploadKey = startUpload({
      dispatch: options.dispatch,
      file: file,
      parent_id: parent,
      cancel: source.cancel,
    })

    config.onUploadProgress = getUploadProgressHandler(options.dispatch, uploadKey)
  }

  if (options.onUploadProgress) {
    config.onUploadProgress = options.onUploadProgress
  }

  return axios.post(url, formData, config)
    .then((res) => {
      printUploadResponse("createGoogleFile", res)

      switch (res.status) {
        case 200: return { file: res.data }
        default: return dafaultCatch(res)
      }
    })
    .catch((err => {
      const res = err.response

      const response = dafaultCatch(res)
      if (res.data?.error?.errors?.find(error => error.reason === "storageQuotaExceeded")) {
        response.error = "storageQuotaExceeded"
        showSubscriptionLimits(options.dispatch)
      }
      return response
    }))
}

async function getMetadata(file) {

  const metadata = await mm.parseBlob(file)

  console.log(`Metadata from ${file.name}:`, metadata)

  const { format, common } = metadata

  return {
    title: common.title || "",
    artists: common.artists?.join(', ') || "",
    bpm: common.bpm || "",
    genres: common.genre?.join(', ') || "",
    isrc_code: common.isrc?.length ? common.isrc[0] : "",
    year: common.year || 0,
    track_n: common.track?.no || 0,
    disk_n: common.disk?.no || 0,
    duration_in_s: Math.floor(format.duration) || 0,
  }
}

function printUploadResponse(api_name, response) {
  const text_color = response.status === 200 ? "#8a84e4" : "red"
  console.log(`> %c${api_name}:\n`, `color: ${text_color}`, response.data)
}