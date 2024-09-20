import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse, objToFormData } from '../common'
import { getUploadProgressHandler, startUpload } from '../../components/UploadManager'
import axios from 'axios'
import imageCompression from 'browser-image-compression'

/*
  dispatch, taken from useContext(DispatchContext)
*/
export const setProfilePicture = async (payload = {}, dispatch) => {
  const url = urls.updateMember()

  const compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 256,
    useWebWorker: true
  }

  var file = null

  try {
    if (payload.file.type.includes("svg")) throw "UNSUPPORTED_FORMAT"
    file = await imageCompression(payload.file, compressionOptions)
  } catch (error) {
    if (dispatch) alert("That file format is not supported. Please upload a PNG or JPEG.")
    return { error: "UNSUPPORTED_FORMAT" }
  }

  file = new File([file], file.name, { type: file.type })

  console.log(`Compressing ${Math.floor(payload.file.size / 1024)}KB to ${Math.floor(file.size / 1024)}KB`)
  // return {}
  const options = {}

  if (dispatch) {
    const source = axios.CancelToken.source()
    options.cancelToken = source.token

    const uploadKey = startUpload({
      dispatch: dispatch,
      file: file,
      parent_id: null,
      cancel: source.cancel,
    })

    options.onUploadProgress = getUploadProgressHandler(dispatch, uploadKey)
  }

  const params = objToFormData({ [payload.key || "picture"]: file })

  return await defaultAxios()
    .post(url, params, options)
    .then(processResponse)
    .catch(dafaultCatch)
}

const processResponse = (res) => {
  printResponse("setProfilePicture", res)

  if (res.data.status === "SUCCESS") return processSuccess(res.data)

  return dafaultCatch(res)
}

const processSuccess = (data) => {
  return {}
}