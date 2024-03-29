"use client";

import { useState } from "react";
import styles from "./page.module.scss"
import Column from "./column";
import AvailabilityPoint from "@/common/AvailabilityPoint";


export const dayReference = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednsday",
    "Thursday",
    "Friday",
    "Saturday"
]

export const priorityReference = [
    "rgb(255, 0, 0)",
    "rgb(230, 48, 138)",
    "rgb(177, 42, 222)",
    "rgb(89, 40, 237)",
    "rgb(37, 71, 240)",
    "rgb(0, 116, 230)",
]

export default function Table({initialData, post}: {initialData: AvailabilityPoint[][], post: (dayData: AvailabilityPoint[][])=>{}}) {
    
    const [dayData, setDayData] = useState(initialData);
    
    function setCol(index: number, data: AvailabilityPoint[]) {
        const tmp: AvailabilityPoint[][] = JSON.parse(JSON.stringify(dayData));
        tmp[index] = data;
        setDayData(tmp);
        post(tmp)
    }
    
    const [currentPriority, setCurrentPriority] = useState(1)
    
    function prioritySelect(priority: number) {
        setCurrentPriority(priority)
    }
    
    return (
      <div>
        <div className={styles.table}>
            {dayData.map((day, index) => <Column key={index} dayName={dayReference[index]} day={day} priority={currentPriority} setter={(data: AvailabilityPoint[])=>{setCol(index, data)}}></Column>)}
        </div>
        <div>
            <button onClick={()=>{prioritySelect(0)}}>0</button>
            <button onClick={()=>{prioritySelect(1)}}>1</button>
            <button onClick={()=>{prioritySelect(2)}}>2</button>
            <button onClick={()=>{prioritySelect(3)}}>3</button>
            <button onClick={()=>{prioritySelect(4)}}>4</button>
            <button onClick={()=>{prioritySelect(5)}}>5</button>
        </div>
      </div>
    );
  }