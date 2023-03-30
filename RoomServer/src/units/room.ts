import { Player } from "./player"
import { Message } from "./message"

export class Room 
{
    private players: Array<Player>;
    private walker_index: number;

    public genre: string;
    public intro: string;
    public running: boolean;


    public constructor(genre: string, intro: string)
    {
        this.players = new Array<Player>();
        this.genre = genre;
        this.intro = intro;
        this.walker_index = 0;
        this.running = false;
    }

    public get_players() : Array<Player> 
    {return this.players}

    public get_player(id: string) : Player | null
    {
        for (let player of this.players) 
        {
            if (player.id === id) return player;
        }

        return null;
    }

    public add_player(player: Player) 
    {this.players.push(player);}

    public remove_player(id: string) : boolean
    {        
        for (let i = 0; i < this.players.length; i++)
        {
            if (this.players[i].id === id) 
            {
                this.players.splice(i, 1);
                return true;
            }
        }
        
        return false;
    }

    public replace_player(id: string, player: Player)
    {
        for (let i = 0; i < this.players.length; i++)
        {
            if (this.players[i].id === id) 
            {
                this.players[i] = player;
                return true;
            }
        }
        
        return false;
    }

    public player_exists(id: string) : boolean
    {
        for (let player of this.players) 
        {if (player.id === id) return true;}
        
        return false;
    }

    public get_walker(): Player 
    {return this.players[this.walker_index]}

    public next_walker()
    {
        if (this.walker_index < this.players.length) this.walker_index++;
        else this.walker_index = 0;
    }

    public start_room()
    {this.running = true;}

    public check_all_ready(): boolean
    {
        for (let player of this.players)
        {if (!player.ready_state) return false;}
        
        return true;
    }
}