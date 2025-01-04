import { UserService, UserRepository } from "./user";
import { RoomService, RoomRepository } from "./room";
import { loadRooms } from './room.page';
import { startGame } from './game.page';
import { connectAdmin } from './admin.page';

function init() {
  var baseUrl = "https://poker.eramir.ru/api"

  const roomRepository = new RoomRepository(baseUrl);
  const userRepository = new UserRepository();
  const roomService = new RoomService(roomRepository);
  const userService = new UserService(userRepository);

  console.log("Path:", window.location.pathname);
  switch(window.location.pathname) {
  case "/":
    loadRooms(roomService, roomRepository);
    break;
  case "/game.html":
    startGame(userRepository, userService, baseUrl);
    break;
  case "/admin.html":
    connectAdmin(userRepository, userService, baseUrl);
    break;
  }
}

window.onload = init;
