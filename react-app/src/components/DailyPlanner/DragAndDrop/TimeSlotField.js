import { useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'


export const TimeSlotField = ({ slot }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'TIME_SLOT_FIELD', slotId: slot.id },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  // Add the drag ref to the component you want to make draggable
  return (
    <input
      ref={drag}
      className='time-slot-field'
      type='text'
      value={(slot['todo'] && slot.todo.name) || ''}
      readOnly
      style={{ opacity: isDragging ? 0.5 : 1 }} // Optional visual effect while dragging
    />
  )
}
