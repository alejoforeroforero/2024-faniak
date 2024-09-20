import { getFolderCredits } from '../api/drive/getFolderCredits'
import { folderTypes } from '../dictionary/folder'
import { getFolderRelationships } from '../api/drive/getFolderRelationships'
import getMember from '../api/member/getMember'
import { getFile } from '../api/drive/getFile'
import { CHROME_EXTENSION_ID } from '../store'

export async function updateExtensionData({ folder, user }) {

  const data = {}
  const promises = []

  promises.push(
    getMember()
      .then(res => {
        if (res.error) return
        data.user = {
          ...user,
          ...res.member,
        }
      })
  )

  data.folder = {
    id: folder.id,
    type: folder.type,
    name: folder.name,
    picture: folder.picture,
  }

  if (data.folder.type === folderTypes.ALBUM) {
    data.album = {
      name: folder.name,
      title: folder.data.title,
      title_language: folder.data.title_language,
      cover: folder.data.cover,
      cover_id: folder.data.cover?.id || null,
      year: folder.data.year,
      release_date: folder.data.release_date,
      genres: folder.data.genres,
      artists: folder.data.artists,
      upc_code: folder.data.upc_code,
      keywords: folder.data.keywords,
      record_labels: folder.data.record_labels,
    }
    promises.push(fetchReferredFile("cover", data.album))
    // album credits
    promises.push(fetchContributions(folder.id, data.album))
  }

  await getFolderRelationships({ folder_id: folder.id }, { includeThumbnails: true })
    .then(res => {
      if (res.error) return

      if (data.folder.type === folderTypes.SONG) {

        const song_data = { ...parseSong(folder) }
        promises.push(fetchReferredFile("audio", song_data))
        promises.push(fetchReferredFile("cover", song_data))

        promises.push(fetchContributions(folder.id, song_data))
        promises.push(fetchSongRelationships(folder.id, song_data))

        data.songs = [song_data]
      }

      else if (data.folder.type === folderTypes.ALBUM) {
        data.songs = res.album_song.map(({ folder, relation }) => {

          const song_data = { ...parseSong(folder), ...parseAlbumSong(relation) }
          promises.push(fetchReferredFile("audio", song_data))
          promises.push(fetchReferredFile("cover", song_data))

          promises.push(fetchContributions(folder.id, song_data))
          promises.push(fetchSongRelationships(folder.id, song_data))

          return song_data
        })

        data.album.artists = data.album.artists.concat(
          res.artist_album.map(artist_album => ({
            ...artist_album.relation.data,
            ...artist_album
          }))
        )
      }
    })

  await Promise.all(promises)

  console.log("Sent to extension:", data)

  window.chrome.runtime.sendMessage(CHROME_EXTENSION_ID, {
    code: "SET_DATA",
    data: data
  })
}

const parseSong = folder => ({
  audio: folder.data.audio,
  audio_id: folder.data.audio?.id || null,
  cover: folder.data.cover,
  cover_id: folder.data.cover?.id || null,
  description: folder.data.description,
  bpm: folder.data.bpm,
  genres: folder.data.genres,
  artists: folder.data.artists,
  duration_in_s: folder.data.duration_in_s,
  isrc_code: folder.data.isrc_code,
  iswc_code: folder.data.iswc_code,
  lyrics: folder.data.lyrics,
  lyrics_language: folder.data.lyrics_language,
  title_language: folder.data.lyrics_language, // TODO remove after extension update
  is_explicit: folder.data.parental_warning,
  name: folder.data.title,
  title: folder.data.title,
  version: folder.data.version,
  is_cover: folder.data.is_cover,
  is_instrumental: folder.data.is_instrumental,
  release_date: folder.data.release_date,
  year: folder.data.year,
  is_live_recording: folder.data.version === "Live", // TODO remove after extension update
})

const parseAlbumSong = relation => relation.data

// find credits for folder (song or album)
const fetchContributions = async (folder_id, data) => {
  await getFolderCredits({ folder_id: folder_id })
    .then(res => {
      data.credits = res.credits ?? []
    })
}

const fetchSongRelationships = async (song_id, data) => {
  await getFolderRelationships({ folder_id: song_id }, { includeThumbnails: true })
    .then(res => {
      if (res.error) return

      data.artists = data.artists.concat(
        res.artist_song.map(artist_song => ({
          ...artist_song.relation.data,
          ...artist_song
        }))
      )
    })
}

// find credits for folder (song or album)
const fetchReferredFile = async (key, data) => {
  if (!data[key]?.id) return

  await getFile({ id: data[key].id })
    .then(res => {
      if (res.error) return
      data[key] = res.file.webContentLink ?? ""
    })
}