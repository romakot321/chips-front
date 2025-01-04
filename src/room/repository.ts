import { RoomModel } from './models';


export class RoomRepository {
  constructor(public baseUrl: string) { }

  async list(): Promise<RoomModel[]> {
    try {
      const response = await fetch(this.baseUrl + "/room");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data: RoomModel[] = await response.json();

      return data;
    } catch (error) {
      console.error('Unexpected error:', error);
    }
    return [];
  }
}
