import { useContext } from 'react';
import {
  Fab,
} from '@material-ui/core'
import { DispatchContext, StateContext } from '../../store'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

export default function ButtonBack({ className }) {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  if (!state.selected_file && !state.selected_event) return null

  const deselectFile = () => dispatch({
    type: 'SET',
    data: {
      selected_file: null,
      selected_event: null,
    }
  })

  return (
    <Fab onClick={deselectFile} size="small" color="primary" className={className}>
      <ArrowBackIcon />
    </Fab>
  )
}