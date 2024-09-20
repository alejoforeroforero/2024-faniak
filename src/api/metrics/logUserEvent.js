import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'

export const userEventNames = {
  SEND_TO_MAGICSYNC: "send_to_magicsync",
  USER_CLICKED_SHARED_FOLDER_LINK: "user_clicked_shared_folder",
  USER_CLICKED_SHARED_FILE_LINK: "user_clicked_shared_file",
  UPLOAD_FILE: "upload_file",
}

export const logUserEvent = async (event_name, event_target) => {
  const url = urls.logUserEvent()

  return await axios.post(url, {
    event_name: event_name,
    event_target: event_target,
  })
    .then((res) => {
      printResponse(`logUserEvent`, res)
    })
    .catch(dafaultCatch)
}