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
      <PreviewItem label="Main language" value={metadata.title_language} handleCopy={copy} handleEdit={handleEdit} />
      <Divider />
      <PreviewItem label="Release date" value={release_date} handleEdit={handleEdit} />
      <PreviewItem label="Year" value={metadata.year} handleCopy={copy} handleEdit={handleEdit} />
      <Divider />
      <PreviewItem label="UPC" value={metadata.upc_code} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Record label" value={metadata.record_label} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Catalogue Number" value={metadata.catalog_n} handleCopy={copy} handleEdit={handleEdit} />
      <Divider />
      <PreviewItem label="Keywords" value={metadata.keywords.join(", ")} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Description" value={metadata.description} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Special thanks" value={metadata.special_thanks} handleCopy={copy} handleEdit={handleEdit} />
    </FormPreview>
  )
}