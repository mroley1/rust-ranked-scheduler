"use client";

import { useState } from "react";
import styles from "./page.module.scss"
import Column from "./column";

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

export default function Page({params}: {params: {id: number}}) {
    
    // min: 0 max: 1440
    let data: AvailabilityPoint[][] = [
        [],
        [{p:2, s:100, e:255}],
        [{p:2, s:300, e:1255}],
        [{p:3, s:300, e:455}, {p:4, s:70, e:200}],
        [{p:2, s:1000, e:1440}, {p:4, s:0, e:70}, {p:1, s:1100, e:1200}],
        [],
        [{p:5, s:30, e:31}],
    ]
    
    const [dayData, setDayDate] = useState(data);
    
    function setCol(index: number, data: AvailabilityPoint[]) {
        const tmp: AvailabilityPoint[][] = dayData;
        tmp[index] = data;
        setDayDate(tmp);
    }
    
    return (
      <div>
        <div className={styles.table}>
            {dayData.map((day, index) => <Column key={index} dayIndex={index} day={day} setter={(data: AvailabilityPoint[])=>{setCol(index, data)}}></Column>)}
        </div>
      </div>
    );
  }