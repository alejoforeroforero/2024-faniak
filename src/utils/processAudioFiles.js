import * as mm from 'music-metadata-browser'

/*
    >only works for audio files
@param files is the array retrieved from an input of type="file"
@returns 
    {
        songs: [
            title: "",
            ...
            metadata: {}
        ]
        album: {
            title: "",
            ...
        }
    }
*/

export default async function processAudioFiles(files) {

    if (!files.length) return

    const songs = []

    for (let [, file] of Object.entries(files)) {
        try {
            const song = await processFile(file)

            songs.push(song)
        }
        catch (err) {
            console.error(err)
        }
    }

    // sort by track number or by song title (if title starts with a number)
    songs.sort((a, b) => parseInt(a.track_n || a.title) - parseInt(b.track_n || b.title))

    const album = compileAlbumData(songs)

    console.log("Retrieved:", { songs, album })

    return { songs, album }
}



const compileAlbumData = (songs) => {

    const reducer = (acc, song) => {
        // get album data from song
        for (var key in song.album) {
            if (!propertyIsDefined(song.album, key)) continue

            acc[key] = song.album[key]
        }

        // get song artwork if exists
        if (song.artwork) {
            acc.artwork = song.artwork
        }

        // get artists from song if not already collected
        song.artists.forEach(artist => {
            if (acc.artists.includes(artist)) return

            acc.artists.push(artist)
        })

        acc.genres = [...new Set([...song.genres, ...acc.genres])]

        return acc
    }

    const initial = {
        artists: [],
        genres: []
    }

    const data = songs.reduce(reducer, initial)

    if (data.artwork) {
        data.artwork = parseArtworkFile(data.artwork)
    }

    return data
}

// CREATES URL OBJECT (DO NOT USE REPEATEDLY)
const parseArtworkFile = (file) => {
    // const options = { type: artwork.type }

    // const blob = new Blob([artwork.file.data], options)

    // const file = new File([blob], artwork.name, options)

    const url = window.URL
        ? window.URL.createObjectURL(file)
        : window.webkitURL.createObjectURL(file)

    return { file, url }
}



const propertyIsDefined = (obj, key) => obj.hasOwnProperty(key) && obj[key] != null

const getSongArtists = (common) => {
    if (common.artists) return common.artists
    if (common.artist) return [common.artist]
    return []
}

async function processFile(file) {

    const song = {
        album: {}
    }

    const metadata = await mm.parseBlob(file)

    const { common, format } = metadata

    console.log(`Metadata from ${file.name}:`, metadata)

    const file_extension = file.name
        .split('.')
        .pop()
        .toLowerCase()

    const [file_name] = file.name.split(`.${file_extension}`)

    song.title = common.title || file_name || ""
    song.artists = getSongArtists(common)
    song.genres = common.genre || []
    song.bpm = common.bpm
    song.isrc_code = common.isrc?.join(', ') || ""
    song.track_n = common.track?.no || 0
    song.disk_n = common.disk?.no || 0
    song.duration_in_s = Math.floor(format.duration || 0)
    song.file = file

    song.album.title = common.album
    song.album.year = common.year

    const artwork_file = mm.selectCover(common.picture)

    if (artwork_file) {

        // console.log("2nd artwork", artwork_file)
        const [main_type, extension] = artwork_file.format.split('/')

        const new_name = `${song.title} (cover).${extension}`

        const options = { type: artwork_file.format }

        const blob = new Blob([artwork_file.data], options)

        // const file = new File([blob], artwork.name, options)

        const named_file = new File([blob], new_name, options)

        song.artwork = named_file

        // console.log("3rd artwork", named_file)
    }

    return song
}