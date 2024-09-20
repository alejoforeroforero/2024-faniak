import { TextField } from '@material-ui/core'

export default function BaseTextField(props) {
  const newProps = { ...props }

  if (props.setValue) {
    newProps.onChange = async (event) => {
      const { name, value } = event.target
      props.setValue(name, value)
    }

    delete newProps['setValue']
  }

  return (
    <TextField
      type="text"
      variant="outlined"
      fullWidth
      autoComplete="off"
      color="secondary"
      margin='dense'
      {...newProps}
    />
  )
}