import { CssBaseline } from '@mui/material'
import './App.css'
import LiftManager from './LiftManager'
import { StateProvider } from './LiftStateAndContext'
import { useState } from 'react'
import InitialStateSetup from './InitialStateSetup'
import { reducer, initialState } from './Reducer';

const savedState = JSON.parse(localStorage.getItem('weeklyLifts')) || null

function App() {
  const [initialValues, setInitialValues] = useState(null)


  return (
    <>
      <CssBaseline />
      {
        savedState === null && initialValues === null
          ? (<InitialStateSetup setInitialValues={setInitialValues} />)
          : (
            <StateProvider reducer={reducer} initialState={savedState === null ? initialState(initialValues) : savedState} >
              <LiftManager />
            </StateProvider>
          )
      }
    </>
  )
}

export default App