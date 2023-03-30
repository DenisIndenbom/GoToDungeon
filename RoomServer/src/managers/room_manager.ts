import {v4 as uuidv4} from 'uuid';

import { Room } from "../units/room";
import { Player } from "../units/player";

export class RoomManager 
{
    private rooms: Array<Room>;

    public constructor()
    {this.rooms = new Array<Room>();}
    
    public create_room(genre: string, intro: string) : string
    {
        let room_id: string = uuidv4();
        
        this.rooms.push(new Room(room_id, genre, intro));

        return room_id;
    }

    public remove_room(id: string) : boolean
    {
        for (let [i, room] of this.rooms.entries()) 
        {
            if (room.id === id) 
            {
                this.rooms.splice(i, 1);
                return true;
            }
        }

        return false;
    }

    public get_room(id: string) : Room | null
    {
        for (let room of this.rooms)
        {if (room.id === id) return room;}

        return null;
    }

    public join_to_room(room_id: string, player: Player): boolean
    {   
        let room: Room = this.get_room(room_id);
        if (!room) return false;

        room.add_player(player);

        return true;
    }

    public leave_from_room(room_id: string, player_id: string): boolean
    {
        let room: Room = this.get_room(room_id);
        if (!room) return false;

        room.remove_player(player_id);

        return true;
    }

}