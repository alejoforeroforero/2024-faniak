import urls from '../urls'
import { dafaultCatch, printResponse } from '../common'
import { relationTypes } from '../../dictionary/relation'
import { getThumbnails } from './getThumbnails'
import axios from 'axios'

export async function getFolderRelationships(payload = {}, options = {}) {
  const url = urls.getFolderRelationships()
  const params = {
    folder_id: payload.folder_id,
    // for event smart folders
    event_params: payload.event_params,
  }

  const response = await axios.post(url, params)
    .then((res) => {
      printResponse("getFolderRelationships", res)
      const { status, data } = res.data
      switch (status) {
        case "SUCCESS": {
          // folders may be null if user doesn't have access to them
          // if relation == null, there's an invalid field and it should be filtered out
          return {
            relationships: data.filter((relationship) => relationship.relation)
          }
        }
        default: return dafaultCatch(res)
      }
    })
    .catch(dafaultCatch)

  if (response.error) return response

  const promises = []

  for (let value of Object.values(relationTypes)) {
    response[value] = []
  }

  if (options.includeThumbnails) {
    const picture_ids = response.relationships.reduce((array, relationship) => {
      const picture_id = relationship.folder?.picture_id
      if (picture_id) {
        array.push(picture_id)
      }
      return array
    }, [])
    if (picture_ids.length) {
      await getThumbnails({ id_list: picture_ids })
        .then(res => {
          if (res.error) return
          for (const relationship of response.relationships) {
            const picture_id = relationship.folder?.picture_id
            if (picture_id && res.thumbnails[picture_id]) {
              relationship.folder.picture = res.thumbnails[picture_id].thumbnailLink
            }
          }
        })
    }
  }

  for (const relationship of response.relationships) {
    response[relationship.relation.type].push(relationship)
  }

  response[relationTypes.ALBUM_SONG]
    .sort((a, b) => getTrackN(a) - getTrackN(b))
    .sort((a, b) => getDiskN(a) - getDiskN(b))

  response[relationTypes.GIG_SONG]
    .sort((a, b) => getSongIndex(a) - getSongIndex(b))

  await Promise.all(promises)

  return response
}

const getDiskN = relationship => relationship.relation.data.disk_n
const getTrackN = relationship => relationship.relation.data.track_n

const getSongIndex = relationship => relationship.relation.data.song_index