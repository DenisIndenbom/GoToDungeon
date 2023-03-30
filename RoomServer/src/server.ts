import { Server } from "socket.io";

import { RoomManager } from "./managers/room_manager";

import { Message } from "./units/message";
import { Player } from "./units/player";
import { Room } from "./units/room";

const io = new Server(3000);
const room_manager = new RoomManager();

io.on("connection", (socket) => 
{
   socket.data['room_id'] = '';
   socket.data['king'] = false;

   console.log(`Connect ${socket.id}`);

   socket.on("disconnect", () => 
   {
      console.log(`Disconnect ${socket.id}`)
   })

   socket.on("create_room", (genre: string, intro: string) => 
   {
      let room_id: string = room_manager.create_room(genre, intro);
      socket.emit('get_room_id', room_id);
      socket.emit('set_king', true);

      socket.data['king'] = true;
   });

   socket.on("join_to_room", (room_id: string, player_name: string, player_bio: string) => 
   {
      let player: Player = {id: socket.id, name: player_name, bio: player_bio, ready_state: false, king: false}
      let result: boolean = room_manager.join_to_room(room_id, player);

      if (!result) return;

      socket.data['room_id'] = room_id;

      socket.join(room_id.toString());

      io.to(room_id.toString()).emit('update_players_list', room_manager.get_room(room_id).get_players());
   });

   socket.on("leave_room", () => 
   {
      let room_id: string = socket.data['room_id'];
      let result: boolean = room_manager.leave_from_room(socket.data['room_id'], socket.id);
      let room: Room = room_manager.get_room(room_id);

      if (!result || !room) return;

      io.to(room_id.toString()).emit('update_players_list', room.get_players());
      
      socket.leave(room_id.toString());

      if (room.get_players_count() === 0) room_manager.remove_room(room_id);
   });

   socket.on("start_room", () => 
   {
      if (!socket.data['king']) return;

      let room_id: string = socket.data['room_id']
      let room: Room = room_manager.get_room(room_id); 

      if (!room || !room.check_all_ready()) return;

      room.start_room();

      io.to(room_id.toString()).emit('start_room');      
   });

   socket.on("update_player_info", (name: string, bio: string, ready_state: boolean) => 
   {
      let room_id: string = socket.data['room_id'];
      let king: boolean = socket.data['king'];
      let room: Room = room_manager.get_room(room_id); 

      if (!room || !room.player_exists(socket.id)) return;

      let player: Player = {id: socket.id, name: name, bio: bio, ready_state: ready_state, king: king};

      room.replace_player(socket.id, player);

      io.to(room_id.toString()).emit('update_players_list', room_manager.get_room(room_id).get_players());
   });

   socket.on("get_message", (text: string) => 
   {
      let room_id: string = socket.data['room_id'];
      let room: Room = room_manager.get_room(room_id); 

      if (!room || !room.player_exists(socket.id)) return;

      let player: Player = room.get_player(socket.id);
      let message: Message = {sender_id: socket.id, sender_name: player.name, text: text};

      if (!room.is_mover(player)) return;

      room.next_mover();
      
      io.to(room_id.toString()).emit('get_message', message.sender_name, message.text);
   });

   socket.on("kick_player", (id: string, reason: string) => 
   {
      if (!socket.data['king']) return;
      let room_id: string = socket.data['room_id'];
      let room: Room | null = room_manager.get_room(room_id);

      if (!room || !room.player_exists(id)) return;

      room.remove_player(id);

      socket.emit('kick_event', reason);

      io.to(room_id.toString()).emit('update_players_list', room.get_players());
   });
});

