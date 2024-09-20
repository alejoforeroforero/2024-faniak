import { Button } from "@material-ui/core"
import SnackbarWithActions from "../components/SnackbarWithActions"
import { defaultGoogleExports, getFileProps, getId, getMimeType, getTargetFile, googleMimeTypes } from '../api/google/store'
import { createFile, uploadFile } from '../api/drive/createFile'
import { updateFiles } from '../api/drive/updateFiles'
import { updateFile } from '../api/drive/updateFile'
import { exportFile } from '../api/drive/exportFile'

// returns ["name", "extension"]
export const splitFileName = (name) => {
  const strings = name.split(".")
  // files without extension, ex: Dockerfile
  if (strings.length === 1) return [name, ""]
  // files without name, ex: .gitignore
  if (strings.length === 2 && !strings[0]) return [name, ""]
  const extension = strings.pop()
  return [strings.join("."), extension]
}

export const downloadFiles = (files) => {
  for (const file of files) {
    const targetFile = getTargetFile(file)
    const mimeType = getMimeType(targetFile)
    const exportMimeType = defaultGoogleExports[mimeType]

    if (exportMimeType) {
      exportFile({
        id: getId(targetFile),
        mimeType: exportMimeType,
      }).then(res => {
        if (res.error) return

        const url = window.URL.createObjectURL(res.blob);
        downloadWithLink(url, targetFile.name)
        window.URL.revokeObjectURL(url)
      })
    } else if (fileIsDownloadable(targetFile)) {
      downloadWithLink(targetFile.webContentLink, targetFile.name)
    }
  }
}

export const fileIsDownloadable = (file) => {
  const forbiddenMimeTypes = [
    googleMimeTypes.FOLDER,
    googleMimeTypes.FORM,
  ]
  if (forbiddenMimeTypes.includes(getMimeType(file))) return false
  return true
}

const downloadWithLink = (url, name) => {
  var element = document.createElement('a')
  element.setAttribute('href', url)
  element.setAttribute('download', name)
  element.setAttribute('target', "_blank")
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export const bytesToSize = (bytes) => {
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) return '0 B'
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

export async function downloadWithExtension({ folders = [], files = [] }) {
  const downloads = []
  const promises = []

  const downloadFiles = (files, path = "") => {
    for (const file of files) {
      downloads.push({
        path: path + file.name,
        url: file.media_url
      })
    }
  }

  const fetchFolderContents = async (folder, path = "") => {
    path += folder.name + "/"

    // await getChildFolders({ folder_id: folder.id })
    //   .then(res => {
    //     if (res.error) return
    //     for (const folder of res.folders) {
    //       promises.push(
    //         fetchFolderContents(folder, path)
    //       )
    //     }
    //   })

    // await getFiles({ folder_id: folder.id })
    //   .then(res => {
    //     if (res.error) return
    //     downloadFiles(res.files, path)
    //   })
  }

  downloadFiles(files)

  for (const folder of folders) {
    await fetchFolderContents(folder)
  }

  await Promise.all(promises)

  localStorage.setItem("downloadData", JSON.stringify(downloads))

  document.getElementById("extensionDownload").click()
}




export async function uploadFileStructure({ files, dispatch, parent_id, refreshParent }) {

  const newStructureNode = (name = "") => ({
    name: name,
    files: [],
    folders: [],
  })

  const addToStructure = (curr_level, file, path_ahead) => {

    if (path_ahead.length <= 1) {
      curr_level.files.push(file)
      return
    }

    const folder_name = path_ahead.shift()

    const folder = curr_level.folders.find(folder => folder.name === folder_name)

    if (folder) {
      addToStructure(folder, file, path_ahead)
      return
    }

    const new_level = newStructureNode(folder_name)

    curr_level.folders.push(new_level)
    addToStructure(new_level, file, path_ahead)
  }

  const submitFolder = ({ structure, promises, dispatch, parent_id, refreshParent }) => {
    const { folders, files } = structure

    folders.forEach(folder => {
      const payload = {
        resource: {
          name: folder.name,
          parents: [parent_id],
          mimeType: googleMimeTypes.FOLDER,
        }
      }

      promises.push(
        createFile(payload)
          .then(res => {
            if (res.error) return

            if (!structure.name) {
              refreshParent?.()
            }

            submitFolder({
              structure: folder,
              promises: promises,
              dispatch: dispatch,
              parent_id: res.file.id,
              refreshParent: refreshParent,
            })
          })
      )
    })

    files.forEach(file => {
      const payload = {
        file: file,
        parent: parent_id,
      }

      promises.push(
        uploadFile(payload, { dispatch })
          .then(res => {
            if (res.error) return

            if (!structure.name) {
              refreshParent?.()
            }
          })
      )
    })
  }

  const promises = []

  const structure = newStructureNode()

  files.forEach((file) => {
    const path = file.path.split('/').slice(1)

    addToStructure(structure, file, path)
  })

  submitFolder({
    structure: structure,
    promises: promises,
    dispatch: dispatch,
    parent_id: parent_id,
    refreshParent: refreshParent,
  })

  return await Promise.all(promises)
}

const moveFiles = async (files, addParents, undo = false) => {
  await Promise.all(
    files.map(file => {
      const removeParents = file.parents.join(',')
      return updateFile({
        fileId: file.id,
        addParents: undo ? removeParents : addParents,
        removeParents: undo ? addParents : removeParents,
      })
    })
  )
}

export const moveFilesToGoogleFolder = async (files, parent, options = {}) => {
  const { enqueueSnackbar, closeSnackbar, callback } = options

  await moveFiles(files, parent.id)
  if (enqueueSnackbar) {
    var snackbarKey = null

    const handleUndo = async () => {
      await moveFiles(files, parent.id, true)

      closeSnackbar?.(snackbarKey)
      enqueueSnackbar("Your files has been restored.")
      callback?.()
    }

    snackbarKey = enqueueSnackbar(
      <SnackbarWithActions text={`Your files have been moved to ${parent.name}.`}>
        <Button color="primary" onClick={handleUndo}>Undo</Button>
      </SnackbarWithActions>
    )
  }

  callback?.()
}

export const deleteGoogleFiles = async (files, options = {}) => {
  const { enqueueSnackbar, closeSnackbar, callback } = options
  const id_list = files.map(file => file.id)

  await updateFiles({
    id_list,
    resource: {
      trashed: true,
    },
  })
    .then(res => {
      if (res.error) {
        if (enqueueSnackbar) enqueueSnackbar(`We were unable to delete your files.`, { variant: "error" })
        return
      }

      if (enqueueSnackbar) {
        var snackbarKey = null
        const handleUndo = () => {
          updateFiles({
            id_list,
            resource: {
              trashed: false,
            },
          })
            .then(res => {
              if (res.error) return

              closeSnackbar?.(snackbarKey)
              enqueueSnackbar("Your files have been restored.")
              callback?.()
            })
        }

        snackbarKey = enqueueSnackbar(
          <SnackbarWithActions text={"Your files have been moved to the trash."}>
            <Button color="primary" onClick={handleUndo}>Undo</Button>
          </SnackbarWithActions>
        )
      }

      callback?.()
    })
}

/**
 * Sets a file's isShared property to true, if it's not already set
 */
export const setFileIsShared = async file => {
  if (getFileProps.isShared(file)) return

  await updateFile({
    fileId: file.id,
    resource: {
      appProperties: { isShared: "1" },
    },
  })
}