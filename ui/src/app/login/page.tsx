import styles from "./page.module.scss";
import { redirect } from "next/navigation";

export default function Page() {
  
  const login = async (data: FormData) => {
    "use server";
    
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
      body: `{"name": "${data.get("username")}"}`,
    });
    
    redirect(`/user/${(await res.json()).id}`)
  }
  
  return (
    <div>
      <form action={login}>
        <input type="text" id="username" name="username" autoComplete="off"></input>
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
