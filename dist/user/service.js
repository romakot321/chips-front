"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const models_1 = require("./models");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    create(name, x = undefined, y = undefined) {
        var model = new models_1.UserModel(name, x, y);
        model = this.userRepository.store(model);
        return model;
    }
    move(name, bias) {
        var model = this.userRepository.get(undefined, name);
        if (model == undefined)
            return;
        model.move(bias);
    }
    list() {
        return this.userRepository.list();
    }
}
exports.UserService = UserService;
