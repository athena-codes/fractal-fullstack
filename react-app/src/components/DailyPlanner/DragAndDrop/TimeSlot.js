import { useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export const TimeSlot = ({ slot }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TIME_SLOT_FIELD',
    drop: item => {
      // Handle the drop event here, e.g., update the position of the todo item
      console.log('Dropped item:', item)
      console.log('Target slot:', slot)
    },
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  })

  // Add the drop ref to the component you want to make a drop target
  return (
    <div
      ref={drop}
      className='time-slot'
      key={slot.id}
      style={{ background: isOver ? 'lightgray' : 'white' }}
    >
      {/* Rest of the time-slot component code */}
    </div>
  )
}
