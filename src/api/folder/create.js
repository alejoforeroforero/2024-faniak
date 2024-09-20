import { folderColors, folderTypes as ft } from '../../dictionary/folder'
import urls from '../urls'
import { defaultAxios, dafaultCatch, printResponse, printPayload } from '../common'
import { updateFile } from '../drive/updateFile'

export const createFolder = (type) => async (payload = {}, dispatch) => {
  const url = urls.createFolder()

  const params = {
    type: type,
    google_folder_id: payload.google_folder_id,
    google_event_id: payload.google_event_id,
    google_calendar_id: payload.google_calendar_id,
    data: payload.data || {},
  }

  printPayload(`createFolder (${type})`, params)

  return await defaultAxios()
    .post(url, params)
    .then((res) => {
      printResponse(`createFolder (${type})`, res)
      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": {
          if (dispatch) {
            dispatch({
              type: "UPDATE",
              set: prev => {
                prev.user.current_smart_folders += 1
                return prev
              }
            })
          }

          if (payload.google_folder_id) {
            updateFile({
              fileId: params.google_folder_id,
              resource: {
                folderColorRgb: folderColors[type]
              },
            })
          }

          return { folder_id: data.folder_id }
        }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}

export const createArtist = createFolder(ft.ARTIST)
export const createAlbum = createFolder(ft.ALBUM)
export const createSong = createFolder(ft.SONG)
export const createGig = createFolder(ft.GIG)