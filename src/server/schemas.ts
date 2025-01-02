import { UserModel } from '../user';


export enum MessageEvent {
  authenticate = 0,
  connected = 1,
  move = 2,
  entityAdd = 3,
  users = 4
}

interface MessageSchema {
  event: MessageEvent;
  data: object;
}



interface AuthenticateMessageDataSchema {
  event: number;
  data: {username: string, room: string};
}

export class AuthenticateMessageSchema implements MessageSchema {
  public event: MessageEvent = MessageEvent.authenticate;
  public data: {"username": string, "room": string};

  constructor(username: string, room: string) {
    this.data = {"username": username, "room": room};
  }

  static validate(obj: any): obj is AuthenticateMessageDataSchema {
    return (
      obj &&
      typeof obj === 'object' &&
      'event' in obj &&
      typeof obj.event === 'number' &&
      obj.event in MessageEvent &&
      'data' in obj &&
      typeof obj.data === 'object' &&
      'username' in obj.data &&
      'room' in obj.data
    )
  }

  static fromObject(raw: string): AuthenticateMessageSchema | null {
    var obj = JSON.parse(raw);
    if (!AuthenticateMessageSchema.validate(obj) || obj.event != MessageEvent.move)
      return null;
    return new AuthenticateMessageSchema(obj.data.username, obj.data.room);
  }
}

interface MoveMessageDataSchema {
  event: number;
  data: {x: number, y: number, username: string | null};
}

export class MoveMessageSchema implements MessageSchema {
  public event: MessageEvent = MessageEvent.move;
  public data: {"x": number, "y": number, "username": string | null};

  constructor(x: number, y: number, username: string | null) {
    this.data = {x: x, y: y, username: username};
  }

  static validate(obj: any): obj is MoveMessageDataSchema {
    return (
      obj &&
      typeof obj === 'object' &&
      'event' in obj &&
      typeof obj.event === 'number' &&
      obj.event in MessageEvent &&
      'data' in obj &&
      typeof obj.data === 'object' &&
      'x' in obj.data &&
      'username' in obj.data &&
      'y' in obj.data
    )
  }

  static fromObject(raw: string): MoveMessageSchema | null {
    var obj = JSON.parse(raw);
    if (!MoveMessageSchema.validate(obj) || obj.event != MessageEvent.move)
      return null;
    return new MoveMessageSchema(obj.data.x, obj.data.y, obj.data.username === "" ? null : obj.data.username);
  }
}

interface UsersMessageDataSchema {
  event: number;
  data: {users: {name: string, x: number, y: number}[]};
}

export class UsersMessageSchema implements MessageSchema {
  public event: MessageEvent = MessageEvent.users;
  public data: {"users": {"name": string, "x": number, "y": number}[]};

  constructor(users: UserModel[]) {
    let parsedUsers: {"name": string, "x": number, "y": number}[] = [];
    for (const user of users)
      parsedUsers.push({name: user.name, x: user.position.x, y: user.position.y});
    this.data = {users: parsedUsers};
  }

  static validate(obj: any): obj is UsersMessageDataSchema {
    return (
      obj &&
      typeof obj === 'object' &&
      'data' in obj &&
      typeof obj.data === 'object' &&
      'users' in obj.data &&
      Array.isArray(obj.data.users) &&
      'event' in obj &&
      typeof obj.event === 'number' &&
      obj.event in MessageEvent
    )
  }

  static fromObject(raw: string): UsersMessageSchema | null {
    var obj = JSON.parse(raw);
    if (!UsersMessageSchema.validate(obj) || obj.event != MessageEvent.users)
      return null;
    let users: UserModel[] = [];
    for (const user of (obj.data.users as {name: string, x: number, y: number}[]))
      users.push(new UserModel(user.name, user.x, user.y));
    return new UsersMessageSchema(users);
  }
}
