"use server";

import AvailabilityPoint from "@/common/AvailabilityPoint";
import Table from "./table";

export default async function Page({params}: {params: {id: number}}) {
    
    const data = await (await fetch(`http://localhost:8000/availability/${params.id}`, {
        method: "GET",
        mode: "no-cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      })).json()
    
    async function saveTable(dayData: AvailabilityPoint[][]) {
        "use server";
        await fetch(`http://localhost:8000/availability/${params.id}`, {
            method: "POST",
            mode: "no-cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
            "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(dayData),
        })
    }
    
    return (
      <div>
        <Table initialData={data} saveTable={saveTable} />
      </div>
    );
  }