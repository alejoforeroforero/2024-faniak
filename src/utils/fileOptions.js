import { deleteGoogleFiles, downloadFiles, fileIsDownloadable } from "./fileUtils"
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import FolderSpecialIcon from '@material-ui/icons/FolderSpecial'
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined'
import SendIcon from '@material-ui/icons/Send'
import InputIcon from '@material-ui/icons/Input'
import { canEditFile, getId, getMimeType, getTargetFile, googleMimeTypes } from "../api/google/store"
import { buildSendToMenu } from '../dictionary/service'
import DriveIcon from "../svg/DriveIcon"
import { folderLabels, getAvailableExportNames, getColoredFolderIcon, getExportLabel, smartFolderTypesList } from "../dictionary/folder"
import { createFolder } from "../api/folder/create"
import { routes } from "../Routes"
import LinkIcon from '@material-ui/icons/Link'
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined'
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined'

export const fileOptions = {}

fileOptions.open = (files) => {
  return {
    label: "Open in Google Drive",
    icon: DriveIcon,
    callback: () => {
      for (const file of files) {
        let url = getTargetFile(file).webViewLink
        window.open(url, '_blank').focus()
      }
    }
  }
}

fileOptions.makeSmart = (files, { dispatch, fetchContent }) => {
  const disabled = files.length > 1 || !canEditFile(getTargetFile(files[0]))
  const hidden = !isFolder(files[0]) || files[0].smart_folder
  return {
    label: "Make Smart Folder",
    disabled: disabled,
    hidden: hidden,
    icon: (props) => <FolderSpecialIcon color="primary" {...props} />,
    items: disabled || hidden ? [] : smartFolderTypesList.map(type => ({
      label: folderLabels[type],
      icon: getColoredFolderIcon(type),
      callback: () => {
        const targetFile = getTargetFile(files[0])
        createFolder(type)({
          google_folder_id: getId(targetFile),
          name: targetFile.name,
        }, dispatch).then(res => {
          if (res.error) return
          fetchContent()
        })
      }
    }))
  }
}

fileOptions.download = (files) => {
  return {
    label: "Download",
    icon: CloudDownloadOutlinedIcon,
    disabled: !files.some(fileIsDownloadable),
    callback: () => {
      downloadFiles(files)
    },
  }
}

fileOptions.rename = (files, { setShowDialog }) => {
  return {
    label: "Rename",
    disabled: files.length > 1 || !canEditFile(getTargetFile(files[0])),
    icon: CreateOutlinedIcon,
    callback: () => setShowDialog(true)
  }
}

fileOptions.delete = (files, {
  fetchContent,
  history,
  dispatch,
  redirectOnDeletion,
  enqueueSnackbar,
  closeSnackbar,
}) => {
  return {
    label: files.some(file => file.mimeType === googleMimeTypes.SHORTCUT) ? "Delete shortcut" : "Delete",
    icon: DeleteOutlineIcon,
    disabled: files.some(file => !canEditFile(file)),
    callback: () => deleteGoogleFiles(files, {
      callback: fetchContent,
      enqueueSnackbar,
      closeSnackbar
    })
      .then(() => {
        // redirect to parent (if you're deleting the folder that's currently open)
        if (redirectOnDeletion && files[0].parents) {
          history.push(routes.folder(files[0].parents[0]))
        }
        // deselect folder (so that it wont stay in the metadata preview after deletion)
        if (!redirectOnDeletion && dispatch) {
          dispatch({
            type: "SET",
            data: { selected_file: null }
          })
        }
      })
  }
}

fileOptions.share = (files, { setShowDialog }) => {
  return {
    label: "Share",
    icon: PersonAddOutlinedIcon,
    disabled: !(files.length === 1),
    callback: () => setShowDialog(true)
  }
}

fileOptions.shareWithLink = (files, { setShowDialog }) => {
  return {
    label: "Get link",
    icon: LinkIcon,
    disabled: !(files.length === 1),
    callback: () => setShowDialog(true)
  }
}

fileOptions.send = (files, { state }) => {
  var items = []

  if (files.length === 1 && files[0].smart_folder) {
    items = buildSendToMenu({
      folder: files[0].smart_folder,
      state: state
    }).items
  }

  return {
    label: "Send to",
    icon: SendIcon,
    disabled: !items.length,
    items: items,
  }
}

fileOptions.move = (files, { onClick }) => {
  return {
    label: "Move",
    icon: InputIcon,
    disabled: files.some(file => !canEditFile(file)),
    callback: onClick,
  }
}

fileOptions.export = (files, { setFileKey }) => {
  const exportNames = getAvailableExportNames(files[0].smart_folder?.type)
  return {
    label: "Export",
    disabled: !exportNames.length,
    hidden: !files[0].smart_folder,
    icon: InsertDriveFileOutlinedIcon,
    items: exportNames.map(fileKey => ({
      label: getExportLabel(fileKey),
      callback: () => setFileKey(fileKey),
    })),
  }
}

const isFolder = (file) => getMimeType(file) === googleMimeTypes.FOLDER