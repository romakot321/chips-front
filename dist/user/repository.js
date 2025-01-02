"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
class UserRepository {
    constructor() {
        this.users = [];
    }
    store(model) {
        model.id = this.users.length + 1;
        this.users.push(model);
        return model;
    }
    get(modelId = undefined, modelName = undefined) {
        for (let user of this.users) {
            if (modelId != undefined && user.id == modelId || modelName != undefined && user.name == modelName)
                return user;
        }
        return undefined;
    }
    list() {
        return this.users;
    }
}
exports.UserRepository = UserRepository;
