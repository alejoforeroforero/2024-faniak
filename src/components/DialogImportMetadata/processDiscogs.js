import ar from "../../dictionary/artist_roles"
import instruments from "../../dictionary/avs/instruments.json"
import { connectionNames } from "../../dictionary/connection"

export async function processDiscogs({ results, folder }) {

  const albums = []

  results.forEach(({ selected, metadata: data }) => {
    if (!selected) return

    const album = {}

    album.connections = {
      discogs: {
        id: data.id,
        url: data.url,
        name: data.title,
        picture: data.thumb,
      }
    }

    album.credits = []

    for (let [key, value] of Object.entries(data)) {
      switch (key) {
        case 'artists': {
          album.artists = value
            .filter(artist => artist.id !== 194)
            .map(artist => {
              const artist_name = stripArtistName(artist.name)
              return ({
                id: artist_name === folder.name ? folder.id : null,
                name: artist_name,
                role: getArtistRole(artist.role),
              })
            })
          break
        }
        case 'extraartists': {
          album.credits = getCredits(value)
          break
        }
        case 'genres': {
          album.genres = [...value, ...(data.styles ?? [])]
          break
        }
        case 'label': {
          album.record_label = value
          break
        }
        case 'released': {
          if (value.length === 10) {
            const date = new Date(value)
            if (!isNaN(date.getTime())) {
              album.release_date = date.toISOString()
            }
          }
          break
        }
        case 'labels': {
          if (data.label) {
            album.record_labels = value
              .filter(x => x.name !== "Not On Label")
              .map(x => ({ name: x.name, catalog_n: x.catno === "none" ? "" : x.catno }))
          }
          break
        }
        case 'notes': {
          album.description = value
          break
        }
        case 'thumb': {
          album.picture = value
          break
        }
        case 'videos': {
          album[key] = value.map(x => ({ title: x.title, url: x.uri }))
          break
        }
        case 'title':
        case 'year': {
          album[key] = value
          break
        }
        default: break;
      }
    }

    album.songs = data.tracklist
      .filter(song => song.position)
      .map(song => ({
        title: song.title,
        ...getTrackPos(song.position),
        genres: album.genres,
        record_label: album.record_labels?.length ? album.record_labels[0].name : "",
        artists: song.artists
          ? song.artists.map(artist => {
            const artist_name = stripArtistName(artist.name)
            return ({
              id: artist_name === folder.name ? folder.id : null,
              name: artist_name,
              role: getArtistRole(artist.role),
            })
          })
          : [...album.artists],
        credits: getCredits(song.extraartists, album.credits),
        connections: {
          [connectionNames.DISCOGS]: {
            url: data.url,
            name: song.name,
            picture: album.picture,
          }
        }
      }))

    console.log("\nDiscogs release:", data)

    console.log("\nProcessed album:", album, "\n")

    albums.push(album)
  })

  return albums
}

const stripArtistName = (name) => {
  const trimmed = name.trim()

  // doesn't fit the "Artist (1)" format
  if (!/^.+ \(\d+\)$/g.test(trimmed)) return trimmed

  return trimmed
    .split(' (')
    .slice(0, -1)
    .join(' (')
}

const getCredits = (extraartists = [], initial = []) => {
  const credits = [...initial]

  extraartists.forEach(artist => {
    const artist_name = stripArtistName(artist.name)

    // console.log("regex:", artist.name, "=>", artist_name)

    const already_credited = credits.find(person => person.name === artist_name)
    const { played, wrote, others } = getCreditRoles(artist.role)
    if (already_credited) {
      already_credited.played = [...new Set([...already_credited.played, ...played])]
      already_credited.wrote = [...new Set([...already_credited.wrote, ...wrote])]
      already_credited.others = [...new Set([...already_credited.others, ...others])]
    } else {
      credits.push({
        member: null,
        name: artist.anv || artist_name || "",
        percentage_owned: 0,
        played, wrote, others
      })
    }
  })

  return credits
}

const getTrackPos = (pos) => {
  if (pos) {
    const [st, nd] = pos.split('-')

    if (st && nd) return { disk_n: parseInt(st), track_n: parseInt(nd) }

    return { track_n: parseInt(st), disk_n: 1 }
  }

  return {}
}

const getCreditRoles = (string) => {
  const roles = {
    played: [],
    wrote: [],
    others: [],
  }

  string
    .split(', ')
    .forEach(value => {
      if (value) {
        if (value === "Mastered By" || value === "Remastered By") {
          roles.others.push("Mastering Engineer")
        } else if (value === "Executive-Producer") {
          roles.others.push("Executive Producer")
        } else if (value === "Recorded By") {
          roles.others.push("Recording Engineer")
        } else if (value === "Mixed By") {
          roles.others.push("Mixing Engineer")
        } else if (value === "Producer") {
          roles.others.push("Producer")
        } else if (value === "Design" || value === "Illustration") {
          roles.others.push("Artwork")
        } else if (value === "Lyrics By") {
          roles.wrote.push("Lyrics")
        } else if (value === "Music By") {
          roles.wrote.push("Song")
        } else if (value === "Written-By") {
          roles.wrote.push("Song")
          roles.wrote.push("Lyrics")
        } else if (instruments.includes(value)) {
          roles.played.push(value)
        } else roles.others.push(value)
      }
    })

  return roles
}

const getArtistRole = (string) => {
  if (string) {
    const trimmed = string.toLowerCase().trim()
    if (trimmed.includes("feat")) return ar.FEAT
    if (trimmed.includes("remix")) return ar.REMIX
  }

  return ar.MAIN
}