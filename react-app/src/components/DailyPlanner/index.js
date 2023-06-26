import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchDailyPlannersThunk,
  fetchDailyPlannerSlotsThunk} from '../../store/daily_planner'
import './DailyPlanner.css'

function DailyPlanner () {
  const dispatch = useDispatch()
  const dailyPlanners = useSelector(state => state.daily_planner.dailyPlanner)
  const slots = useSelector(state => state.slots)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    dispatch(fetchDailyPlannersThunk())
  }, [dispatch])

//   - Get daily planner slots
//   useEffect(() => {
//     if (dailyPlanners && dailyPlanners.length > 0) {
//       // Fetch slots for the current daily planner
//       dispatch(fetchDailyPlannerSlotsThunk(dailyPlanners[currentSlide].id))
//     }
//   }, [dailyPlanners, currentSlide, dispatch])

//  - Slide functionality
  const goToPreviousSlide = () => {
    setCurrentSlide(prevSlide =>
      prevSlide === 0 ? dailyPlanners.length - 1 : prevSlide - 1
    )
  }

  const goToNextSlide = () => {
    setCurrentSlide(prevSlide =>
      prevSlide === dailyPlanners.length - 1 ? 0 : prevSlide + 1
    )
  }

  if (!dailyPlanners) {
    return <div>Loading...</div>
  }

  const currentDailyPlanner = dailyPlanners[currentSlide]

  return (
    <div>
      <h1>Daily Planner Page</h1>
      <div className='slideshow-container'>
        <div className='slide active'>
          <h2>Date: {currentDailyPlanner.date}</h2>
        </div>
      </div>
      <div className='slideshow-controls'>
        <button onClick={goToPreviousSlide}>&lt;</button>
        <button onClick={goToNextSlide}>&gt;</button>
      </div>
    </div>
  )
}

export default DailyPlanner
