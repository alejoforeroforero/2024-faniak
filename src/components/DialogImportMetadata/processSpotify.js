import { getSpotifyMetadata } from "../../api/connections/getSpotifyMetadata"
import { connectionNames } from "../../dictionary/connection"
import { getChunks, runBackgroundJob } from "../../utils/backgroundUtils"

const maxSongsPerRequest = 100
const delayBetweenRequests = 2000

const getResultChunks = (results) => {
  const getMetric = result => result.common.n_tracks
  return getChunks(results, getMetric, maxSongsPerRequest)
}

const fetchReleases = async (results) => {
  const releases = []

  for (const chunk of getResultChunks(results)) {
    await runBackgroundJob({
      apiFunction: getSpotifyMetadata,
      apiPayload: {
        album_ids: chunk.map(result => result.metadata.id)
      },
      processResponse: (res) => {
        if (res.error) return
        if (res.results) {
          releases.push(...res.results.map(result => result.metadata))
        }
      },
      delay: delayBetweenRequests,
    })
  }

  return releases
}

export async function processSpotify({ results, folder }) {
  const selectedResults = results.filter(result => result.selected)

  const releases = await fetchReleases(selectedResults)

  const albums = []

  for (const data of releases) {
    const album = {}

    album.connections = {
      [connectionNames.SPOTIFY]: {
        id: data.id,
        url: data.external_urls.spotify,
        name: data.name,
        picture: data.images[0]?.url || "",
      }
    }

    album.credits = []

    for (let [key, value] of Object.entries(data)) {
      switch (key) {
        case 'artists': {
          album.artists = value
            .map(artist => ({
              id: folder && artist.name === folder.name ? folder.id : null,
              name: artist.name,
              role: "main",
            }))
          break
        }
        case 'images': {
          album.picture = value[0]?.url ?? ""
          break
        }
        case 'external_ids': {
          album.upc_code = value.upc ?? ""
          break
        }
        case 'genres': {
          album.genres = value
          break
        }
        case 'label': {
          if (value) {
            album.record_labels = [{ name: value, catalog_n: "" }]
          }
          break
        }
        case 'release_date': {
          if (value.length === 10) {
            const date = new Date(value)
            if (!isNaN(date.getTime())) {
              album.release_date = date.toISOString()
              album.year = date.getFullYear().toString()
            }
          }
          break
        }
        case 'name': {
          album.title = value
          break
        }
        case 'total_tracks': {
          album.n_songs = value
          break
        }
        default: break;
      }
    }

    const trackMapper = processTrack(folder, album)
    album.songs = data.tracks.map(trackMapper)

    albums.push(album)
  }

  // console.log("\nProcessed data:", albums, "\n")

  return albums
}

/**
 * Parse spotify track data into faniak song data
 * @param {Object} artist_folder if you have a parent artist folder (optional)
 * @param {Object} album_data if the album data came from outside the track data (optional)
 * @returns faniak song data
 */
export const processTrack = (artist_folder = null, album_data = null) => (track) => {
  return {
    title: track.name,
    disk_n: track.disc_number,
    track_n: track.track_number,
    genres: album_data?.genres || track.album?.genres || [],
    record_label: album_data?.record_labels?.length ? album_data.record_labels[0].name : "",
    isrc_code: track.external_ids.isrc,
    parental_warning: track.explicit,
    duration_in_s: Math.floor(track.duration_ms / 1000),
    artists: track.artists.map(artist => ({
      id: artist_folder && artist.name === artist_folder.name ? artist_folder.id : null,
      name: artist.name,
      role: "main",
    })),
    connections: {
      [connectionNames.SPOTIFY]: {
        id: track.id,
        url: track.external_urls.spotify,
        name: track.name,
        picture: album_data?.picture || track.album?.images[0]?.url || "",
      }
    }
  }
}