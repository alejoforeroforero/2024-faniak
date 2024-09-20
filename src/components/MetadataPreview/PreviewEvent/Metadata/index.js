import { useContext, useMemo } from 'react';
import PreviewSection from '../../PreviewSection'
import { formParsers } from '../../../../utils/formUtils'
import Preview from './Preview'
import { StateContext } from '../../../../store'

export default function Metadata({ event }) {
  const state = useContext(StateContext)

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
      date: date,
      time: time,
      time_zone: event.start.timeZone || state.time_zone,
      duration_min: duration_min,
      summary: formParsers.text(event.summary),
      location: formParsers.text(event.location),
    }

    return data
  }, [event])

  return (
    <PreviewSection text="Metadata">
      <Preview metadata={metadata} />
    </PreviewSection>
  )
}