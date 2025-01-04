export interface RoomUserModel {
  name: string;
  score: number;
}


export interface RoomModel {
  name: string;
  users: RoomUserModel[];
}
