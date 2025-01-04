import { UserService, UserRepository, UserModel, Vector } from "./user";
import { ServerService } from './server';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

var model = new UserModel("a", 0);

let serverService: ServerService;
function openCallback() {
  serverService.authenticate(model.name, "room");
  serverService.changeScore(5);

  function tick() {
    console.log("Users:")
    for (const user of userRepository.list()) {
      console.log(`- ID: ${user.id}, name: ${user.name}, score: ${user.score}`);
    }
    serverService.changeScore(5);
    setTimeout(tick, 500);
  }

  tick();
}
serverService = new ServerService("ws://127.0.0.1:8000/api/game/ws", userService, openCallback);
