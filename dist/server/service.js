"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerService = void 0;
const user_1 = require("../user");
const schemas_1 = require("./schemas");
let WebSocket;
if (typeof window !== 'undefined') {
    // Running in the browser
    WebSocket = window.WebSocket;
}
else {
    // Running in Node.js
    WebSocket = require('ws');
}
class ServerService {
    constructor(address, userService, openCallback) {
        this.userService = userService;
        this.openCallback = openCallback;
        this.isConnected = false;
        this.connectionCreds = null;
        this.socket = new WebSocket(address);
        this.initListeners();
    }
    initListeners() {
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose.bind(this);
    }
    onOpen() {
        this.isConnected = true;
        console.log("Server connected");
        this.openCallback();
    }
    onClose() {
        this.isConnected = false;
    }
    onMessage(event) {
        console.log("Receive: ", event.data);
        const handler = new MessageHandler(this.userService);
        handler.handle(event.data);
    }
    sendMessage(message) {
        if (this.isConnected == false)
            throw "Attempt to send message while server not connected";
        this.socket.send(message);
    }
    authenticate(username, room) {
        this.connectionCreds = username;
        let msg = new schemas_1.AuthenticateMessageSchema(username, room);
        this.sendMessage(JSON.stringify(msg));
    }
    move(x, y) {
        let msg = new schemas_1.MoveMessageSchema(x, y, null);
        this.sendMessage(JSON.stringify(msg));
    }
}
exports.ServerService = ServerService;
class MessageHandler {
    constructor(userService) {
        this.userService = userService;
    }
    handleUsers(msg) {
        console.log("Add users");
        for (const user of msg.data.users)
            this.userService.create(user.name, user.x, user.y);
    }
    handleMove(msg) {
        console.log("Move user");
        if (msg.data.username != null)
            this.userService.move(msg.data.username, new user_1.Vector(msg.data.x, msg.data.y));
    }
    handle(raw) {
        let msg = schemas_1.UsersMessageSchema.fromObject(raw);
        if (msg !== null)
            return this.handleUsers(msg);
        msg = schemas_1.MoveMessageSchema.fromObject(raw);
        if (msg !== null)
            return this.handleMove(msg);
    }
}
