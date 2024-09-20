import { createCredit } from '../../../api/credit/create'
import { createFile, uploadFile } from '../../../api/drive/createFile'
import { createPermission } from '../../../api/drive/createPermission'
import { createAlbum } from '../../../api/folder/create'
import { updateFolder } from '../../../api/folder/update'
import { googleMimeTypes, googlePermissionRoles } from '../../../api/google/store'
import submitSongs from './submitSongs'

export default async function submit({
  album,
  tracklist,
  upload_files,
  credits,
  permissions,
  parent_id,
  dispatch,
}) {
  console.log("Submiting:")
  console.log({ album, tracklist, credits, permissions })

  var album_folder_id
  var album_file_id
  var artwork_file_id

  const promises = []
  const file_response = await createFile({
    resource: {
      name: album.title,
      parents: [parent_id],
      mimeType: googleMimeTypes.FOLDER,
      appProperties: {
        isShared: "1",
      },
    }
  })

  if (file_response.error) return

  album_file_id = file_response.file.id

  const artists = album.artists?.length
    ? album.artists.map(artist_name => ({
      name: artist_name,
      role: "main"
    }))
    : []

  const payload = {
    data: {
      ...album,
      artists: artists,
      n_songs: tracklist.length,
      created_from_scratch: true,
      // files should not be sent
      artwork: undefined,
    },
    google_folder_id: album_file_id,
  }

  const album_response = await createAlbum(payload, dispatch)

  if (album_response.error) return

  album_folder_id = album_response.folder_id

  // submit artwork
  if (album.artwork?.file) {
    const artwork_response = await uploadFile({
      parent: album_file_id,
      file: album.artwork.file,
    }, { dispatch })

    if (!artwork_response.error) {

      artwork_file_id = artwork_response.file.id

      promises.push(
        updateFolder({
          folder_id: album_folder_id,
          data: {
            cover: { id: artwork_file_id }
          },
        })
      )
    }
  }

  for (const person of credits) {
    if (!person.is_deleted) {
      promises.push(
        createCredit({ folder_id: album_folder_id, ...person })
      )
    }
  }

  promises.push(
    savePermissions(permissions, album_file_id)
  )

  promises.push(
    submitSongs({
      songs: tracklist,
      upload_audio: upload_files,
      credits,
      parent_id: album_file_id,
      album_folder_id,
      artwork_file_id,
      dispatch
    })
  )

  await Promise.all(promises)

  return album_folder_id
}

const savePermissions = async (list, fileId) => {
  for (const permission of list) {
    const isOwner = permission.role === googlePermissionRoles.OWNER
    const isDeleted = permission.is_deleted
    if (!isDeleted && !isOwner) {
      await createPermission({ ...permission, fileId })
    }
  }
}