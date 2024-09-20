import { useEffect } from 'react';
import { TextField } from '@material-ui/core'

const UP_ARROW_CODE = '38'
const DOWN_ARROW_CODE = '40'

export default function Input({
  setFetching,
  search,
  setSearch,
  results,
  setSelected,
  selectedRef,
  autoFocus,
  label,
  placeholder,
  delay,
  variant,
  searchString,
}) {
  useEffect(() => {
    // searches the initialValue
      searchString(search.string)
  }, [])

  const handleChangeField = (e) => {
    const { value } = e.target
    setFetching(true)

    if (search.typingTimeout) {
      clearTimeout(search.typingTimeout)
    }

    setSearch(prev => ({
      ...prev,
      string: value,
      typingTimeout: setTimeout(function () {
        searchString(value)
      }, delay)
    }))
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()

      return selectedRef?.current?.click()
    }
  }

  const handleKeyDown = (event) => {
    if (event.keyCode == UP_ARROW_CODE) {
      event.preventDefault()
      setSelected(prev => prev > 0 ? prev - 1 : results.length)
    }
    else if (event.keyCode == DOWN_ARROW_CODE) {
      event.preventDefault()
      setSelected(prev => prev < results.length ? prev + 1 : 0)
    }
  }

  return <TextField
    label={label}
    value={search.string}
    onChange={handleChangeField}
    onKeyPress={handleKeyPress}
    onKeyDown={handleKeyDown}
    variant={variant}
    color="primary"
    size="small"
    autoComplete="off"
    fullWidth
    autoFocus={autoFocus}
    placeholder={placeholder}
  />
}