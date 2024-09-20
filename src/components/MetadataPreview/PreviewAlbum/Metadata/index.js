import { useState, useMemo } from 'react';
import DialogEdit from './DialogEdit'
import PreviewSection from '../../PreviewSection'
import { formParsers } from '../../../../utils/formUtils'
import Preview from './Preview'

export default function Metadata({ folder, fetchContent, canEdit }) {
  const [showDialog, setShowDialog] = useState(false)
  const handleOpenDialog = () => setShowDialog(true)
  const handleCloseDialog = () => setShowDialog(false)

  const metadata = useMemo(() => {
    const data = {
      title: formParsers.text(folder.data.title),
      main_genre: formParsers.text(folder.data.genres[0]),
      other_genres: formParsers.list(folder.data.genres.slice(1)),
      title_language: formParsers.text(folder.data.title_language),
      release_date: formParsers.date(folder.data.release_date),
      year: formParsers.text(folder.data.year),
      upc_code: formParsers.text(folder.data.upc_code),
      record_label: formParsers.text(folder.data.record_labels[0]?.name),
      catalog_n: formParsers.text(folder.data.record_labels[0]?.catalog_n),
      keywords: formParsers.list(folder.data.keywords),
      description: formParsers.text(folder.data.description),
      special_thanks: formParsers.text(folder.data.special_thanks),
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