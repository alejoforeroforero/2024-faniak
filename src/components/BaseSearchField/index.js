import { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Input from './Input'
import Results from './Results'

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    flexGrow: 1,
    '& > .MuiCard-root': {
      display: "none"
    },
    '&:focus-within > .MuiCard-root': {
      display: "block"
    },
  },
}))

export const searchResultTypes = {
  PERSON: "person",
  FILE: "file",
  ACTION: "action",
  FOLDER: "folder",
  SOURCE: "source",
}

export default function BaseSearchField({
  onChangeValue,
  fetchResults,
  autoFocus = false,
  initialValue = "",
  keepValue,
  label = "",
  variant = "outlined",
  placeholder,
  delay = 300,
}) {
  const classes = useStyles()
  const [search, setSearch] = useState({
    string: initialValue,
    typingTimeout: 0
  })
  const [results, setResults] = useState([])
  const [fetching, setFetching] = useState(false)
  const [selected, setSelected] = useState(0)
  const selectedRef = useRef()

  useEffect(() => {
    if (onChangeValue) onChangeValue(search.string)
  }, [search.string])

  const resetInput = () => {
    if (search.typingTimeout) {
      clearTimeout(search.typingTimeout)
    }
    if (!keepValue) {
      setSearch(prev => ({ ...prev, string: "" }))
    }

    searchString("")
    // setResults([])
  }

  const applyResults = (results) => {
    setResults(results)
    setFetching(false)
    // reset result selection to the first result
    setSelected(0)
  }

  const searchString = (string) => fetchResults(string).then(applyResults)

  return (
    <div className={classes.root}>
      <Input
        autoFocus={autoFocus}
        setFetching={setFetching}
        search={search}
        setSearch={setSearch}
        results={results}
        setSelected={setSelected}
        selectedRef={selectedRef}
        label={label}
        placeholder={placeholder}
        delay={delay}
        variant={variant}
        searchString={searchString}
      />

      <Results
        search={search}
        resetInput={resetInput}
        fetching={fetching}
        results={results}
        selected={selected}
        selectedRef={selectedRef}
      />
    </div>
  )
}