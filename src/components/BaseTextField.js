import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const StyledField = withStyles({
    root: {
        '& input, & textarea': {
            paddingLeft: 5,
        },
        '& .MuiFormLabel-root': {
            left: 5,
        },
    },
})(TextField)

export default function BaseTextField(props) {

    const inputProps = {
        id: props.id
    }
    const fieldProps = {
        ...props,
        id: null
    }

    return (
        <StyledField
            fullWidth
            autoComplete="off"
            color="secondary"
            inputProps={inputProps}
            {...fieldProps}
        />
    )
}