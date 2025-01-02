"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = exports.UserModel = void 0;
class UserModel {
    constructor(name, x = undefined, y = undefined) {
        this.name = name;
        this.id = null;
        this.position = new Vector(x !== null && x !== void 0 ? x : 0, y !== null && y !== void 0 ? y : 0);
    }
    move(bias) {
        this.position.add(bias);
    }
}
exports.UserModel = UserModel;
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
}
exports.Vector = Vector;
