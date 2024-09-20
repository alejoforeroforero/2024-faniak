// THESE FUNCTIONS ARE MEANT TO BE BINDED TO OBJECTS
function validateText() {
  return this.value.length > 0
}

function validateOption() {
  return (this.options.find(option => option.name === this.value) ? true : false)
}

function validateList() {
  return this.value.reduce((acc, elem) => {
    return acc && (elem.length > 0 || elem)
  }, true)
}

function validateEmail() {
  if (!this.value) return false

  return stringIsEmail(this.value)
}

export {
  validateText,
  validateOption,
  validateList,
  validateEmail,
  
  isrc_code,
  stringIsEmail,
}

// THESE FUNCTIONS MAY BE USED ANYWHERE

const isrc_code = (value) => /^[A-Z]{2}-?\w{3}-?\d{2}-?\d{5}$/g.test(value)

const stringIsEmail = (value) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)