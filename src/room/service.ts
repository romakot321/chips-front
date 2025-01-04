import { RoomRepository } from './repository';
import { RoomModel } from './models';


export class RoomService {
  constructor(public roomRepository: RoomRepository) { }

  async list(): Promise<RoomModel[]> {
    return await this.roomRepository.list();
  }
}
