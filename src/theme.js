import { createTheme } from '@material-ui/core/styles'

export function getTheme(dark_mode) {
  return createTheme({
    typography: {
      fontFamily: 'Titillium Web, sans-serif'
    },
    palette: {
      type: dark_mode ? "dark" : "light",
      primary: {
        main: "#00B4D5",
        contrastText: "#ffffff",
      },
      secondary: {
        main: dark_mode ? '#ffffff' : '#1d1d1b',
        contrastText: dark_mode ? '#1d1d1b' : '#ffffff',
      },
      warning: {
        main: dark_mode ? '#f1b612' : '#ffbc00'
      },
      background: dark_mode
        ? {
          paper: '#262626',
          default: '#1a1a1a',
        }
        : {
          paper: '#ffffff',
          default: '#fafafa',
        }
    }
  })
}