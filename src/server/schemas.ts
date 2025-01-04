import { UserModel } from '../user';


export enum MessageEvent {
  authenticate = 0,
  connected,
  move,
  entityAdd,
  users,
  changeScore,
  win,
  restart
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
  data: {users: {name: string, score: number}[]};
}

export class UsersMessageSchema implements MessageSchema {
  public event: MessageEvent = MessageEvent.users;
  public data: {"users": {"name": string, "score": number}[]};

  constructor(users: UserModel[]) {
    let parsedUsers: {"name": string, "score": number}[] = [];
    for (const user of users)
      parsedUsers.push({name: user.name, score: user.score});
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
    for (const user of (obj.data.users as {name: string, score: number}[]))
      users.push(new UserModel(user.name, user.score));
    return new UsersMessageSchema(users);
  }
}

interface ChangeScoreMessageDataSchema {
  event: number;
  data: {amount: number, username: string | null};
}

export class ChangeScoreMessageSchema implements MessageSchema {
  public event: MessageEvent = MessageEvent.changeScore;
  public data: {"amount": number, "username": string | null};

  constructor(amount: number, username: string | null) {
    this.data = {amount: amount, username: username};
  }

  static validate(obj: any): obj is ChangeScoreMessageDataSchema {
    return (
      obj &&
      typeof obj === 'object' &&
      'event' in obj &&
      typeof obj.event === 'number' &&
      obj.event in MessageEvent &&
      'data' in obj &&
      typeof obj.data === 'object' &&
      'username' in obj.data &&
      'amount' in obj.data
    )
  }

  static fromObject(raw: string): ChangeScoreMessageSchema | null {
    var obj = JSON.parse(raw);
    if (!ChangeScoreMessageSchema.validate(obj) || obj.event != MessageEvent.changeScore)
      return null;
    return new ChangeScoreMessageSchema(obj.data.amount, obj.data.username === "" ? null : obj.data.username);
  }
}

interface SuccessfulAuthMessageDataSchema {
  event: number;
  data: {score: number, name: string};
}

export class SuccessfulAuthMessageSchema implements MessageSchema {
  public event: MessageEvent = MessageEvent.authenticate;
  public data: {"score": number, "name": string};

  constructor(score: number, name: string) {
    this.data = {score: score, name: name};
  }

  static validate(obj: any): obj is SuccessfulAuthMessageDataSchema {
    return (
      obj &&
      typeof obj === 'object' &&
      'event' in obj &&
      typeof obj.event === 'number' &&
      obj.event in MessageEvent &&
      'data' in obj &&
      typeof obj.data === 'object' &&
      'name' in obj.data &&
      'score' in obj.data
    )
  }

  static fromObject(raw: string): SuccessfulAuthMessageSchema | null {
    var obj = JSON.parse(raw);
    if (!SuccessfulAuthMessageSchema.validate(obj) || obj.event != MessageEvent.authenticate)
      return null;
    return new SuccessfulAuthMessageSchema(obj.data.score, obj.data.name);
  }
}

interface WinMessageDataSchema {
  event: number;
  data: {name: string};
}

export class WinMessageSchema implements MessageSchema {
  public event: MessageEvent = MessageEvent.win;
  public data: {"name": string};

  constructor(name: string) {
    this.data = {name: name};
  }

  static validate(obj: any): obj is WinMessageDataSchema {
    return (
      obj &&
      typeof obj === 'object' &&
      'event' in obj &&
      typeof obj.event === 'number' &&
      obj.event in MessageEvent &&
      'data' in obj &&
      typeof obj.data === 'object' &&
      'name' in obj.data
    )
  }

  static fromObject(raw: string): WinMessageSchema | null {
    var obj = JSON.parse(raw);
    if (!WinMessageSchema.validate(obj) || obj.event != MessageEvent.win)
      return null;
    return new WinMessageSchema(obj.data.name);
  }
}

interface RestartMessageDataSchema {
  event: number;
  data: {};
}

export class RestartMessageSchema implements MessageSchema {
  public event: MessageEvent = MessageEvent.restart;
  public data: {};

  constructor() {
    this.data = {};
  }

  static validate(obj: any): obj is RestartMessageDataSchema {
    return (
      obj &&
      typeof obj === 'object' &&
      'event' in obj &&
      typeof obj.event === 'number' &&
      obj.event in MessageEvent &&
      'data' in obj &&
      typeof obj.data === 'object'
    )
  }

  static fromObject(raw: string): RestartMessageSchema | null {
    var obj = JSON.parse(raw);
    if (!RestartMessageSchema.validate(obj) || obj.event != MessageEvent.restart)
      return null;
    return new RestartMessageSchema();
  }
}
