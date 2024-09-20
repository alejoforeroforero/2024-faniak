import urls from '../urls'
import { relationTypes as rt } from '../../dictionary/relation'
import { dafaultCatch, printResponse } from '../common'
import axios from 'axios'

export const createRelation = (type) => async (payload = {}) => {
  const url = urls.createRelation()

  const params = {
    type: type,
    // parent_folder and child_folder format: {folder_id} or {event_params}
    parent_folder: payload.parent_folder,
    child_folder: payload.child_folder,
    data: payload.data || {},
  }

  return await axios.post(url, params)
    .then((res) => {
      printResponse(`createRelation (${type})`, res)
      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": return { relation_id: data.relation_id }
        case "ACCESS_DENIED": return { error: status }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)
}

export const createAlbumSong = createRelation(rt.ALBUM_SONG)
export const createArtistAlbum = createRelation(rt.ARTIST_ALBUM)
export const createArtistGig = createRelation(rt.ARTIST_GIG)
export const createArtistSong = createRelation(rt.ARTIST_SONG)
export const createGigSong = createRelation(rt.GIG_SONG)