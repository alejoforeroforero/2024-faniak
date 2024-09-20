import { CHROME_EXTENSION_URL } from "../store"
import { updateExtensionData } from "../utils/updateExtensionData"
import { folderTypes } from "./folder"
import GetAppIcon from '@material-ui/icons/GetApp'
import SendIcon from '@material-ui/icons/Send'
import { logUserEvent, userEventNames } from "../api/metrics/logUserEvent"

const serviceActions = {
  DISTRIBUTION: "distribution",
  COPYRIGHTS: "copyrights",
  MUSIC_DATABASES: "music_databases",
}

const actionLabels = {
  [serviceActions.COPYRIGHTS]: "Collecting Society",
  [serviceActions.MUSIC_DATABASES]: "Database",
  [serviceActions.DISTRIBUTION]: "Distributor",
}

const services = {
  cdbaby: {
    label: "CD Baby",
    action: serviceActions.DISTRIBUTION,
    redirect: "https://members.cdbaby.com/dashboard",
    folder_types: [folderTypes.ALBUM],
  },
  discogs: {
    label: "Discogs",
    action: serviceActions.MUSIC_DATABASES,
    redirect: "https://www.discogs.com/release/add",
    folder_types: [folderTypes.ALBUM],
  },
  distrokid: {
    label: "Distrokid",
    action: serviceActions.COPYRIGHTS,
    redirect: "https://distrokid.com/new",
    folder_types: [folderTypes.ALBUM],
  },
  gda: {
    label: "GDA",
    redirect: "https://portal.gda.pt/RepertoireMng/Repertoire.aspx",
    folder_types: [folderTypes.ALBUM, folderTypes.SONG],
  },
  onelevelup: {
    label: "One Level Up",
    action: serviceActions.DISTRIBUTION,
    redirect: "https://login.onelevelupmusic.com/catalog/products",
    folder_types: [folderTypes.ALBUM],
  },
  prs: {
    label: "PRS for Music",
    action: serviceActions.COPYRIGHTS,
    redirect: "https://apps.prsformusic.com/OLR/Home.aspx",
    folder_types: [folderTypes.SONG],
  },
  spa: {
    label: "SPA",
    action: serviceActions.COPYRIGHTS,
    redirect: "https://myspa.spautores.pt",
    folder_types: [folderTypes.ALBUM, folderTypes.SONG],
  },
  spedidam: {
    label: "SPEDIDAM",
    action: serviceActions.COPYRIGHTS,
    redirect: "https://myspedidam.fr/Declaration",
    folder_types: [folderTypes.ALBUM, folderTypes.SONG],
  },
}

export const getServiceLabel = (name) => services[name]?.label || ""

export const buildSendToMenu = ({ folder, state }) => {
  const { user } = state

  const sub_items = Object.keys(services)
    .map(name => {
      const curr_service = services[name]
      return {
        label: curr_service.label,
        disabled: !state.magic_sync_installed || !curr_service.folder_types.find(type => type === folder.type),
        callback: () => {
          updateExtensionData({ folder, user })
            .then(() => {
              logUserEvent(userEventNames.SEND_TO_MAGICSYNC, name)
              window.open(curr_service.redirect, '_blank').focus()
            })
        },
      }
    })

  if (!state.magic_sync_installed) {
    sub_items.unshift({
      label: "Install Chrome Extension",
      icon: GetAppIcon,
      callback: () => window.open(CHROME_EXTENSION_URL, '_blank').focus(),
    })
  }

  return {
    label: "Send To",
    icon: SendIcon,
    disabled: !sub_items.length,
    items: sub_items,
  }
}