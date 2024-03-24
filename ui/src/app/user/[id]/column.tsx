"use client";

import styles from "./page.module.scss"
import { AvailabilityPoint, dayReference } from "./page";

interface Slot {
    timeStart: number,
    priority: number
}

interface props {
    dayIndex: number
    day: AvailabilityPoint[],
    setter: (data: AvailabilityPoint[])=>void
}
export default function Column({dayIndex, day, setter}: props) {
    
    let slots: Slot[] = []
    const priority = 0
    for (var timeStart=0; timeStart<1440; timeStart=timeStart+15) {
        slots.push({timeStart, priority})
    }
    
    day.forEach((availabilityPoint: AvailabilityPoint)=>{
        slots.filter((slot)=>{
            if (( slot.priority == 0 || slot.priority > availabilityPoint.p) && availabilityPoint.s <= slot.timeStart && availabilityPoint.e > slot.timeStart) {
                slot.priority = availabilityPoint.p
            }
            return slot;
        })
    });
    
    const slotElements = slots.map(({timeStart, priority}: Slot) => <TimeSlot key={timeStart} priority={priority} timeStart={timeStart}></TimeSlot>)
    
    return (
      <div data-dayIndex={dayReference[dayIndex]} className={styles.column}>
        {slotElements}
      </div>
    );
}

function TimeSlot({timeStart, priority}: Slot) {
    const time = (() => {
        let i = Math.floor(timeStart/60)
        let post = "AM"
        if (i>=12) {
            post = "PM"
        }
        i = (i % 12)
        if (i == 0) {i=12}
        return i + post;
    })()
    return (
        <div data-hour={time} data-priority={priority} data-debug={timeStart}></div>
    )
}