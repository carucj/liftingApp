import { CssBaseline } from '@mui/material'
import './App.css'
import LiftManager from './LiftManager'
import { StateProvider } from './LiftStateAndContext'


function App() {

  return (
    <StateProvider>
      <CssBaseline />
      <LiftManager />
    </StateProvider>
  )
}

export default App