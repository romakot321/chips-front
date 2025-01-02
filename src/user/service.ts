import { UserModel, Vector } from './models';
import { UserRepository } from './repository';


export class UserService {
  constructor(private userRepository: UserRepository) { }

  create(name: string, x: number | undefined = undefined, y: number | undefined = undefined): UserModel {
    var model = new UserModel(name, x, y);
    model = this.userRepository.store(model);
    return model;
  }

  move(name: string, bias: Vector): void {
    var model = this.userRepository.get(undefined, name);
    if (model == undefined)
      return;
    model.move(bias);
  }

  list(): UserModel[] {
    return this.userRepository.list();
  }
}
