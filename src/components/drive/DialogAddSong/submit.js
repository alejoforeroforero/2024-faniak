import { createCredit } from '../../../api/credit/create'
import { createFile, uploadFile } from '../../../api/drive/createFile'
import { createPermission } from '../../../api/drive/createPermission'
import { createSong } from '../../../api/folder/create'
import { updateFolder } from '../../../api/folder/update'
import { googleMimeTypes, googlePermissionRoles } from '../../../api/google/store'

export default async function submit({
  song,
  credits,
  permissions,
  parent_id,
  dispatch
}) {
  console.log("Submiting:")
  console.log({ song, credits, permissions })

  var song_folder_id

  const promises = []
  const file_response = await createFile({
    resource: {
      name: song.title,
      parents: [parent_id],
      mimeType: googleMimeTypes.FOLDER,
      appProperties: {
        isShared: "1",
      },
    }
  })

  if (file_response.error) return

  const song_file_id = file_response.file.id

  const artists = song.artists
    ? song.artists.map(artist_name => ({
      name: artist_name,
      role: "main"
    }))
    : []

  const payload = {
    data: {
      ...song,
      artists: artists,
      created_from_scratch: true,
      // remove a few keys (files should not be sent, for exemple)
      artwork: undefined,
      file: undefined,
      upload_file: undefined,
      submitted_file: undefined,
    },
    google_folder_id: song_file_id,
  }

  await createSong(payload, dispatch)
    .then(data => {
      if (data.error) return

      song_folder_id = data.folder_id

      if (song.upload_file && song.file) {
        submitSongFile({
          field: "audio",
          parent_id: song_file_id,
          folder_id: song_folder_id,
          file: song.file,
          dispatch: dispatch,
        })
      }

      // submit artwork
      if (song.artwork) {
        promises.push(
          submitSongFile({
            field: "cover",
            parent_id: song_file_id,
            folder_id: song_folder_id,
            file: song.artwork,
            dispatch: dispatch,
          })
        )
      }

      submitCredits({
        folder_id: song_folder_id,
        credits: credits,
      })

      promises.push(
        savePermissions(permissions, song_file_id)
      )
    })

  await Promise.all(promises)

  return song_folder_id
}

function submitCredits({ folder_id, credits }) {
  credits.forEach(person => {
    if (person.is_deleted) return
    createCredit({ folder_id, ...person })
  })
}

export const submitSongFile = async ({ field, parent_id, folder_id, file, dispatch }) => {
  const payload = {
    parent: parent_id,
    file: file,
  }

  return await uploadFile(payload, { dispatch })
    .then(res => {
      if (res.error) return

      updateFolder({
        folder_id: folder_id,
        data: {
          [field]: { id: res.file.id }
        },
      })
    })
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