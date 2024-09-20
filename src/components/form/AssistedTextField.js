import { useMemo, useState, useRef } from 'react';
import BaseTextField from './BaseTextField'
import { makeStyles } from '@material-ui/core/styles'
import {
  Card,
  List,
  ListItem,
} from '@material-ui/core'

const MAX_OPTIONS_SHOWN = 40
const UP_ARROW_CODE = '38'
const DOWN_ARROW_CODE = '40'

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: "50%",
    width: "100%",
    position: "relative",
    '& > .MuiCard-root': {
      display: "none"
    },
    '&:focus-within > .MuiCard-root': {
      display: "block"
    },
  },
  options: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.modal + 1,
    maxHeight: 150,
    overflowY: "auto",
    '& .MuiList-root': {
      paddingTop: 4,
      paddingBottom: 4,
    },
    '& .MuiListItem-root': {
      padding: "3px 12px 3px 12px"
    },
  },
}))

export default function AssistedTextField({
  label,
  name,
  value,
  setValue,
  options = [],
  required,
  placeholder = "Type to get suggestions",
}) {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const selectedRef = useRef()

  const handleChange = async (event) => {
    const { value } = event.target
    updateValue(value)
  }

  const updateValue = async (value) => {
    setValue(name, value)
    setSelectedIndex(null)
  }

  const suggestions = useMemo(() => filterOptions(value, options), [value])

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter' && selectedIndex != null) {
      event.preventDefault()
      updateValue(suggestions[selectedIndex])
    }
  }

  const handleKeyDown = async (event) => {
    if (event.keyCode == UP_ARROW_CODE) {
      event.preventDefault()
      if (selectedIndex == null) return setSelectedIndex(suggestions.length - 1)
      setSelectedIndex(prev => prev > 0 ? prev - 1 : null)
    }
    else if (event.keyCode == DOWN_ARROW_CODE) {
      event.preventDefault()
      if (selectedIndex == null) return setSelectedIndex(0)
      setSelectedIndex(prev => prev < (suggestions.length - 1) ? prev + 1 : null)
    }
  }

  const classes = useStyles()

  const card = useMemo(() => {
    return Boolean(suggestions.length) && (
      <Card className={classes.options} variant="outlined">
        <List dense>
          {suggestions.map((elem, index) => (
            <ListItem
              key={index}
              button
              tabIndex={-1}
              selected={selectedIndex === index}
              ref={selectedIndex === index ? selectedRef : null}
              onClick={() => updateValue(elem)}
            >
              {elem}
            </ListItem>
          ))}
        </List>
      </Card>)
  }, [suggestions, selectedIndex, selectedRef])

  return (
    <div className={classes.root}>
      <BaseTextField
        label={label}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        onKeyDown={handleKeyDown}
        required={required}
      />

      {card}
    </div>
  )
}

const filterOptions = (value, options) => {
  const head = []
  const tail = []
  options.filter(option => {
    const option_str = option.toLowerCase()
    const value_str = value.toString().trim().toLowerCase()
    if (option_str.includes(value_str)) {
      head.push(option)
    } else {
      tail.push(option)
    }
  }).slice(0, MAX_OPTIONS_SHOWN)
  return [...head, ...tail]
}