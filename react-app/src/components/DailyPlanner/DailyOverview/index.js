import React from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

function DailyOverview () {
  const sessionUser = useSelector(state => state.session.user)

  return <>{sessionUser && <h1>Daily Overview</h1>}</>
}

export default DailyOverview
