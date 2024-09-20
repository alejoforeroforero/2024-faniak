import { createCredit } from '../../../api/credit/create'
import { createFile } from '../../../api/drive/createFile'
import { createSong } from '../../../api/folder/create'
import { updateFolder } from '../../../api/folder/update'
import { googleMimeTypes } from '../../../api/google/store'
import { createAlbumSong } from '../../../api/relation/create'
import { submitSongFile } from '../DialogAddSong/submit'

export default async function submitSongs({
  songs,
  upload_audio,
  credits,
  album_folder_id,
  artwork_file_id,
  parent_id,
  dispatch
}) {

  const submitSong = async (song, index) => {

    const promises = []

    var song_folder_id

    const file_response = await createFile({
      resource: {
        name: song.title,
        parents: [parent_id],
        mimeType: googleMimeTypes.FOLDER,
      }
    })

    if (file_response.error) return

    const song_file_id = file_response.file.id

    const artists = song.artists.map(artist_name => ({
      name: artist_name,
      role: "main"
    }))

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

        promises.push(
          createAlbumSong({
            data: {
              disk_n: song.disk_n || 1,
              track_n: song.track_n || index + 1
            },
            parent_folder: { folder_id: album_folder_id },
            child_folder: { folder_id: song_folder_id },
          })
        )

        //upload audio file
        if (upload_audio && song.file) {
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
          if (artwork_file_id) {
            promises.push(
              updateFolder({
                folder_id: song_folder_id,
                data: {
                  cover: { id: artwork_file_id }
                },
              })
            )
          } else {
            submitSongFile({
              field: "cover",
              parent_id: song_file_id,
              folder_id: song_folder_id,
              file: song.artwork,
              dispatch: dispatch,
            })
          }
        }

        promises.push(
          submitCredits({
            folder_id: song_folder_id,
            credits: song.credits || credits,
          })
        )
      })

    return Promise.all(promises)
  }

  return Promise.all(
    songs.map(submitSong)
  )
}

async function submitCredits({ folder_id, credits }) {
  const promises = credits.map(person => createCredit({ folder_id, ...person }))

  await Promise.all(promises)
}