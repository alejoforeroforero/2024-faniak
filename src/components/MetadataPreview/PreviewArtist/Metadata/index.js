import { useState, useEffect, useMemo } from 'react';
import DialogEdit from './DialogEdit'
import PreviewSection from '../../PreviewSection'
import { formParsers } from '../../../../utils/formUtils'
import Preview from './Preview'

const parseBios = (value) => {
  if (!value.length) return [{ key: 1, label: "", text: "" }]
  return value.map((bio, i) => ({
    key: bio.key || i,
    label: bio.label || "",
    text: bio.text || "",
  }))
}

export default function Metadata({ folder, fetchContent, canEdit }) {
  const [showDialog, setShowDialog] = useState(false)
  const handleOpenDialog = () => setShowDialog(true)
  const handleCloseDialog = () => setShowDialog(false)

  const metadata = useMemo(() => {
    const data = {
      name: formParsers.text(folder.data.name),
      country: formParsers.text(folder.data.country),
      bios: parseBios(folder.data.bios),
    }

    return data
  }, [folder])

  return (
    <PreviewSection text="Metadata">
      <Preview metadata={metadata} handleEdit={canEdit && handleOpenDialog} />

      {showDialog && (
        <DialogEdit
          folder={folder}
          handleClose={handleCloseDialog}
          metadata={metadata}
          fetchContent={fetchContent}
        />
      )}
    </PreviewSection>
  )
}