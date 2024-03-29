"use server";

import AvailabilityPoint from "@/common/AvailabilityPoint";
import Table from "./table";

export default async function Page({params}: {params: {id: number}}) {
    
    const data = await (await fetch(process.env.URL + `/api/availability/${params.id}`)).json()
    
    async function post(dayData: AvailabilityPoint[][]) {
        "use server";
        await fetch(process.env.URL + `/api/availability/${params.id}`, {
            method: "POST",
            body: JSON.stringify(dayData)
        })
    }
    
    return (
      <div>
        <Table initialData={data} post={post} />
      </div>
    );
  }