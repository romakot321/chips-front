import { UserService, Vector } from '../user';
import {
  MoveMessageSchema, AuthenticateMessageSchema, UsersMessageSchema,
  MessageEvent,
} from './schemas';

let WebSocket: any;

if (typeof window !== 'undefined') {
    // Running in the browser
    WebSocket = window.WebSocket;
} else {
    // Running in Node.js
    WebSocket = require('ws');
}


export class ServerService {
  private socket: WebSocket;
  private isConnected: boolean = false;
  private connectionCreds: string | null = null;

  constructor(
      address: string,
      private userService: UserService,
      private openCallback: () => void
  ) {
    this.socket = new WebSocket(address);

    this.initListeners();
  }

  private initListeners() {
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onclose = this.onClose.bind(this);
  }

  private onOpen() {
    this.isConnected = true;
    console.log("Server connected");
    this.openCallback();
  }

  private onClose() {
    this.isConnected = false;
  }

  private onMessage(event: any) {
    console.log("Receive: ", event.data);
    const handler = new MessageHandler(this.userService);
    handler.handle(event.data);
  }

  private sendMessage(message: string) {
    if (this.isConnected == false)
      throw "Attempt to send message while server not connected";
    this.socket.send(message);
  }

  public authenticate(username: string, room: string): void {
    this.connectionCreds = username;
    let msg = new AuthenticateMessageSchema(username, room);
    this.sendMessage(JSON.stringify(msg));
  }

  public move(x: number, y: number): void {
    let msg = new MoveMessageSchema(x, y, null);
    this.sendMessage(JSON.stringify(msg));
  }
}


class MessageHandler {
  constructor(private userService: UserService) { }

  private handleUsers(msg: UsersMessageSchema): void {
    console.log("Add users")
    for (const user of msg.data.users)
      this.userService.create(user.name, user.x, user.y);
  }

  private handleMove(msg: MoveMessageSchema): void {
    console.log("Move user")
    if (msg.data.username != null)
      this.userService.move(msg.data.username, new Vector(msg.data.x, msg.data.y))
  }

  public handle(raw: string): void {
    let msg: any = UsersMessageSchema.fromObject(raw);
    if (msg !== null)
      return this.handleUsers(msg as UsersMessageSchema);

    msg = MoveMessageSchema.fromObject(raw);
    if (msg !== null)
      return this.handleMove(msg as MoveMessageSchema);
  }
}
