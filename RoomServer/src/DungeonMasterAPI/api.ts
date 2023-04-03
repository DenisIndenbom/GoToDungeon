import { Message } from "../units/message";
import { Player } from "../units/player";

type StartMessageResponse = 
{
    text: string
};

export type GameMessage = 
{
    text: string,
    game_end: string,
};

class ConnectionError extends Error {
    code: string;

    constructor(message?: string, code?: string) {
        super(message);  // 'Error' breaks prototype chain here
        Object.setPrototypeOf(this, new.target.prototype);  // restore prototype chain
        this.name = 'ConnectionError';
        this.code = code;
    }
}

export class API 
{
    private address: string;

    constructor(ip: string, port: number)
    {
        this.address = `http://${ip}:${port}`;

        this.test_connection();
    }

    private test_connection()
    {
        fetch(`${this.address}/test`, 
        {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({text: "This is a test message!"}),
        }).catch(error => {throw new ConnectionError(`Failed to connect to the DungeonMaster. Please check the ip or port. Used ip address: ${this.address}`, 'CONNECT_FAILED');});
    }

    public async create_session(id: string, genre: string, intro: string, players: Array<Player>) : Promise<string> | null
    {
        let result = await fetch(`${this.address}/session`, 
        {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id, genre: genre, intro: intro, players: players}),
        })

        return result.status === 200 ? (await result.json() as StartMessageResponse)['text'] : null;
    }

    public delete_session(id: string)
    {
        fetch(`${this.address}/session/${id}`, 
        {
            method: "delete",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}),
        });
    }

    public async message(session_id: string, message: Message) : Promise<GameMessage> | null
    {
        let result = await fetch(`${this.address}/session/${session_id}/message`, 
        {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({sender_name: message.sender_name, text: message.text}),
        })

        return result.status === 200 ? await result.json() as GameMessage : null;
    }
}