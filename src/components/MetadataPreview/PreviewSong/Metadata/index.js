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
      isrc_code: formParsers.text(folder.data.isrc_code),
      iswc_code: formParsers.text(folder.data.iswc_code),
      tunecode: formParsers.text(folder.data.tunecode),
      parental_warning: formParsers.boolean(folder.data.parental_warning),
      is_cover: formParsers.boolean(folder.data.is_cover),
      is_version: formParsers.boolean(folder.data.version),
      version: formParsers.text(folder.data.version),
      is_instrumental: formParsers.boolean(folder.data.is_instrumental),
      keywords: formParsers.list(folder.data.keywords),
      mood: formParsers.list(folder.data.mood),
      bpm: formParsers.text(folder.data.bpm),
      key: formParsers.text(folder.data.key),
      lyrics: formParsers.text(folder.data.lyrics),
      lyrics_language: formParsers.text(folder.data.lyrics_language),
      release_date: formParsers.date(folder.data.release_date),
      year: formParsers.text(folder.data.year),
      record_label: formParsers.text(folder.data.record_label),
      record_label_owns_master: formParsers.boolean(folder.data.record_label_owns_master),
      description: formParsers.text(folder.data.description),
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