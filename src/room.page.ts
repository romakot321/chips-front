import { RoomService, RoomRepository, RoomModel } from "./room";

var roomContainer: HTMLElement | null;
var authModal: HTMLElement;
var usernameInput: HTMLInputElement;
var sendButton: HTMLElement;

var roomService: RoomService;
var roomRepository: RoomRepository;

var selectedRoom: string | null = null;

function toGame() {
  let username = usernameInput.value;
  window.location.href = "/game.html?room=" + selectedRoom + "&user=" + username;
}

function selectRoom(roomName: string) {
  selectedRoom = roomName;
  authModal.style.display = "block";

  window.onclick = function(event) {
    if (event.target === authModal) {
      authModal.style.display = "none";
    }
  }
}

function addRoomCard(room: RoomModel | null) {
  if (roomContainer == null)
    throw "Cannot add room card while not initialized";
  if (room == null)
    return;

  const roomCard = document.createElement("div");
  const roomNameCard = document.createElement("p");
  const roomPlayersCard = document.createElement("p");

  roomCard.className = "room-card";
  roomNameCard.className = "name";
  roomPlayersCard.className = "players";

  roomNameCard.textContent = room.name;
  roomPlayersCard.textContent = room.users.length + " players";

  roomCard.addEventListener("click", (e) => selectRoom(room.name));

  roomCard.appendChild(roomNameCard);
  roomCard.appendChild(roomPlayersCard);
  roomContainer.appendChild(roomCard);
}

export function loadRooms(service: RoomService, repository: RoomRepository) {
  roomContainer = document.getElementById("room-list");
  authModal = document.getElementById("auth-modal") as HTMLElement;
  usernameInput = document.getElementById("username-input") as HTMLInputElement;
  sendButton = document.getElementById("send-button") as HTMLElement;

  sendButton.addEventListener("click", toGame);

  roomService = service;
  roomRepository = repository;

  roomService.list().then(rooms => {
    rooms.forEach(room => addRoomCard(room));
  })
}
