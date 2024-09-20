export function simplifyDate(date_string, options = {}) {
  const date = new Date(date_string)
  const date_str = date.toLocaleString("en-US", { weekday: "short", year: "numeric", month: "long", day: "numeric", ...options })
  return date.getTime() ? date_str : ""
}

export function simplifyDatetime(date_string) {
  const date = new Date(date_string)
  const date_str = date.toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric" })
  const time_str = date.toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric" })
  return date.getTime() ? `${date_str}: ${time_str}` : ""
}

export function simplifyTime(date_string, options) {
  const date = new Date(date_string)
  const time_str = date.toLocaleTimeString('en-US', { hour: "numeric", minute: "numeric", ...options })
  return date.getTime() ? `${time_str}` : ""
}

export const prettifySeconds = (seconds) => {
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return `${min}'${sec < 10 ? "0" : ""}${sec}"`
}

export const getCurrentTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (error) {
    console.error(error)
    return
  }
}

export const getAllTimeZones = () => {
  return Intl.supportedValuesOf('timeZone')
}

export const getTimeZoneDescription = (timeZone) => {
  const date = new Date()

  // Expected format: '3:58:54 Alaska Standard Time'
  const name_words = date.toLocaleTimeString("en-UK", { timeZone: timeZone, timeZoneName: "long" }).split(" ")
  // remove the time, which has inconsistent length
  name_words.shift()
  const name = name_words.join(" ")

  // Expected format: '04:03:05 GMT-9'
  const offset = date.toLocaleString("en-UK", { timeZone: timeZone, timeStyle: "long" }).substring(9)

  return `(${offset}) ${name}`
}

export const getPaddedTime = (date) => {
  const hh = date.getHours() + ""
  const mm = date.getMinutes() + ""

  return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}`
}

export const dateToEventDatetime = (date) => date.toISOString().replace("Z", "")
export const dateToEventDate = (date) => date.toISOString().split("T")[0]