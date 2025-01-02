"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
const server_1 = require("./server");
const userRepository = new user_1.UserRepository();
const userService = new user_1.UserService(userRepository);
var model = userService.create("user2");
let serverService;
function openCallback() {
    serverService.authenticate(model.name, "room");
    model.move(new user_1.Vector(5, 5));
    serverService.move(model.position.x, model.position.y);
    function tick() {
        console.log("Users:");
        for (const user of userRepository.list()) {
            console.log(`- ID: ${user.id}, name: ${user.name}, pos: ${user.position.x} ${user.position.y}`);
        }
        model.move(new user_1.Vector(5, 5));
        serverService.move(model.position.x, model.position.y);
        setTimeout(tick, 500);
    }
    tick();
}
serverService = new server_1.ServerService("ws://127.0.0.1:8000/api/game/ws", userService, openCallback);
