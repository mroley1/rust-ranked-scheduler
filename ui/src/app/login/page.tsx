import styles from "./page.module.scss";
import { postData } from "../util";

export default async function Page() {
  
  const test = async (data: FormData) => {
    "use server";
    postData(`participant/${data.get("username")}`, JSON.parse("{}"))
    console.log(data.get("username"))
  }
  
  return (
    <div>
      <form action={test}>
        <input type="text" id="username" name="username"></input>
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
