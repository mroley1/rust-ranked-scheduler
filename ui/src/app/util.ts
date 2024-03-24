
export async function getData(endpoint: string): Promise<JSON> {
    const res = await fetch(`http://localhost:8000/${endpoint}`, {
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
    
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    
    return res.json()
}

export async function postData(endpoint: string, data: JSON): Promise<JSON> {
    const res = await fetch(`http://localhost:8000/${endpoint}`, {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    
    return res.json()
}