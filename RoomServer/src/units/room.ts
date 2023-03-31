import { Player } from "./player"

export class Room 
{
    private players: Array<Player>;
    private mover_index: number;

    public id: string;
    public genre: string;
    public intro: string;
    public running: boolean;

    public constructor(id: string, genre: string, intro: string)
    {
        this.players = new Array<Player>();

        this.id = id;
        this.genre = genre;
        this.intro = intro;
        this.mover_index = 0;
        this.running = false;
    }

    public start_room()
    {this.running = true;}

    public get_players_count() : number
    {return this.players.length}

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

    public remove_player(id: string) : Player | null
    {        
        for (let i = 0; i < this.players.length; i++)
        {
            if (this.players[i].id === id) 
            {
                let clone: Player = structuredClone(this.players[i]);
                this.players.splice(i, 1);

                return clone;
            }
        }
        
        return null;
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

    public get_king(): Player | null
    {
        for (let player of this.players) 
        {if (player.king) return player;}
        
        return null;
    }
    
    public set_new_king() : boolean
    {
        if (this.players.length === 0) return false;

        this.players[0].king = true;

        return true;
    }

    public get_mover() : Player 
    {return this.players[this.mover_index]}

    public is_mover(player: Player) : boolean 
    {return this.get_mover() === player;}

    public next_mover()
    {this.mover_index = (this.mover_index < this.players.length - 1) ? this.mover_index + 1 : 0;}

    public check_all_ready() : boolean
    {
        for (let player of this.players)
        {if (!player.ready_state) return false;}
        
        return true;
    }
}