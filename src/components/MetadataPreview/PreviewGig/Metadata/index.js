import { useState, useMemo, useContext } from 'react';
import DialogEdit from './DialogEdit'
import PreviewSection from '../../PreviewSection'
import { formParsers } from '../../../../utils/formUtils'
import Preview from './Preview'
import { StateContext } from '../../../../store'

export default function Metadata({ event, refreshEvent, isOrganizer }) {
  const [showDialog, setShowDialog] = useState(false)
  const handleOpenDialog = () => setShowDialog(true)
  const handleCloseDialog = () => setShowDialog(false)

  const state = useContext(StateContext)
  const folder = event.smart_folder

  const metadata = useMemo(() => {
    let time = ""
    let date = ""
    let duration_min = ""

    if (event.start.date) {
      // all day event, no time
      date = event.start.date
    } else if (event.start.dateTime) {
      date = formParsers.localeDate(event.start.dateTime, event.start.timeZone)
      time = formParsers.localeTime(event.start.dateTime, event.start.timeZone)
      const startDate = new Date(event.start.dateTime)
      const endDate = new Date(event.end.dateTime)
      const duration = endDate - startDate
      duration_min = Math.floor(duration / 60000).toString()
    }

    const data = {
      // when
      date: date,
      time: time,
      time_zone: event.start.timeZone || state.time_zone,
      duration_min: duration_min || formParsers.text(folder.data.duration_min),
      // where
      location: formParsers.text(folder.data.location),
      venue: formParsers.text(folder.data.venue),
      address: formParsers.text(folder.data.address),
      postal_code: formParsers.text(folder.data.postal_code),
      // status
      tickets_url: formParsers.text(folder.data.tickets_url),
      is_confirmed: formParsers.boolean(folder.data.is_confirmed),
      is_sold_out: formParsers.boolean(folder.data.is_sold_out),
      is_paid: formParsers.boolean(folder.data.is_paid),
      is_cancelled: formParsers.boolean(folder.data.is_cancelled),
    }

    return data
  }, [folder])

  return (
    <PreviewSection text="Metadata">
      <Preview metadata={metadata} handleEdit={handleOpenDialog} />

      {showDialog && (
        <DialogEdit
          event={event}
          isOrganizer={isOrganizer}
          handleClose={handleCloseDialog}
          metadata={metadata}
          refreshEvent={refreshEvent}
        />
      )}
    </PreviewSection>
  )
}