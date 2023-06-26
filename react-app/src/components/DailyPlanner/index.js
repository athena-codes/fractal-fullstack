import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchDailyPlannersThunk,
  fetchDailyPlannerSlotsThunk
} from '../../store/daily_planner'
import './DailyPlanner.css'

function DailyPlanner () {
  const dispatch = useDispatch()
  const dailyPlanners = useSelector(state => state.daily_planner.dailyPlanner)
  const slots = useSelector(state => state.slots)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    dispatch(fetchDailyPlannersThunk())
  }, [dispatch])

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
  console.log('CURRENT DAILY PLANNER --->', currentDailyPlanner)

  const dailyPlannerSlots = dailyPlanners[currentSlide].time_slots
  // console.log('CURRENT DAILY PLANNER SLOTS --->', dailyPlannerSlots)



  return (
    <div>
      <h1>Daily Planner Page</h1>
      <div className='slideshow-controls'>
        <button onClick={goToPreviousSlide}>&lt;</button>
        <button onClick={goToNextSlide}>&gt;</button>
      </div>
      <div className='slideshow-container'>
        <div className='slide active'>
          <h2>Date: {currentDailyPlanner.date}</h2>
          <div className='time-slots'>
            {dailyPlannerSlots &&
              dailyPlannerSlots.map(slot => (
                <div key={slot.id}>
                  <p>Start Time: {slot.start_time}</p>
                  <p>End Time: {slot.end_time}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyPlanner
