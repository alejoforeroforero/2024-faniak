import { useCallback, useMemo } from 'react';
import { useSnackbar } from 'notistack'
import FormPreview, { PreviewItem } from '../../../form/FormPreview'
import { Divider } from '@material-ui/core'
import { simplifyDate, simplifyTime } from '../../../../utils/dateUtils'

export default function Preview({ metadata, handleEdit }) {
  const { enqueueSnackbar } = useSnackbar()

  const copy = useCallback((value) => {
    navigator.clipboard.writeText(value)
    enqueueSnackbar("Copied to clipboard!", { variant: "success" })
  }, [])

  const date = useMemo(() => {
    const str = `${metadata.date}T00:00:00.000Z`
    // at this point, the date is already locale, so no need to apply a timezone
    return simplifyDate(str, { timeZone: "UTC" })
  }, [metadata])

  const time = useMemo(() => {
    const str = `1970-01-01T${metadata.time}:00.000Z`
    // at this point, the date is already locale, so no need to apply a timezone
    return simplifyTime(str, { timeZone: "UTC" })
  }, [metadata])

  const time_zone = useMemo(() => {
    return metadata.time_zone.split("/")[1].replaceAll("_", " ")
  }, [metadata])

  const duration_min = useMemo(() => {
    if (!metadata.duration_min) return "All day"
    return metadata.duration_min + " min"
  }, [metadata])

  return (
    <FormPreview>
      <PreviewItem label="Date" value={date} handleEdit={handleEdit} />
      <PreviewItem label="Time" value={time} handleEdit={handleEdit} />
      <PreviewItem label="Duration" value={duration_min} handleEdit={handleEdit} />
      <PreviewItem label="Time Zone" value={time_zone} handleEdit={handleEdit} />

      <Divider />
      <PreviewItem label="Location" value={metadata.location} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Venue" value={metadata.venue} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Address" value={metadata.address} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Postal Code" value={metadata.postal_code} handleCopy={copy} handleEdit={handleEdit} />

      <Divider />
      <PreviewItem label="Tickets URL" value={metadata.tickets_url} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Confirmed" value={metadata.is_confirmed ? "Yes" : "No"} handleEdit={handleEdit} />
      {metadata.is_confirmed && (
        <PreviewItem label="Sold Out" value={metadata.is_sold_out ? "Yes" : "No"} handleEdit={handleEdit} />
      )}
      {metadata.is_confirmed && (
        <PreviewItem label="Paid" value={metadata.is_paid ? "Yes" : "No"} handleEdit={handleEdit} />
      )}
      <PreviewItem label="Cancelled" value={metadata.is_cancelled ? "Yes" : "No"} handleEdit={handleEdit} />
    </FormPreview>
  )
}