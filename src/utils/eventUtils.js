import { updateEvent } from "../api/calendar/updateEvent"
import { routes } from "../Routes"
import { dateToEventDate, dateToEventDatetime, simplifyDate, simplifyTime } from "./dateUtils"

// update the Google event if there have been changes to the Gig Folder that should be reflected
export const conditionalGigUpdate = async (event, data) => {
  const changed = (prop) => data.hasOwnProperty(prop)
  const prev = event.smart_folder.data
  const resource = {}

  // update summary if
  if (changed("date") || changed("time") || changed("duration_min") || changed("time_zone")) {
    const allDay = !data.time
    const [startDate, endDate] = generateDatesFromEventForm(data)
    resource.start = getEventDateObject(allDay, startDate, data.time_zone)
    resource.end = getEventDateObject(allDay, endDate, data.time_zone)
  }

  // update summary if
  if (changed("location") || changed("venue") || changed("artist_name")) {
    const location = data.location ?? prev.location
    const venue = data.venue ?? prev.venue
    const artist_name = data.artist_name ?? prev.artist_name
    const where = [venue, location].filter(x => x.trim()).join(", ")
    resource.summary = where ? `${artist_name} @ ${where}` : (artist_name || "Unknown Artist")
  }

  // update location if
  if (changed("address") || changed("location") || changed("venue")) {
    const location = data.location ?? prev.location
    const venue = data.venue ?? prev.venue
    const address = data.address ?? prev.address
    resource.location = [address, venue, location].filter(x => x.trim()).join(", ")
  }

  // update faniakArtist if
  if (changed("artist_id")) {
    resource.extendedProperties = {
      shared: {
        faniakArtist: data.artist_id,
      }
    }
  }

  // update description if
  if (changed("timetable") && data.timetable.length) {
    let auxDate = null
    let html = "<h4>Timetable:</h4>"

    html += "<ul>"

    for (const entry of data.timetable) {
      const startTime = new Date(entry.start)
      const simplifiedDate = simplifyDate(startTime, options)
      const options = event.start.timeZone ? {
        timeZone: event.start.timeZone
      } : {}

      // decide whether to print the date (events in same day are put in groups)
      if (!auxDate || simplifiedDate !== auxDate) {
        auxDate = simplifiedDate
        html += `</ul><p>${simplifiedDate}</p><ul>`
      }

      const topLine = `<div>${simplifyTime(startTime, options)} - ${entry.title}</div>`
      const bottomLine = entry.description ? `<small>${entry.description}</small>` : ""
      html += `<li><div>${topLine}${bottomLine}</div></li>`
    }

    html += "</ul>"
    resource.description = html
  }

  if (Object.keys(resource).length) {
    await updateEvent({
      event_params: {
        eventId: event.id,
        calendarId: "primary",
      },
      resource,
    })
  }
}

export const getEventDateObject = (allDay, date, timeZone) => ({
  date: allDay ? dateToEventDate(date) : undefined,
  dateTime: allDay ? undefined : dateToEventDatetime(date),
  timeZone: timeZone,
})

export const generateDatesFromEventForm = (form) => {
  const startDate = new Date(form.date)

  if (form.time) {
    const [hh, mm] = form.time.split(":")
    startDate.setHours(parseInt(hh))
    startDate.setMinutes(parseInt(mm))
  }

  const endDate = new Date(startDate.getTime())

  if (form.time) {
    // default to one hour duration
    endDate.setMinutes(endDate.getMinutes() + (form.duration_min || 60))
  } else {
    endDate.setDate(endDate.getDate() + 1)
  }

  return [startDate, endDate]
}

export const generateEventSource = (startDate) => ({
  title: "Faniak Calendar",
  url: `${window.location.protocol}//${window.location.host}${routes.calendarViewTime("month", startDate.getTime())}`,
})