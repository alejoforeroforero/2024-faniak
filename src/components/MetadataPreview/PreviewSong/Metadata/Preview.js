import { useCallback, useMemo } from 'react';
import { useSnackbar } from 'notistack'
import FormPreview, { PreviewItem } from '../../../form/FormPreview'
import { Divider } from '@material-ui/core'
import { simplifyDate } from '../../../../utils/dateUtils'

export default function Preview({ metadata, handleEdit }) {
  const { enqueueSnackbar } = useSnackbar()

  const copy = useCallback((value) => {
    navigator.clipboard.writeText(value)
    enqueueSnackbar("Copied to clipboard!", { variant: "success" })
  }, [])

  const release_date = useMemo(() => {
    return simplifyDate(metadata.release_date)
  }, [metadata])

  return (
    <FormPreview>
      <PreviewItem label="Title" value={metadata.title} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Main genre" value={metadata.main_genre} handleCopy={copy} handleEdit={handleEdit} />
      {!!metadata.main_genre && (
        <PreviewItem label="Secondary genres" value={metadata.other_genres.join(", ")} handleCopy={copy} handleEdit={handleEdit} />
      )}
      <PreviewItem label="It's a cover" value={metadata.is_cover ? "Yes" : "No"} handleEdit={handleEdit} />
      <PreviewItem label="It's a version" value={metadata.is_version ? "Yes" : "No"} handleEdit={handleEdit} />
      {metadata.is_version && (
        <PreviewItem label="Version" value={metadata.version} handleCopy={copy} handleEdit={handleEdit} />
      )}
      <Divider />
      <PreviewItem label="ISRC" value={metadata.isrc_code} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="ISWC" value={metadata.iswc_code} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Tunecode" value={metadata.tunecode} handleCopy={copy} handleEdit={handleEdit} />
      <Divider />
      <PreviewItem label="It's an instrumental" value={metadata.is_instrumental ? "Yes" : "No"} handleEdit={handleEdit} />
      {!metadata.is_instrumental && (<>
        <PreviewItem label="Parental warning" value={metadata.parental_warning ? "Yes" : "No"} handleEdit={handleEdit} />
        <PreviewItem label="Lyrics" value={metadata.lyrics} handleCopy={copy} handleEdit={handleEdit} />
        <PreviewItem label="Main language" value={metadata.lyrics_language} handleCopy={copy} handleEdit={handleEdit} />
      </>)}
      <Divider />
      <PreviewItem label="Release date" value={release_date} handleEdit={handleEdit} />
      <PreviewItem label="Year" value={metadata.year} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Record label" value={metadata.record_label} handleCopy={copy} handleEdit={handleEdit} />
      {!!metadata.record_label && (
        <PreviewItem label="Label owns master" value={metadata.record_label_owns_master ? "Yes" : "No"} handleEdit={handleEdit} />
      )}
      <PreviewItem label="Tempo/BPM" value={metadata.bpm} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Key" value={metadata.key} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Moods" value={metadata.mood.join(", ")} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Keywords" value={metadata.keywords.join(", ")} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Description" value={metadata.description} handleCopy={copy} handleEdit={handleEdit} />
    </FormPreview>
  )
}