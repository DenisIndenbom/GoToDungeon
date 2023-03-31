import { Player } from "../units/player";
import { API } from "./api";

const api: API = new API("127.0.0.1", 4000);

async function main()
{
    let r = await api.create_session(
        "0",
        "Фэнтнези",
        "да",
        new Array<Player>({
          id: "0",
          name: "meow",
          bio: "meow meow",
          ready_state: false,
          king: false,
        })
      );
    
    console.log(r);
    
    let t = await api.message("0", {
        sender_id: "",
        sender_name: "meow",
        text: "За орду!",});
    
    console.log(t);
}

main()