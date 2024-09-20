export const backgroundActions = {
  START: "start",
  GET_DATA: "get_data",
}

export const sleep = (ms) => {
  return new Promise(r => setTimeout(r, ms))
}

// data, an object which will receive the background params if they exist
// params, an object that may constain background params
export const getBackgroundParams = (params, data = {}) => {
  if (params.background) {
    data.background = params.background.action
    if (params.background.id) {
      data.job_id = params.background.id
    }
  }
  return data
}

// data, an object which will receive the background params if they exist
// response, an object that may constain background params
export const getBackgroundData = (response, data = {}) => {
  if (response.data.job_status) {
    data.background = {
      id: response.data.job_id,
      status: response.data.job_status,
    }
  }
  return data
}

export const runBackgroundJob = async ({
  apiFunction,
  apiPayload,
  processResponse,
  delay = 2000,
}) => {
  var job_id = null
  var stop = false

  const respond = (response) => {
    stop = true
    processResponse(response)
  }

  await apiFunction({
    ...apiPayload,
    background: {
      action: backgroundActions.START,
    },
  })
    .then(res => {
      if (res.error) return respond(res)

      if (res.background.status === "STARTED") {
        job_id = res.background.id
        return
      }
    })

  while (!stop) {
    await sleep(delay)

    if (stop) return

    await apiFunction({
      background: {
        id: job_id,
        action: backgroundActions.GET_DATA,
      }
    })
      .then(res => {
        if (res.error) return respond(res)

        if (["FINISHED", "FINISHED_WITH_ERROR"].includes(res.background.status)) {

          respond(res)
        }
      })
  }
}


/**
 * Turns a list into chunks of length determined by getMetric and maxMetric
 * @param {Array} list array to be split into chunks
 * @param {Function} getMetric callback that receives an item and returns a metric to be counted
 * @param {Number} maxMetric max number over which a new chunk must be created
 * @returns a list of arrays containing all items separated into chunks
 */
 export const getChunks = (list, getMetric, maxMetric) => {
  const chunks = []
  let chunk = []
  let ctr = 0

  for (const item of list) {
    ctr += getMetric(item)

    if (ctr > maxMetric) {
      chunks.push([...chunk])
      chunk = [item]
      ctr = getMetric(item)
    } else {
      chunk.push(item)
    }
  }

  if (chunk.length) {
    chunks.push([...chunk])
  }

  return chunks
}
