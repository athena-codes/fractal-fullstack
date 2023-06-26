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

  useEffect(() => {
    if (dailyPlanners && dailyPlanners.length > 0) {
      dispatch(fetchDailyPlannerSlotsThunk(dailyPlanners[currentSlide].id))
    }
  }, [dailyPlanners, currentSlide, dispatch])

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
  const dailyPlannerSlots = currentDailyPlanner.time_slots

  const formatTime = timeString => {
    const date = new Date(`2000-01-01T${timeString}`)
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div>
      <h1>Daily Planner</h1>
      <div className='subheading'>
        <p>To Do | {currentDailyPlanner.date}</p>
        <div className='slideshow-controls'>
          <button onClick={goToPreviousSlide}>&lt;</button>
          <button onClick={goToNextSlide}>&gt;</button>
        </div>
      </div>
      <div className='slideshow-container'>
        <div className='slide active'>
          <div className='time-slots'>
            {dailyPlannerSlots &&
              dailyPlannerSlots.map(slot => (
                <div className='time-slots-start-end' key={slot.id}>
                  <div className='time-slot'>
                    <p>Start: {formatTime(slot.start_time)} </p>
                    <input type='text' readOnly />
                  </div>
                  <div className='time-slot'>
                    <p>End: {formatTime(slot.end_time)} </p>
                    <input type='text' readOnly />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyPlanner
