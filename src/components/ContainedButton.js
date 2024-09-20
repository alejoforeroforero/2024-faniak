import {
    Button,
    CircularProgress
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    root: {
        color: "#fff",
        position: "relative",
        backgroundColor: ({ important }) => important ? '#e53935' : undefined,
    },
    progress: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: "auto",
    },
}))

export default function ContainedButton(props) {

    const { important, loading, className = "" } = props

    const classes = useStyles({
        important: Boolean(important),
        loading: Boolean(loading)
    })

    const new_props = {
        ...props,
        className: undefined,
        loading: undefined,
        important: undefined,
    }

    return (
        <Button
            variant="contained"
            color="primary"
            disableElevation
            {...new_props}
            className={`${classes.root} ${className}`}
            disabled={Boolean(props.disabled || loading)}
        >
            {props.children}
            {
                loading ? (
                    <CircularProgress color="primary" size={24} className={classes.progress} />
                ) : null
            }
        </Button>
    )
}