import { CssBaseline } from '@mui/material'
import './App.css'
import LiftManager from './LiftManager'
import { StateProvider } from './LiftStateAndContext'
import { useEffect, useState } from 'react'
import InitialStateSetup from './InitialStateSetup'
import { reducer, initialState } from './Reducer';
// import ReactDom from "react-dpm/client"
// import { BrowserRouter } from 'react-router-dom'

// const root = ReactDom.createRoot(document.getElementById('root'));

//const savedState = JSON.parse(localStorage.getItem('weeklyLifts')) || null

function App() {
  const [initialValues, setInitialValues] = useState(null)
  const [savedState, setSavedState] = useState(null)

  useEffect(() => {
    const fetchSavedState = async () => {
      try {
        const response = await fetch('/api/data', {
          method: 'GET'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setSavedState(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchSavedState();
  }, []);

  return (
    <>
      <CssBaseline />
      {/* <Routes></Routes> */}
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


//will need the router to add in a log in screen and other stuff eventually too