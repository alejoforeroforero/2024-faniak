export const buildCredit = (data) => ({
  member: null,
  email: "",
  name: "",
  percentage_owned: 0,
  played: [],
  wrote: [],
  others: [],
  ...data,
})

const buildIndexes = (data) => {
  return {
    attendee: -1,
    credit: -1,
    permission: -1,
    email: "",
    ...data
  }
}

export const getTeamMember = (team, index) => {
  return {
    email: team.indexes[index].email,
    credit: team.credits[team.indexes[index].credit] || null,
    attendee: team.attendees[team.indexes[index].attendee] || null,
    permission: team.permissions[team.indexes[index].permission] || null,
  }
}

// zips credits, permissions and attendees into a list, merged by email
export const zipTeam = ({ permissions = [], credits = [], attendees = [] }) => {
  const indexes = []

  permissions.forEach((permission, i) => {
    if (permission.type === "user") {
      indexes.push(
        buildIndexes({
          permission: i,
          email: permission.emailAddress,
        })
      )
    }
  })

  attendees.forEach((attendee, i) => {
    const email = attendee.email || ""
    var indexing = email && indexes.find(indexing => email === indexing.email)

    if (indexing) {
      indexing.attendee = i
    } else {
      indexes.push(
        buildIndexes({
          attendee: i,
          email: email
        })
      )
    }
  })

  credits.forEach((credit, i) => {
    if (credit.is_deleted) return

    const email = credit?.member?.email || credit.email || ""
    var indexing = email && indexes.find(indexing => email === indexing.email)

    if (indexing) {
      indexing.credit = i
    } else {
      indexes.push(
        buildIndexes({
          credit: i,
          email: email
        })
      )
    }
  })

  return {
    permissions,
    credits,
    attendees,
    indexes,
  }
}

export const buildPermission = (data) => ({
  emailAddress: "",
  role: "reader",
  type: "user",
  displayName: "",
  photoLink: "",
  ...data,
})

// key: attendee | permission | credit
const addTeamItem = (team, email, item, key) => {
  const listKey = key + "s"

  if (email) {
    const duplicatedIndexes = team.indexes.find(indexing => email === indexing.email)
    if (duplicatedIndexes) {
      if (duplicatedIndexes[key] === -1) {
        duplicatedIndexes[key] = team[listKey].push(item) - 1
      }
      return
    }
  }

  team.indexes.unshift(
    buildIndexes({
      [key]: team[listKey].push(item) - 1,
      email: email,
    })
  )
}

export const addCredit = (team, data) => {
  const credit = buildCredit(data)
  const email = credit?.member?.email || credit.email || ""

  addTeamItem(team, email, credit, "credit")
}

export const addAttendee = (team, data) => {
  const attendee = data
  const email = attendee.email

  addTeamItem(team, email, attendee, "attendee")
}

export const addPermission = (team, data) => {
  const permission = buildPermission(data)
  const email = permission.emailAddress

  addTeamItem(team, email, permission, "permission")
}

const isIndexesItemEmpty = (indexes) => indexes.attendee === -1 && indexes.credit === -1 && indexes.permission === -1

export const removeAttendee = (team, tIndex) => removeTeamItem(team, tIndex, "attendee")
export const removePermission = (team, tIndex) => removeTeamItem(team, tIndex, "permission")
export const removeCredit = (team, tIndex) => removeTeamItem(team, tIndex, "credit")

// key: attendee | permission | credit
const removeTeamItem = (team, tIndex, key) => {
  const person = getTeamMember(team, tIndex)

  person[key].is_deleted = true
  team.indexes[tIndex][key] = -1

  if (isIndexesItemEmpty(team.indexes[tIndex])) {
    team.indexes = team.indexes.filter((indexing, i) => i !== tIndex)
  }
}

export default {
  zipTeam,
  getTeamMember,
  buildCredit,
  buildPermission,
  addPermission,
  addAttendee,
  addCredit,
  removeCredit,
  removeAttendee,
  removePermission,
}