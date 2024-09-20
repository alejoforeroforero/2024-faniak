
import AlbumIcon from '@material-ui/icons/Album'
import SongIcon from '@material-ui/icons/MusicNote'
import FolderIcon from '@material-ui/icons/Folder'
import PromoIcon from '@material-ui/icons/Share'
import GigIcon from '@material-ui/icons/Speaker'
import ArtistIcon from '@material-ui/icons/People'
import StarIcon from '@material-ui/icons/Star'

const types = {
  FOLDER: "folder",
  ARTIST: "artist",
  ALBUM: "album",
  SONG: "song",
  PROMO: "promo",
  GIG: "gig",
}

export const folderTypes = types

export const folderLabels = {
  [""]: "Folder",
  [types.FOLDER]: "Folder",
  [types.ARTIST]: "Artist",
  [types.ALBUM]: "Album",
  [types.SONG]: "Song",
  [types.PROMO]: "Promo",
  [types.GIG]: "Gig",
}

export const getFolderLabelPlural = (type) => {
  switch (type) {
    case types.PROMO: return `${folderLabels[type]} folders`
    default: return `${folderLabels[type]}s`
  }
}

export const folderColors = {
  "": "#848484",
  [types.FOLDER]: "#848484",
  [types.ARTIST]: "#936fcb",
  [types.ALBUM]: "#f67ea4",
  [types.SONG]: "#eba545",
  [types.PROMO]: "#5CA1A1",
  [types.GIG]: "#77c048",
}

export const folderIcons = {
  "": FolderIcon,
  [types.FOLDER]: FolderIcon,
  [types.ARTIST]: StarIcon,
  [types.ALBUM]: AlbumIcon,
  [types.SONG]: SongIcon,
  [types.PROMO]: PromoIcon,
  [types.GIG]: GigIcon,
}

export const smartFolderTypesList = [
  types.ARTIST,
  types.ALBUM,
  types.SONG,
  // types.PROMO,
  types.GIG,
]

export const getColoredFolderIcon = (folderType) => (props) => {
  const Icon = folderIcons[folderType]
  const color = folderColors[folderType]
  if (!Icon || !color) return null
  return <Icon style={{ color }} {...props} />
}

export const exportNames = {
  RUN_SHEET: "run_sheet",
  LABEL_COPY: "label_copy",
}

export const getAvailableExportNames = (folderType) => {
  switch (folderType) {
    case folderTypes.ALBUM: return [exportNames.LABEL_COPY]
    case folderTypes.GIG: return [exportNames.RUN_SHEET]
    default: return []
  }
}

export const getExportLabel = (type) => {
  switch (type) {
    case exportNames.LABEL_COPY: return "Label copy"
    case exportNames.RUN_SHEET: return "Run sheet"
    default: ""
  }
}