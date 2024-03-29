import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const res = await fetch(`http://localhost:8000/login`, {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(await request.json()),
    });
    const data: any = await res.json()
    
    return NextResponse.json(data)
  }