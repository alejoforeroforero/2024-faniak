import { googleMimeTypes } from "../../api/google/store"
import { connectionNames } from "../../dictionary/connection"
import { folderColors, folderTypes } from "../../dictionary/folder"
import { relationTypes } from "../../dictionary/relation"
import { getChunks } from "../../utils/backgroundUtils"
import { processDiscogs } from "./processDiscogs"
import { processSpotify } from "./processSpotify"

const maxSongsPerRequest = 100

export async function prepareSubmission({ parent_id, albums }) {

  const request = {
    parent_id: parent_id,
    albums: [],
  }

  for (const album of albums) {

    const _album = {}

    request.albums.push(_album)

    _album.file = createGoogleFolder({
      name: album.title,
      folderColorRgb: folderColors[folderTypes.ALBUM],
    })

    const [faniak_artists, anon_artists] = splitArtists(album.artists)

    _album.folder = createAlbum({
      data: {
        ...album,
        artists: anon_artists,
        n_songs: album.n_songs ?? album.songs.length,
      }
    })

    _album.artists = []

    for (const artist of faniak_artists) {
      _album.artists.push(
        createArtistAlbum({
          parent_id: artist.id,
          data: {
            name: artist.name,
            role: artist.role,
          }
        })
      )
    }

    _album.credits = submitCredits(album.credits)

    _album.songs = []

    for (const song of album.songs) {
      const _song = {}

      _album.songs.push(_song)

      _song.file = createGoogleFolder({
        name: song.title,
        folderColorRgb: folderColors[folderTypes.SONG],
      })

      const [faniak_artists, anon_artists] = splitArtists(song.artists)

      _song.folder = createSong({
        data: {
          ...song,
          artists: anon_artists
        }
      })

      _song.album = createAlbumSong({ data: song })

      _song.artists = faniak_artists.map(artist => {
        return createArtistSong({
          parent_id: artist.id,
          data: {
            name: artist.name,
            role: artist.role,
          }
        })
      })

      _song.credits = submitCredits(song.credits)
    }
  }

  return request
}

const createGoogleFolder = (payload) => {
  return {
    name: payload.name,
    mimeType: googleMimeTypes.FOLDER,
    folderColorRgb: payload.folderColorRgb,
  }
}

const createFolder = (type) => (payload = {}) => {
  return {
    type: type,
    data: payload.data,
  }
}

const createAlbum = createFolder(folderTypes.ALBUM)
const createSong = createFolder(folderTypes.SONG)

const createRelationship = (type) => (payload = {}) => {
  const data = {
    type: type,
    data: payload.data
  }
  if (payload.parent_id) {
    data.parent_id = payload.parent_id
  }
  return data
}

const createArtistAlbum = createRelationship(relationTypes.ARTIST_ALBUM)
const createArtistSong = createRelationship(relationTypes.ARTIST_SONG)
const createAlbumSong = createRelationship(relationTypes.ALBUM_SONG)

const splitArtists = (artists = []) => {
  const faniak_artists = []
  const anon_artists = []

  artists.forEach(artist => {
    if (artist.id) {
      faniak_artists.push(artist)
    } else {
      anon_artists.push(artist)
    }
  })

  return [faniak_artists, anon_artists]
}

const submitCredits = (credits = []) => credits.map((payload) => {
  return {
    email: payload.member?.email ?? "",
    data: payload
  }
})

export const getAlbumChunks = (albums) => {
  const getMetric = album => album.songs.length
  return getChunks(albums, getMetric, maxSongsPerRequest)
}

export const getProcessFunction = (source) => {
  switch (source) {
    case connectionNames.DISCOGS: return processDiscogs;
    case connectionNames.SPOTIFY: return processSpotify;
    default: return () => console.log("Missing process function...");
  }
}