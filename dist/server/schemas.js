"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersMessageSchema = exports.MoveMessageSchema = exports.AuthenticateMessageSchema = exports.MessageEvent = void 0;
const user_1 = require("../user");
var MessageEvent;
(function (MessageEvent) {
    MessageEvent[MessageEvent["authenticate"] = 0] = "authenticate";
    MessageEvent[MessageEvent["connected"] = 1] = "connected";
    MessageEvent[MessageEvent["move"] = 2] = "move";
    MessageEvent[MessageEvent["entityAdd"] = 3] = "entityAdd";
    MessageEvent[MessageEvent["users"] = 4] = "users";
})(MessageEvent || (exports.MessageEvent = MessageEvent = {}));
class AuthenticateMessageSchema {
    constructor(username, room) {
        this.event = MessageEvent.authenticate;
        this.data = { "username": username, "room": room };
    }
    static validate(obj) {
        return (obj &&
            typeof obj === 'object' &&
            'event' in obj &&
            typeof obj.event === 'number' &&
            obj.event in MessageEvent &&
            'data' in obj &&
            typeof obj.data === 'object' &&
            'username' in obj.data &&
            'room' in obj.data);
    }
    static fromObject(raw) {
        var obj = JSON.parse(raw);
        if (!AuthenticateMessageSchema.validate(obj) || obj.event != MessageEvent.move)
            return null;
        return new AuthenticateMessageSchema(obj.data.username, obj.data.room);
    }
}
exports.AuthenticateMessageSchema = AuthenticateMessageSchema;
class MoveMessageSchema {
    constructor(x, y, username) {
        this.event = MessageEvent.move;
        this.data = { x: x, y: y, username: username };
    }
    static validate(obj) {
        return (obj &&
            typeof obj === 'object' &&
            'event' in obj &&
            typeof obj.event === 'number' &&
            obj.event in MessageEvent &&
            'data' in obj &&
            typeof obj.data === 'object' &&
            'x' in obj.data &&
            'username' in obj.data &&
            'y' in obj.data);
    }
    static fromObject(raw) {
        var obj = JSON.parse(raw);
        if (!MoveMessageSchema.validate(obj) || obj.event != MessageEvent.move)
            return null;
        return new MoveMessageSchema(obj.data.x, obj.data.y, obj.data.username === "" ? null : obj.data.username);
    }
}
exports.MoveMessageSchema = MoveMessageSchema;
class UsersMessageSchema {
    constructor(users) {
        this.event = MessageEvent.users;
        let parsedUsers = [];
        for (const user of users)
            parsedUsers.push({ name: user.name, x: user.position.x, y: user.position.y });
        this.data = { users: parsedUsers };
    }
    static validate(obj) {
        return (obj &&
            typeof obj === 'object' &&
            'data' in obj &&
            typeof obj.data === 'object' &&
            'users' in obj.data &&
            Array.isArray(obj.data.users) &&
            'event' in obj &&
            typeof obj.event === 'number' &&
            obj.event in MessageEvent);
    }
    static fromObject(raw) {
        var obj = JSON.parse(raw);
        if (!UsersMessageSchema.validate(obj) || obj.event != MessageEvent.users)
            return null;
        let users = [];
        for (const user of obj.data.users)
            users.push(new user_1.UserModel(user.name, user.x, user.y));
        return new UsersMessageSchema(users);
    }
}
exports.UsersMessageSchema = UsersMessageSchema;
