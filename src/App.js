import { useMemo, useReducer } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import { StateContext, DispatchContext } from './store'
import { BrowserRouter } from 'react-router-dom'
import { reducer, initialState } from './reducer'
import { getTheme } from './theme'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SnackbarProvider } from 'notistack'

import NoticeMobile from './components/NoticeMobile'
import UploadManager from './components/UploadManager'
import Onboarding from './components/Onboarding'
import GoogleSession from './components/google/GoogleSession'
import DialogSubscriptions from './components/DialogSubscriptions'
import HeartbeatManager from './components/HeartbeatManager'
import Routes from './Routes'
import './index.scss'
import PermanentFactory from './components/factory/PermanentFactory'
import DialogExpiredTrial from './components/DialogExpiredTrial'

const snackbarOrigin = { horizontal: "center", vertical: "bottom" }

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const theme = useMemo(() => getTheme(state.dark_mode), [state.dark_mode])

  return (
    <div className="App">
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>
          <DndProvider backend={HTML5Backend}>
            <ThemeProvider theme={theme}>
              <SnackbarProvider maxSnack={3} anchorOrigin={snackbarOrigin}>
                <BrowserRouter>
                  <CssBaseline />
                  <GoogleSession>
                    <HeartbeatManager />
                    <DialogSubscriptions />
                    <DialogExpiredTrial />
                    <UploadManager />
                    <Onboarding />
                    <Routes />
                    <PermanentFactory />
                    <NoticeMobile />
                  </GoogleSession>
                </BrowserRouter>
              </SnackbarProvider>
            </ThemeProvider>
          </DndProvider>
        </StateContext.Provider>
      </DispatchContext.Provider>
    </div>
  )
}