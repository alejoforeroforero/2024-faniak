import { useState } from 'react';
import BaseTextField from './BaseTextField'
import { makeStyles } from '@material-ui/core/styles'
import {
  Chip, IconButton,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "100%",
    '& .MuiIconButton-root': {
      padding: 8,
      position: "absolute",
      top: 8,
      right: 0,
    },
  },
  chips: {
    '& .MuiChip-root': {
      margin: 2,
    },
  },
}))

export default function ListField({
  label,
  name,
  value,
  setValue,
  required,
  placeholder = "Type to add",
}) {
  const [string, setString] = useState("")

  const handleChange = async (event) => {
    const { value } = event.target
    setString(value)
  }

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addString()
    }
  }

  const addString = () => {
    if (string && !value.some(item => item === string)) {
      setValue(name, [...value, string])
    }
    setString("")
  }

  const removeItem = (index) => () => {
    setValue(name, value.filter((_, i) => i !== index))
  }

  const handleClickAdd = (e) => {
    e.stopPropagation()
    addString()
  }

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <BaseTextField
        label={label}
        name={name}
        value={string}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        required={required}
      />
      <IconButton
        color="primary"
        onClick={handleClickAdd}
      >
        <AddIcon />
      </IconButton>
      <div className={classes.chips}>
        {value.map((item, i) => (
          <Chip
            key={i}
            label={item}
            size="small"
            onDelete={removeItem(i)}
          />
        ))}
      </div>
    </div>
  )
}