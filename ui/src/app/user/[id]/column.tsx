"use client";

import styles from "./page.module.scss"
import { availabilityPoint, dayReference } from "./page";

interface props {
    dayIndex: number
    day: availabilityPoint[],
    setter: (data: availabilityPoint[])=>void
}
export default function Column({dayIndex, day, setter}: props) {
    
    let slots = []
    
    for (var i=0; i<1440; i=i+15) {
        slots.push(<TimeSlot key={i} timeStart={i}></TimeSlot>)
    }
    
    return (
      <div data-dayIndex={dayReference[dayIndex]} className={styles.column}>
        {slots}
      </div>
    );
}

function TimeSlot({timeStart}: {timeStart: number}) {
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
        <div data-hour={time}></div>
    )
}