import { useMemo } from 'react';
import FormPreview, { PreviewItem } from '../../../form/FormPreview'
import { simplifyDate, simplifyTime } from '../../../../utils/dateUtils'

export default function Preview({ metadata }) {
  const date = useMemo(() => {
    const str = `${metadata.date}T00:00:00.000Z`
    return simplifyDate(str, { timeZone: metadata.time_zone })
  }, [metadata.time_zone, metadata.date])

  const time = useMemo(() => {
    const str = `1970-01-01T${metadata.time}:00.000Z`
    return simplifyTime(str, { timeZone: metadata.time_zone })
  }, [metadata.time_zone, metadata.time])

  const time_zone = useMemo(() => {
    return metadata.time_zone.split("/")[1].replaceAll("_", " ")
  }, [metadata.time_zone])

  const duration_min = useMemo(() => {
    if (!metadata.duration_min) return "All day"
    return metadata.duration_min + " min"
  }, [metadata.duration_min])

  return (
    <FormPreview>
      <PreviewItem label="Date" value={date} />
      <PreviewItem label="Time" value={time} />
      <PreviewItem label="Duration (min)" value={duration_min} />
      <PreviewItem label="Timezone" value={time_zone} />
      <PreviewItem label="Summary" value={metadata.summary} />
      <PreviewItem label="Location" value={metadata.location} />
    </FormPreview>
  )
}