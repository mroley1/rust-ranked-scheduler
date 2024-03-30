"use server";

import AvailabilityPoint from "@/common/AvailabilityPoint";
import Table from "./table";
import MeetingOption from "./meetingOption";
import meetingStyles from "./meetingOption.module.scss"

export default async function Page({params}: {params: {id: number}}) {
    
    const availabilityData = await (await fetch(`http://localhost:8000/availability/${params.id}`, {
        method: "GET", mode: "no-cors", cache: "no-cache", credentials: "same-origin", headers: {"Content-Type": "application/json",}, redirect: "follow", referrerPolicy: "no-referrer",
    })).json()
      
    const userData = await (await fetch(`http://localhost:8000/participant/${params.id}`, {
        method: "GET", mode: "no-cors", cache: "no-cache", credentials: "same-origin", headers: {"Content-Type": "application/json",}, redirect: "follow", referrerPolicy: "no-referrer",
    })).json()
    
    async function saveTable(dayData: AvailabilityPoint[][]) {
        "use server";
        await fetch(`http://localhost:8000/availability/${params.id}`, {
            method: "POST", mode: "no-cors", cache: "no-cache", credentials: "same-origin", headers: {"Content-Type": "application/json",}, redirect: "follow", referrerPolicy: "no-referrer",
            body: JSON.stringify(dayData),
        })
    }
    
    const meetingData = await(await fetch(`http://localhost:8000/meeting/${params.id}`, {
        method: "GET", mode: "no-cors", cache: "no-cache", credentials: "same-origin", headers: {"Content-Type": "application/json",}, redirect: "follow", referrerPolicy: "no-referrer",
    })).json()
    
    return (
      <div>
        <Table initialData={availabilityData} saveTable={saveTable} />
        <h1>user: {userData.name}</h1>
        <div className={meetingStyles.meetingsContainer}>
            {meetingData.map((meeting: {meeting: {id: number, name:string, length: number}, tag: number}) => <MeetingOption meeting={meeting.meeting} tag={meeting.tag}></MeetingOption>)}
        </div>
      </div>
    );
  }