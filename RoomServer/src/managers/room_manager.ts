import { Room } from "../units/room";
import { Player } from "../units/player";

export class RoomManager 
{
    private rooms: Array<Room>;

    public constructor()
    {this.rooms = new Array<Room>();}

    public create_room(genre: string, intro: string) : number
    {
        this.rooms.push(new Room(genre, intro));

        return this.rooms.length - 1
    }

    public remove_room(id: number) : boolean
    {
        if (id < 0 && id >= this.rooms.length) return false;
        
        delete this.rooms[id];

        return true;
    }

    public get_room(id: number) : Room 
    {
        if (id < 0 && id >= this.rooms.length) return null;

        return this.rooms[id]
    }

    public join_to_room(id: number, player: Player)
    {this.rooms[id].add_player(player);}

    public leave_from_room(room_id: number, player_id: string) 
    {this.rooms[room_id].remove_player(player_id);}

}