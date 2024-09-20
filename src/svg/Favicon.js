import { useTheme } from '@material-ui/core/styles'
import SvgIcon from '@material-ui/core/SvgIcon'

export default function Favicon(props) {
  const theme = useTheme()

  const fill_color = props.inverted ? "#fff" : theme.palette.secondary.main

  return (
    <SvgIcon viewBox="0 0 176 200" fill="none" {...props}>
      <path d="M65.71 20.27C60.94 20.27 59.18 16.66 57.9 14.93C57.44 14.3 48.02 1.09999 47.56 0.469992H4.86002C4.16091 0.444031 3.46522 0.57963 2.82703 0.866255C2.18884 1.15288 1.62536 1.58281 1.18035 2.12263C0.735338 2.66244 0.420805 3.29761 0.261188 3.97875C0.101571 4.65989 0.101161 5.36867 0.260013 6.04999L2.76001 20.27L6.76001 42.89L33.69 195.3L41.14 171.3L100.58 20.3L65.71 20.27Z" fill="#00B5D3" />
      <path d="M55.66 60.32C60.1134 33.6533 75.0867 20.32 100.58 20.32H168.15C174.523 20.32 177.137 23.6533 175.99 30.32C174.957 36.9867 171.26 40.32 164.9 40.32H135.58C122.833 40.32 115.31 46.9867 113.01 60.32L111.29 70.32C110.137 76.9867 112.75 80.32 119.13 80.32H152.43C158.803 80.32 161.417 83.6533 160.27 90.32C159.243 96.9867 155.543 100.32 149.17 100.32H115.88C109.507 100.32 105.743 103.653 104.59 110.32L91.03 190.32C90.0034 196.987 86.3067 200.32 79.94 200.32H41.7C35.32 200.32 32.6534 196.987 33.7 190.32L55.66 60.32Z" fill={fill_color} />
    </SvgIcon>
  )
}