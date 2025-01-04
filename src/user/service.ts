import { UserModel, Vector } from './models';
import { UserRepository } from './repository';


export class UserService {
  constructor(private userRepository: UserRepository) { }

  create(name: string, score: number | undefined = undefined): UserModel {
    var model = new UserModel(name, score);
    return this.userRepository.store(model);
  }

  get(name: string): UserModel | undefined {
    return this.userRepository.get(undefined, name);
  }

  addScore(name: string, amount: number): void {
    var model = this.userRepository.get(undefined, name);
    if (model == undefined)
      return;
    model.addScore(amount);
  }

  list(): UserModel[] {
    return this.userRepository.list();
  }
}
