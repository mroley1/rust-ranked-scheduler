import AvailabilityPoint from '@/common/AvailabilityPoint';
import { NextResponse } from 'next/server'

export async function GET(request: Request, {params}: {params: {id: string}}) {
    const res = await fetch(`http://localhost:8000/availability/${params.id}`, {
      method: "GET",
      mode: "no-cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
    const data: AvailabilityPoint[][] = await res.json()
    
    return NextResponse.json(data)
}

export async function POST(request: Request, {params}: {params: {id: string}}) {
  const res = await fetch(`http://localhost:8000/availability/${params.id}`, {
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
 
  return NextResponse.json(null)
}