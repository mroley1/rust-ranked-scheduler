"use client";

import styles from "./page.module.scss"
import { AvailabilityPoint, priorityReference } from "./page";
import { PointerEvent } from "react";

interface Slot {
    timeStart: number,
    priority: number
}

interface props {
    dayName: string
    day: AvailabilityPoint[],
    priority: number
    setter: (data: AvailabilityPoint[])=>void
}
export default function Column({dayName, day, priority, setter}: props) {
    
    let slots: Slot[] = []

    for (var timeStart=0; timeStart<1440; timeStart=timeStart+15) {
        slots.push({timeStart, priority: 0})
    }
    
    day.forEach((availabilityPoint: AvailabilityPoint)=>{
        slots.filter((slot: any)=>{
            if (( slot.priority == 0 || slot.priority > availabilityPoint.p) && availabilityPoint.s <= slot.timeStart && availabilityPoint.e > slot.timeStart) {
                slot.priority = availabilityPoint.p
            }
            return slot;
        })
    });
    
    function selectStart(event: PointerEvent<Element>) {
        let target = event.target as HTMLDivElement
        target.onpointermove = (e: any)=>{select(e)};
        target.setPointerCapture(event.pointerId);
    }
    
    function selectEnd(event: PointerEvent) {
        function lookupColor(lookup: string) {
            for (var i = 0; i<priorityReference.length; i++) {
                if (priorityReference[i] == lookup) {
                    return i
                }
            }
            return 0
        }
        let target = event.target as HTMLDivElement
        target.onpointermove = null;
        target.releasePointerCapture(event.pointerId);
        const children = target.parentElement?.children!
        var availabilityPoints: AvailabilityPoint[] = []
        var lastChildColor = "rgba(0, 0, 0, 0)"
        var currentSection: AvailabilityPoint|null = null//{p: 0, s:0, e:1440} 
        for (var i = 0; i < children.length; i++) {
            const child: HTMLElement = children[i] as HTMLElement;
            const minute = parseInt(child.getAttribute("data-minute")||"0")
            const bgColor = child.computedStyleMap().get("background-color")!.toString()
            child.style.backgroundColor = ""
            if (bgColor != lastChildColor) {
                if (lastChildColor != "rgba(0, 0, 0, 0)" && lastChildColor != priorityReference[0]) {
                    currentSection!.e = minute
                    availabilityPoints.push(currentSection!)
                }
                currentSection = {p: lookupColor(bgColor), s: minute, e: 1440}
                lastChildColor = bgColor
            }
        }
        if (currentSection != null && currentSection?.p != 0) {
            currentSection!.e = 1440
            availabilityPoints.push(currentSection!)
        }
        setter(availabilityPoints)
    }
    
    function select(e: PointerEvent<Element>) {
        const starter = e.target as HTMLDivElement
        const under = document.elementFromPoint(starter.getBoundingClientRect().x, e.clientY)! as HTMLDivElement
        if (under == null) {return}
        const children = starter.parentElement?.children!
        for (var i = 0; i < children.length; i++) {
            const child: HTMLElement = children[i] as HTMLElement;
            let minute = parseInt(child.getAttribute("data-minute")!);
            let starterBound = parseInt(starter.getAttribute("data-minute")|| "0");
            let underBound = parseInt(under.getAttribute("data-minute") || (()=>{
                if (starter.getBoundingClientRect().y < e.clientY) {
                    return "1440"
                } else {
                    return "0"
                }
            })());
            if (
                (minute >= starterBound && minute < underBound) || 
                (minute >= underBound && minute < starterBound)
            ) {
                child.style.backgroundColor = priorityReference[priority];
            } else {
                child.style.backgroundColor = "";
            }
        }
    }
    
    const slotElements = slots.map(({timeStart, priority}: Slot) => <TimeSlot key={timeStart} priority={priority} timeStart={timeStart}></TimeSlot>)
    
    return (
      <div data-dayname={dayName} className={styles.column} onPointerDownCapture={selectStart} onPointerUpCapture={selectEnd}>
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
        <div data-hour={time} data-minute={timeStart} data-priority={priority}></div>
    )
}