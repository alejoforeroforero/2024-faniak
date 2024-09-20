import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import {
  IconButton,
  Popover,
} from '@material-ui/core'
import { getInitialMenuState } from '../../../BaseMenu'
import { creditTypes, creditValues } from '../../../../utils/creditsUtils'
import BaseSearchField, { searchResultTypes } from '../../../BaseSearchField'
import ChipButton from '../../../ChipButton'
import { updateMember } from '../../../../api/member/update'
import { capitalizeString } from '../../../../utils/utils'
import { useSnackbar } from 'notistack'
import CheckIcon from '@material-ui/icons/Check'

const trimCredit = (s) => capitalizeString(s.trim())

export default function MenuEditCredits(props) {
  if (props.menuState.mouseY == null) return null
  return <Element {...props} />
}

const useStyles = makeStyles(theme => ({
  paper: {
    padding: 16,
    width: 320,
    height: 352,
    overflow: "visible",
  },
}))

function Element({
  menuState,
  setMenuState,
  default_credits,
  setMember,
  section_key,
}) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [credits, setCredits] = useState({ ...default_credits })
  const specifics = credits[section_key]

  const handleClose = (event) => {
    if (event) event.stopPropagation()
    setMenuState(getInitialMenuState())

    if (credits.is_touched) {
      const data = {
        [creditTypes.PLAYED]: credits[creditTypes.PLAYED],
        [creditTypes.WROTE]: credits[creditTypes.WROTE],
        [creditTypes.OTHERS]: credits[creditTypes.OTHERS],
      }
      setMember(prev => ({
        ...prev, default_credits: data
      }))
      updateMember({
        default_credits: data
      }).then(res => {
        if (res.error) return
        enqueueSnackbar("Your skillset has been updated.", { variant: "success" })
      })
    }
  }

  const stopPropagation = (e) => e.stopPropagation()

  const addCredit = (value) => {
    const processed_value = capitalizeString(value.trim())

    setCredits(prev => {
      if (prev[section_key].includes(processed_value)) return prev

      prev[section_key].push(processed_value)
      prev.is_touched = true
      return { ...prev }
    })
  }

  const removeCredit = (index) => () => {
    setCredits(prev => {
      prev[section_key] = prev[section_key].filter((credit, i) => i !== index)
      prev.is_touched = true
      return { ...prev }
    })
  }

  const fetchResults = async (string) => {
    const results = creditValues[section_key]
      .filter(option => {
        const _option = option.toLowerCase()
        const _string = string.trim().toLowerCase()
        return _option !== _string && _option.includes(_string)
      })
      .map(value => ({
        type: searchResultTypes.ACTION,
        data: { label: value },
        selectData: () => addCredit(value),
      }))

    if (string) {
      results.unshift({
        type: searchResultTypes.ACTION,
        data: { label: trimCredit(string) },
        selectData: () => addCredit(trimCredit(string)),
      })
    }

    return results
  }

  return (
    <Popover
      open
      onClick={stopPropagation}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: menuState.mouseY, left: menuState.mouseX }}
      classes={{ paper: classes.paper }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ fontSize: 16, flexGrow: 1 }}>
          {renderTitle(section_key)}
        </div>
        <div style={{ margin: -8 }}>
          <IconButton color="primary" size="small" onClick={handleClose}>
            <CheckIcon />
          </IconButton>
        </div>
      </div>
      <div style={{ marginTop: 8, marginBottom: 16 }}>
        {specifics.map((elem, index) => (
          <ChipButton key={index} value={elem} onClick={removeCredit(index)} />
        ))}
      </div>
      <BaseSearchField
        autoFocus
        delay={0}
        fetchResults={fetchResults}
      />
    </Popover>
  )
}

const renderTitle = (section_key) => {
  switch (section_key) {
    case creditTypes.PLAYED: return "I can play..."
    case creditTypes.WROTE: return "I usually write the..."
    case creditTypes.OTHERS: return "Mostly, I am a..."
    default: return ""
  }
}