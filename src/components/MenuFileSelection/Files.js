import { useState, useEffect } from 'react';
import { getMimeType, googleMimeTypes } from '../../api/google/store'
import FileThumbnail from '../FileThumbnail'
import { folderColors, folderIcons } from '../../dictionary/folder'
import File from './File'
import { CircularProgress } from '@material-ui/core'

export default function Files({
  files = [],
  updateSelection, // (selected files) => {}
  changeSelectionFolder,
  loading = false,
  multiple,
}) {
  const [selectedIndexes, setSelectedIndexes] = useState([])

  useEffect(() => {
    setSelectedIndexes([])
  }, [files])

  useEffect(() => {
    const selected_files = selectedIndexes.map(file_index => files[file_index])
    updateSelection(selected_files)
  }, [selectedIndexes])

  const handleSelectItem = (item_index) => (event) => {
    event.stopPropagation()

    if (selectedIndexes.includes(item_index)) {
      setSelectedIndexes(prev => prev.filter(x => x !== item_index))
    }
    else if (multiple) {
      setSelectedIndexes(prev => [...prev, item_index])
    }
    else {
      setSelectedIndexes([item_index])
    }
  }

  return (
    <div style={{
      height: 360,
      width: 360,
      overflowY: "auto",
    }}>
      {loading ? (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress size={40} />
        </div>
      ) : (
        files.map((file, index) => {
          const is_folder = getMimeType(file) === googleMimeTypes.FOLDER

          let onClick = null
          let icon = <FileThumbnail file={file} size={26} disabledBorder />

          if (is_folder) {
            const Icon = folderIcons[file.smart_folder?.type || ""]
            const color = folderColors[file.smart_folder?.type || ""]
            icon = <Icon style={{ color }} size="small" />
            onClick = () => changeSelectionFolder(file)
          }

          return (
            <File
              key={file.id}
              name={file.name}
              disabled_reason={file.disabled_reason}
              icon={icon}
              checked={selectedIndexes.includes(index)}
              toggleCheckbox={handleSelectItem(index)}
              onClick={onClick}
            />
          )
        })
      )}
    </div>

  )
}