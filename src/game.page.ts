import { UserService, UserRepository, UserModel, Vector } from "./user";
import { ServerService } from './server';
import { GameService } from "./game";

var userRepository: UserRepository;
var userService: UserService;
var serverService: ServerService;
var gameService: GameService;
var room: string;
var username: string;

var betButton: HTMLElement;

function doBet() {
  let amount = gameService.bet();
  serverService.changeScore(-amount);
}

function init(baseUrl: string) {
  betButton = document.getElementById("bet-button") as HTMLElement;
  betButton.addEventListener("click", doBet);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  for (const i of urlParams) {
    if (i[0] === "room")
      room = i[1];
    else if (i[0] == "user")
      username = i[1];
  }

  gameService = new GameService(userService, username);

  serverService = new ServerService(
    baseUrl.replace("http://", "wss://") + "/game/ws",
    userService,
    start,
    (username: string, amount: number) => { gameService.updateCoins(); },
    (username: string, score: number) => { gameService.updateCoins(); }
  );
}

function start() {
  serverService.authenticate(username, room);
  gameService.start();
}

export function startGame(
  repository: UserRepository,
  service: UserService,
  baseUrl: string
) {
  userRepository = repository;
  userService = service;

  init(baseUrl);
}
