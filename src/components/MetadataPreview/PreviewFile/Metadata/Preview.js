import { useMemo } from 'react';
import FormPreview, { PreviewItem } from '../../../form/FormPreview'
import { Divider } from '@material-ui/core'
import { simplifyDatetime } from '../../../../utils/dateUtils'

export default function Preview({ metadata }) {
  const [createdTime, modifiedTime] = useMemo(() => {
    return [
      simplifyDatetime(metadata.createdTime),
      simplifyDatetime(metadata.modifiedTime),
    ]
  }, [metadata])

  return (
    <FormPreview>
      <PreviewItem label="Name" value={metadata.name} />
      <PreviewItem label="Owned by me" value={metadata.ownedByMe ? "Yes" : "No"} />
      {!!metadata.size && ( // folders have undefined size
        <PreviewItem label="Size" value={metadata.size} />
      )}

      <Divider />
      <PreviewItem label="Created on" value={createdTime} />
      <PreviewItem label="Modified on" value={modifiedTime} />
    </FormPreview>
  )
}