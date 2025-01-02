import { UserService, UserRepository, UserModel, Vector } from "./user";
import { ServerService } from './server';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

var model = userService.create("user2")

let serverService: ServerService;
function openCallback() {
  serverService.authenticate(model.name, "room");
  model.move(new Vector(5, 5));
  serverService.move(model.position.x, model.position.y);

  function tick() {
    console.log("Users:")
    for (const user of userRepository.list()) {
      console.log(`- ID: ${user.id}, name: ${user.name}, pos: ${user.position.x} ${user.position.y}`);
    }
    model.move(new Vector(5, 5));
    serverService.move(5, 5);
    setTimeout(tick, 500);
  }

  tick();
}
serverService = new ServerService("ws://127.0.0.1:8000/api/game/ws", userService, openCallback);
