import styles from "./page.module.scss";
import { postData } from "../util";
import { redirect } from "next/navigation";

export default async function Page() {
  
  const test = async (data: FormData) => {
    "use server";
    let response: {[key: string]: any} = await postData("login", JSON.parse(`{"name": "${data.get("username")}"}`))
    redirect(`/user/${response.id}`)
  }
  
  return (
    <div>
      <form action={test}>
        <input type="text" id="username" name="username" autoComplete="off"></input>
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
