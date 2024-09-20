import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  strip: {
    fill: "none",
    stroke: theme.palette.secondary.main,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "9.24px",
  },
}))

export default function MousePressIcon(props) {
  const classes = useStyles()

  return (
    <SvgIcon {...props} viewBox="0 0 300 300">
      <g>
        <line className={classes.strip} x1="97.04" y1="113.53" x2="81.65" y2="120.46" />
        <line className={classes.strip} x1="96.82" y1="86.53" x2="81.03" y2="80.57" />
        <line className={classes.strip} x1="115.73" y1="67.24" x2="108.76" y2="51.87" />
        <line className={classes.strip} x1="142.74" y1="66.93" x2="148.64" y2="51.12" />
        <line className={classes.strip} x1="162.09" y1="85.77" x2="177.43" y2="78.74" />
      </g>
      <polygon points="218.97 172.31 129.38 95.33 129.23 212.84 158.22 190.35 184.66 248.88 196.36 243.59 208.07 238.3 181.63 179.78 218.97 172.31" />

    </SvgIcon>
  )
}