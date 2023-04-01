import { Server, Socket } from "socket.io";

import { API, GameMessage } from "./DungeonMasterAPI/api";
import { RoomManager } from "./managers/room_manager";

import { LeaveStatus } from "./enums/leave_status";

import { Message } from "./units/message";
import { Player } from "./units/player";
import { Room } from "./units/room";

const io = new Server(3000);
const room_manager = new RoomManager();
const DMAPI = new API('127.0.0.1', 4000);

io.on("connection", (socket) => 
{
   function leave_event ()
   {
      let room_id: string = socket.data['room_id'];
      let result: LeaveStatus = room_manager.leave_from_room(socket.data['room_id'], socket.id);
      let room: Room = room_manager.get_room(room_id);

      if (result === LeaveStatus.Faild || !room) return;
      io.to(room_id).emit('update_players_list', room.get_players());
      socket.leave(room_id);

      if (room.get_players_count() === 0) 
      {
         room_manager.remove_room(room_id);
         return;
      }

      if (result === LeaveStatus.KingLeaved)
      {
         let king: Player = room.get_king(); 
         
         for (let socket_id of Array.from(io.sockets.adapter.rooms.get(room_id)))
         {
            if (socket_id === king.id) 
            {
               let king_socket: Socket = io.sockets.sockets.get(socket_id)
               king_socket.data['king'] = true;
               king_socket.emit('set_king', true);
               break;
            }
         }
      }
   }
   
   socket.data['room_id'] = '';
   socket.data['king'] = false;

   console.log(`Connect ${socket.id}`);

   socket.on("disconnect", () => 
   {
      console.log(`Disconnect ${socket.id}`)

      leave_event();
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
      let player: Player = {id: socket.id, name: player_name, bio: player_bio, ready_state: false, king: socket.data['king']}
      let result: boolean = room_manager.join_to_room(room_id, player);

      if (!result) return;

      socket.data['room_id'] = room_id;

      socket.join(room_id);

      io.to(room_id).emit('update_players_list', room_manager.get_room(room_id).get_players());
   });

   socket.on("leave_room", () => leave_event());

   socket.on("start_room", async () => 
   {
      if (!socket.data['king']) return;

      let room_id: string = socket.data['room_id']
      let room: Room = room_manager.get_room(room_id); 

      if (!room || !room.check_all_ready()) return;

      room.start_room();

      io.to(room_id).emit('start_room');
      io.to(room_id).emit('set_cur_name', 'ChatGPT');
      
      let start_message: string = await DMAPI.create_session(room.id, room.genre, room.intro, room.get_players());

      io.to(room_id).emit('get_message', 'ChatGPT', start_message);
      io.to(room_id).emit('set_cur_name', room.get_player(socket.id).name);

      socket.emit('set_cur', true);
   });

   socket.on("update_player_info", (name: string, bio: string, ready_state: boolean) => 
   {
      let room_id: string = socket.data['room_id'];
      let king: boolean = socket.data['king'];
      let room: Room = room_manager.get_room(room_id); 

      if (!room || !room.player_exists(socket.id)) return;

      let player: Player = {id: socket.id, name: name, bio: bio, ready_state: ready_state, king: king};

      room.replace_player(socket.id, player);

      io.to(room_id).emit('update_players_list', room_manager.get_room(room_id).get_players());
   });

   socket.on("get_message", async (text: string) => 
   {
      let room_id: string = socket.data['room_id'];
      let room: Room = room_manager.get_room(room_id); 

      if (!room || !room.player_exists(socket.id)) return;

      let player: Player = room.get_player(socket.id);
      let message: Message = {sender_id: socket.id, sender_name: player.name, text: text};

      if (!room.is_mover(player)) return;

      socket.emit('set_cur', false);

      io.to(room_id).emit('get_message', message.sender_name, message.text);
      io.to(room_id).emit('set_cur_name', 'ChatGPT');

      let game_message: GameMessage = await DMAPI.message(room_id, message);

      if (game_message.game_end) {io.to(room_id).emit('end_game')};

      io.to(room_id).emit('get_message', 'ChatGPT', game_message.text);
      
      room.next_mover();

      let mover: Player = room.get_mover(); 

      socket.emit('set_cur_name', mover.name);

      for (let socket_id of Array.from(io.sockets.adapter.rooms.get(room_id)))
      {
         if (socket_id === mover.id) 
         {
            let mover_socket: Socket = io.sockets.sockets.get(socket_id)
            mover_socket.emit('set_cur', true);
            break;
         }
      }      
   });

   socket.on("kick_player", (id: string, reason: string) => 
   {
      if (!socket.data['king']) return;
      let room_id: string = socket.data['room_id'];
      let room: Room | null = room_manager.get_room(room_id);

      if (!room || !room.player_exists(id)) return;

      room.remove_player(id);

      socket.emit('kick_event', reason);

      io.to(room_id).emit('update_players_list', room.get_players());
   });
});

