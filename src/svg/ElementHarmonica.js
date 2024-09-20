import { useTheme } from '@material-ui/core/styles'

export default function ElementHarmonica(props) {
  const theme = useTheme()
  
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 300 800 200" {...props}>
      <defs>
        <style>
          {".cls-1,.cls-2{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:6.83px;}"}
          {`.cls-1{stroke:${theme.palette.primary.main};}`}
          {`.cls-2{stroke:${theme.palette.secondary.main};}`}
        </style>
      </defs>
      <polyline className="cls-2" points="12.42 396.81 109.36 465.14 206.3 396.81 303.25 465.14 400.2 396.81 497.15 465.14 594.1 396.81 691.06 465.14 788.03 396.81" />
      <polyline className="cls-1" points="12.42 335.3 109.36 403.64 206.3 335.3 303.25 403.64 400.2 335.3 497.15 403.64 594.1 335.3 691.06 403.64 788.03 335.3" />
    </svg>
  )
}