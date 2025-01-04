import { UserService, UserRepository } from "./user";
import { RoomService, RoomRepository } from "./room";
import { loadRooms } from './room.page';
import { startGame } from './game.page';
import { connectAdmin } from './admin.page';

declare global {
  interface Window {
    Telegram: any;
  }
}

function disableScrolling() {
  const app = window.Telegram.WebApp;
  app.expand();
  app.ready();
  app.disableVerticalSwipes();
  app.requestFullscreen();
  document.body.style.overflowY = 'hidden';
  document.body.style.marginTop = `5px`;
  document.body.style.height = window.innerHeight + 5 + "px";
  document.body.style.paddingBottom = `5px`;
  window.scrollTo(5, 5);
}

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
