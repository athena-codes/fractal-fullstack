import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import SignupFormPage from './components/SignupFormPage'
import LoginFormPage from './components/LoginFormPage'
import GoalsOverview from './components/Goals/GoalsOverviewPage'
import DailyPlanner from './components/DailyPlanner'
import NotesOverview from './components/Notes/NotesOverview'
import CreateNoteForm from './components/Notes/CreateNoteForm'
import AboutMe from './components/AboutMe'
// import DailyOverview from './components/DailyOverview'
import MainContent from './components/MainContent'
import { authenticate } from './store/session'
import Navigation from './components/Navigation'

function App () {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  const user = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true))
  }, [dispatch])

  return (
    <>
      {isLoaded && (
        <div className='App'>
          <Navigation isLoaded={isLoaded} />
          <div className='Content'>
            <Switch>
              <Route exact path='/'>
                <MainContent />
              </Route>
              <Route path='/login'>
                <LoginFormPage />
              </Route>
              <Route path='/signup'>
                <SignupFormPage />
              </Route>
              <Route path='/goals'>
                <GoalsOverview />
              </Route>
              <Route path='/daily-planner'>
                <DailyPlanner />
              </Route>
              <Route path='/notes'>
                <NotesOverview />
              </Route>
              <Route path='/new-note'>
                <CreateNoteForm />
              </Route>
              <Route path='/about-me'>
                <AboutMe />
              </Route>
            </Switch>
          </div>
        </div>
      )}
    </>
  )
}

export default App
