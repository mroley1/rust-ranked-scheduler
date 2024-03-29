import { POST } from "../api/login/route";
import styles from "./page.module.scss";
import { redirect } from "next/navigation";

export default function Page() {
  
  const login = async (data: FormData) => {
    "use server";
    //let response: {[key: string]: any} = await postData("login", JSON.parse(`{"name": "${data.get("username")}"}`))
    let response: any = await (await fetch(process.env.URL + `/api/login`, {
        method: "POST",
        body: `{"name": "${data.get("username")}"}`
    })).json()
    redirect(`/user/${response.id}`)
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
