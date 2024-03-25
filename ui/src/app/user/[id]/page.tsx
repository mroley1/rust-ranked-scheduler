"use client";

import { useState } from "react";
import styles from "./page.module.scss"
import Column from "./column";
import { postData } from "@/app/util";

export interface AvailabilityPoint {
    p:number, s:number, e:number
}

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

// min: 0 max: 1440
const initialData: AvailabilityPoint[][] = [
    [],
    [{p:2, s:100, e:255}],
    [{p:2, s:300, e:1255}],
    [{p:3, s:300, e:455}, {p:4, s:70, e:200}],
    [{p:2, s:1000, e:1440}, {p:4, s:0, e:70}, {p:1, s:1100, e:1200}],
    [],
    [{p:5, s:30, e:31}],
]

export default function Page({params}: {params: {id: number}}) {
    
    const [dayData, setDayData] = useState(initialData);
    
    function setCol(index: number, data: AvailabilityPoint[]) {
        const tmp: AvailabilityPoint[][] = JSON.parse(JSON.stringify(dayData));
        tmp[index] = data;
        setDayData(tmp);
        postData(`availability/${params.id}`, JSON.parse(JSON.stringify(tmp)))
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