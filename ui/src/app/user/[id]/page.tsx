"use client";

import { useState } from "react";
import styles from "./page.module.scss"
import Column from "./column";

export interface availabilityPoint {
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
    
    let data: availabilityPoint[][] = [
        [],
        [{p:2, s:30, e:255}],
        [{p:2, s:30, e:355}],
        [{p:3, s:30, e:455}, {p:4, s:50, e:70}],
        [{p:1, s:300, e:600}, {p:4, s:50, e:70}],
        [],
        [{p:5, s:30, e:31}],
    ]
    
    const [dayData, setDayDate] = useState(data);
    
    function setCol(index: number, data: availabilityPoint[]) {
        const tmp: availabilityPoint[][] = dayData;
        tmp[index] = data;
        setDayDate(tmp);
    }
    
    return (
      <div>
        <div className={styles.table}>
            {dayData.map((day, index) => <Column key={index} dayIndex={index} day={day} setter={(data: availabilityPoint[])=>{setCol(index, data)}}></Column>)}
        </div>
      </div>
    );
  }