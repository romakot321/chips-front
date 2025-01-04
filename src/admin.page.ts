import { UserService, UserRepository, UserModel, Vector } from "./user";
import { ServerService } from './server';

const username = "admin";
const updateInterval: number = 1000;

var userContainer: HTMLElement;
var coinsInput: HTMLInputElement;
var coinsButton: HTMLElement;
var restartButton: HTMLElement;

var userRepository: UserRepository;
var userService: UserService;
var serverService: ServerService;
var room: string;
var roomScore: number = 0;
var userCards = new Map<string, HTMLElement>;


function init(baseUrl: string) {
  userContainer = document.getElementById("user-list") as HTMLElement;
  coinsInput = document.getElementById("coins-input") as HTMLInputElement;
  coinsButton = document.getElementById("coins-button") as HTMLElement;
  restartButton = document.getElementById("restart-button") as HTMLElement;
  coinsButton.addEventListener("click", addRoomCoins);
  restartButton.addEventListener("click", restartRoom);

  serverService = new ServerService(
    baseUrl.replace("http://", "ws://") + "/game/ws",
    userService,
    start,
    updateUserScore,
    addUser,
    addUsers
  );

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  for (const i of urlParams) {
    if (i[0] === "room")
      room = i[1];
  }
}

function userWin(name: string): void {
  serverService.win(name);
}

function addRoomCoins(): void {
  const toAdd: number = +coinsInput.value;
  if (toAdd > 0)
    serverService.changeScore(-toAdd);
  coinsInput.value = "0";
}

function restartRoom(): void {
  serverService.restart();
}

function updateUserScore(name: string, score: number): void {
  let user = userService.get(name);
  if (user == undefined)
    return;

  let card = userCards.get(name);
  if (card == undefined)
    return;
  roomScore += -score;
  let cardScore = card.querySelector(".score") as HTMLElement;
  cardScore.textContent = user.score + "p";
}

function addUser(name: string, score: number): void {
  if (name === username || userCards.has(name))
    return;
  const card = makeUserCard(name, score);
  userCards.set(name, card);
  userContainer.appendChild(card);
}

function addUsers(users: {name: string, score: number}[]) {
  users.forEach((user: {name: string, score: number}) => {
    addUser(user.name, user.score);
  });
}

function makeUserCard(username: string, userScore: number): HTMLElement {
  const userCard = document.createElement("div");
  const cardName = document.createElement("p");
  const cardScore = document.createElement("p");
  const winButton = document.createElement("input") as HTMLInputElement;

  userCard.className = "user-card";
  cardName.className = "name";
  cardScore.className = "score";
  winButton.type = "button";
  winButton.value = "Win";

  cardName.textContent = username;
  cardScore.textContent = userScore + "p";
  winButton.addEventListener("click", () => { userWin(username); });

  userCard.appendChild(cardName);
  userCard.appendChild(cardScore);
  userCard.appendChild(winButton);

  return userCard;
}

function start() {
  serverService.authenticate(username, room);
}

export function connectAdmin(
  repository: UserRepository,
  service: UserService,
  baseUrl: string
) {
  userRepository = repository;
  userService = service;

  init(baseUrl);
}
