import DiscogsIcon from "../svg/DiscogsIcon"
import SpotifyIcon from "../svg/SpotifyIcon"

export const connectionNames = {
  DISCOGS: "discogs",
  SPOTIFY: "spotify",
}

export const connectionDictionary = {
  [connectionNames.DISCOGS]: {
    label: "Discogs",
    url: "https://www.discogs.com",
    Icon: DiscogsIcon,
  },
  [connectionNames.SPOTIFY]: {
    label: "Spotify",
    url: "https://www.spotify.com",
    Icon: SpotifyIcon,
  },
}