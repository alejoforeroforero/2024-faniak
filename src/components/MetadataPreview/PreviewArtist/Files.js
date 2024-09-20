import ReferredFile from '../ReferredFile'
import PreviewSection from '../PreviewSection'
import { Card } from '@material-ui/core'

export default function Files({ folder, fetchContent, canEdit }) {
  return (
    <PreviewSection text="Profile Picture">
      <Card variant="outlined">
        <ReferredFile
          folder={folder}
          canEdit={canEdit}
          fileKey="picture"
          fetchContent={fetchContent}
          mimeType="image/*"
        />
      </Card>
    </PreviewSection>
  )
}