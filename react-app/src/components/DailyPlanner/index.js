import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchDailyPlannersThunk,
  fetchDailyPlannerSlotsThunk} from '../../store/daily_planner'

function DailyPlanner () {
  const dispatch = useDispatch()
  const dailyPlanners = useSelector(state => state.daily_planner.dailyPlanner)
  console.log('DAILY PLANNERS --->', dailyPlanners)
  const slots = useSelector(state => state.slots)

  useEffect(() => {
    dispatch(fetchDailyPlannersThunk())
  }, [dispatch])

  let dailyPlannerId
  let plannerElements = []

  for (const dailyPlanner in dailyPlanners) {
    dailyPlannerId = dailyPlanner
    console.log('PLANNER ID ---->', dailyPlannerId)
    console.log(dailyPlanners[dailyPlannerId])

    plannerElements.push(
        <div key={dailyPlannerId} id={dailyPlannerId}>{dailyPlanners[dailyPlannerId].date}</div>
    )
  }


  if (!dailyPlanners) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Daily Planner Page</h1>
      {/* <h2>{dailyPlanners[0].date}</h2> */}
      <h2>{plannerElements}</h2>
    </div>
  )
}

export default DailyPlanner
