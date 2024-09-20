import axios from 'axios'

export function printResponse(api_name, response) {
  const text_color = response.data.status === "SUCCESS" ? "lawngreen" : "red"
  console.log(`%c>`, `color: ${text_color}`, `${api_name}:`, response.data)
}

export function printPayload(api_name, payload) {
  const text_color = "#20a9d6"
  console.log(`< %c${api_name}:`, `color: ${text_color}`, payload)
}

// Used to treat generic errors. 
// You should treat specific errors before calling this function.
export function dafaultCatch(error) {
  console.error("Caught: ", error)
  if (error.message) {
    if (error.message === "Network Error") return { error: "NETWORK_ERROR" }
    console.error("Message:", error.message)
  }
  if (error.response) console.log("Response:", error.response)
  return { error: "UNTREATED_ERROR" }
}

export function defaultAxios(options = {}) {
  return axios
}

/**
 * Translates an simple object (key+value) into a FormData object
 * @param {object} object 
 */
export function objToFormData(object) {
  const data = new FormData()

  for (var key in object) {
    data.append(key, object[key])
  }

  return data
}