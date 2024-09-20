import { useCallback } from 'react';
import { useSnackbar } from 'notistack'
import FormPreview, { PreviewItem } from '../../../form/FormPreview'
import { Divider } from '@material-ui/core'

export default function Preview({ metadata, handleEdit }) {
  const { enqueueSnackbar } = useSnackbar()

  const copy = useCallback((value) => {
    navigator.clipboard.writeText(value)
    enqueueSnackbar("Copied to clipboard!", { variant: "success" })
  }, [])

  return (
    <FormPreview>
      <PreviewItem label="Name" value={metadata.name} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Country" value={metadata.country} handleCopy={copy} handleEdit={handleEdit} />
      <Divider />
      {!metadata.bios[0].text ? (
        <PreviewItem label="Biography" handleEdit={handleEdit} />
      ) : (
        metadata.bios.map((bio, i) => (
          <PreviewItem
            label={bio.label || `Biography #${i + 1}`}
            value={bio.text}
            handleCopy={copy} key={i} handleEdit={handleEdit} />
        ))
      )}
    </FormPreview >
  )
}