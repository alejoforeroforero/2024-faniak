import { getId } from '../../../api/google/store'
import ReferredFile from '../ReferredFile'
import PreviewSection from '../PreviewSection'
import { Card } from '@material-ui/core'
import { useCallback } from 'react'

export default function Files({ folder, fetchContent, canEdit }) {

  // file will be null if user removes audio file
  const processAudioFile = useCallback((file) => {
    const payload = { audio: null }

    if (file) {
      const props = file.appProperties || {}

      if (!folder.data.duration_in_s && parseInt(props.duration_in_s)) {
        payload.duration_in_s = parseInt(props.duration_in_s)
      }

      if (!folder.data.bpm && props.bpm) {
        payload.bpm = props.bpm
      }

      if (!folder.data.isrc_code && props.isrc_code) {
        payload.isrc_code = props.isrc_code
      }

      if (!folder.data.disk_n && parseInt(props.disk_n)) {
        payload.disk_n = parseInt(props.disk_n)
      }

      if (!folder.data.track_n && parseInt(props.track_n)) {
        payload.track_n = parseInt(props.track_n)
      }

      if (!folder.data.year && parseInt(props.year)) {
        payload.year = parseInt(props.year)
      }

      if (!folder.data.genres?.length && props.genres) {
        payload.genres = props.genres.split(',')
      }
    }

    return payload
  }, [])

  return (
    <>
      <PreviewSection text="Master Audio">
        <Card variant="outlined">
          <ReferredFile
            canEdit={canEdit}
            folder={folder}
            fileKey="audio"
            fetchContent={fetchContent}
            processFile={processAudioFile}
            mimeType="audio/*"
          />
        </Card>
      </PreviewSection>
      <PreviewSection text="Song Artwork">
        <Card variant="outlined">
          <ReferredFile
            canEdit={canEdit}
            folder={folder}
            fileKey="cover"
            fetchContent={fetchContent}
            mimeType="image/*"
          />
        </Card>
      </PreviewSection>
    </>
  )
}