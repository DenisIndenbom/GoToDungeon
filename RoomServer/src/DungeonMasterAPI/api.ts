import { Message } from "../units/message";
import { Player } from "../units/player";
import { GameMessage } from "./units/game_message";

export class API 
{
    adrdess: string;

    constructor(ip: string, port: number)
    {
        this.adrdess = `${ip}:${port}`;
    }

    public create_session(id: string, genre: string, intro: string, players: Array<Player>) : Promise<string>
    {
        return fetch(`${this.adrdess}/session`, 
        {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id, genre: genre, intro: intro, players: players}),
        })
        .then((response: Response) : string => {
            return response.json['text'];
        });
    }

    public delete_session(id: string)
    {
        fetch(`${this.adrdess}/session/${id}`, 
        {
            method: "delete",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}),
        });
    }

    public message(session_id: string, message: Message) : Promise<GameMessage>
    {
        return fetch(`${this.adrdess}/session/${session_id}`, 
        {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({sender_name: message.sender_name, text: message.text}),
        })
        .then((response: Response) : GameMessage => {
            return {text: response.json['text'], is_end: response.json['game_end']};
        });
    }
}