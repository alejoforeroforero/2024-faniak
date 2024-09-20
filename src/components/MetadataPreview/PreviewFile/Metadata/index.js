import { useMemo } from 'react';
import { bytesToSize } from '../../../../utils/fileUtils'
import PreviewSection from '../../PreviewSection'
import Preview from './Preview'

export default function Metadata({ file }) {
  const metadata = useMemo(() => {
    const data = {
      modifiedTime: file.modifiedTime,
      createdTime: file.createdTime,
      name: file.name,
      size: file.size ? bytesToSize(file.size) : null,
      ownedByMe: file.ownedByMe,
    }

    return data
  }, [file])

  return (
    <PreviewSection text="Metadata">
      <Preview metadata={metadata} />
    </PreviewSection>
  )
}