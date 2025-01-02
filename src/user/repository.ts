import { UserModel } from './models';


export class UserRepository {
  private users: UserModel[];

  constructor() {
    this.users = [];
  }

  store(model: UserModel): UserModel {
    model.id = this.users.length + 1;
    this.users.push(model);
    return model;
  }

  get(modelId: number | undefined = undefined, modelName: string | undefined = undefined): UserModel | undefined {
    for (let user of this.users) {
      if (modelId != undefined && user.id == modelId || modelName != undefined && user.name == modelName)
        return user;
    }
    return undefined;
  }

  list(): UserModel[] {
    return this.users;
  }
}
