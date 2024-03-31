"use server";

import AvailabilityPoint from "@/common/AvailabilityPoint";

export default async function Page({params}: {params: {meetingId: number, userId: number}}) {
    
    // const availabilityData = await (await fetch(`http://localhost:8000/availability/${params.id}`, {
    //     method: "GET", mode: "no-cors", cache: "no-cache", credentials: "same-origin", headers: {"Content-Type": "application/json",}, redirect: "follow", referrerPolicy: "no-referrer",
    // })).json()
      
    // const userData = await (await fetch(`http://localhost:8000/participant/${params.id}`, {
    //     method: "GET", mode: "no-cors", cache: "no-cache", credentials: "same-origin", headers: {"Content-Type": "application/json",}, redirect: "follow", referrerPolicy: "no-referrer",
    // })).json()
    
    // async function saveTable(dayData: AvailabilityPoint[][]) {
    //     "use server";
    //     await fetch(`http://localhost:8000/availability/${params.id}`, {
    //         method: "POST", mode: "no-cors", cache: "no-cache", credentials: "same-origin", headers: {"Content-Type": "application/json",}, redirect: "follow", referrerPolicy: "no-referrer",
    //         body: JSON.stringify(dayData),
    //     })
    // }
    
    // const meetingData = await(await fetch(`http://localhost:8000/meeting/${params.id}`, {
    //     method: "GET", mode: "no-cors", cache: "no-cache", credentials: "same-origin", headers: {"Content-Type": "application/json",}, redirect: "follow", referrerPolicy: "no-referrer",
    // })).json()
    
    return (
        <div>
            {params.meetingId}  {params.userId}
        </div>
    );
  }