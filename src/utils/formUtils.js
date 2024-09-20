export const formParsers = {
  text:
    (value, defaultValue = "") => {
      return "" + (value || defaultValue)
    },
  boolean:
    (value) => !!value,
  list:
    (value, defaultValue = "") => {
      try {
        return value
          .filter(item => item)
          .map(item => item || defaultValue)
      } catch (error) {
        return []
      }
    },
  date:
    (isoStr, defaultValue = "") => {
      const date = new Date(isoStr)
      if (date.getTime()) {
        const yyyy = date.getFullYear()
        const mm = (date.getMonth() + 1).toString().padStart(2, "0")
        const dd = (date.getDate()).toString().padStart(2, "0")
        return `${yyyy}-${mm}-${dd}`
      }
      return defaultValue
    },
  localeDate:
    (isoStr, timeZone, defaultValue = "") => {
      const date = new Date(isoStr)
      if (date.getTime()) {
        const [dd, mm, yyyy] = date.toLocaleDateString('en-UK', { timeZone }).split("/")
        return `${yyyy}-${mm}-${dd}`
      }
      return defaultValue
    },
  localeTime:
    (isoStr, timeZone, defaultValue = "") => {
      const date = new Date(isoStr)
      if (date.getTime()) {
        const [hh, mm, _] = date.toLocaleTimeString('en-UK', { timeZone }).split(":")
        return `${hh}:${mm}`
      }
      return defaultValue
    },
  time:
    (value, defaultValue = "") => {
      const date = new Date(value)
      if (date.getTime()) {
        const hh = date.getHours().toString().padStart(2, "0")
        const mm = date.getMinutes().toString().padStart(2, "0")
        return `${hh}:${mm}`
      }
      return defaultValue
    },
}

export const formTrimmers = {
  list:
    (list) => list.reduce((filteredList, item) => {
      const trimmedItem = item.trim()
      if (trimmedItem) return filteredList.concat([trimmedItem])
      return filteredList
    }, []),
  date:
    (string, defaultValue = "") => {
      const date = new Date(string)
      // limit the year to 4 digits because of database restrictions
      if (date.getTime() && date.getFullYear() <= 9999) return date.toISOString()
      return defaultValue
    },
  number:
    (string, defaultValue = "") => {
      const intValue = parseInt(string)
      return isNaN(intValue) ? defaultValue : intValue
    },
} 