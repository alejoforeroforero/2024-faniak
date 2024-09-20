import { useMemo } from 'react';
import { Typography } from '@material-ui/core'
import { simplifyDate } from '../../../utils/dateUtils'

export default function Metadata({ song }) {
  const stats = useMemo(() => computeStats(song), [song])

  return (
    <div>
      {stats.length
        ? stats.map((stat, index) => (
          <Typography key={index} variant="body2">
            <b>{stat.label}:</b> {stat.value || "-"}
          </Typography>
        ))
        : (
          <Typography variant="body2">No extra metadata found.</Typography>
        )}
    </div>
  )
}

export const computeStats = (song) => {
  const list = []

  for (var key in song) {
    switch (key) {
      case 'title': break
      case 'artists': list.push({ label: "Artists", value: song[key].join(', ') }); break;
      case 'genres': list.push({ label: "Genres", value: song[key].join(', ') }); break;
      case 'isrc_code': list.push({ label: "ISRC", value: song[key] }); break;
      case 'bpm': list.push({ label: "BPM", value: song[key] }); break;
      case 'lyrics': list.push({ label: "Lyrics", value: song[key] }); break;
      case 'release_date': list.push({ label: "Release Date", value: simplifyDate(song[key]) }); break;
      case 'year': list.push({ label: "Year", value: song[key] }); break;
      default: break
    }
  }

  list.push({ label: "Album", value: song.album.title })
  list.push({ label: "Track Number", value: song.track_n })

  if (song.duration_in_s) {
    const minutes = Math.floor(song.duration_in_s / 60)
    const seconds = Math.floor(song.duration_in_s % 60)

    list.push({ label: "Duration", value: `${minutes}'${seconds}"` })
  }

  return list.filter(x => !!x.value)
}