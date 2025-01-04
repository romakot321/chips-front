import { UserService, Vector } from '../user';
import {
  ChangeScoreMessageSchema, AuthenticateMessageSchema, UsersMessageSchema,
  SuccessfulAuthMessageSchema, WinMessageSchema, RestartMessageSchema,
  MessageEvent
} from './schemas';

let WebSocket: any;

if (typeof window !== 'undefined') {
    // Running in the browser
    WebSocket = window.WebSocket;
} else {
    // Running in Node.js
    WebSocket = require('ws');
}

type changeScoreCallback = (username: string, amount: number) => void;
type authenticateCallback = (username: string, score: number) => void;
type usersCallback = (users: {name: string, score: number}[]) => void;


export class ServerService {
  private socket: WebSocket;
  private isConnected: boolean = false;
  private connectionCreds: string | null = null;

  constructor(
      address: string,
      private userService: UserService,
      private openCallback: () => void,
      private changeScoreCallback: changeScoreCallback | undefined = undefined,
      private authenticateCallback: authenticateCallback | undefined = undefined,
      private usersCallback: usersCallback | undefined = undefined,
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
    const handler = new MessageHandler(
      this.userService, this.changeScoreCallback, this.authenticateCallback, this.usersCallback
    );
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

  public changeScore(amount: number): void {
    let msg = new ChangeScoreMessageSchema(amount, null);
    this.sendMessage(JSON.stringify(msg));
  }

  public win(name: string): void {
    let msg = new WinMessageSchema(name);
    this.sendMessage(JSON.stringify(msg));
  }

  public restart(): void {
    let msg = new RestartMessageSchema();
    this.sendMessage(JSON.stringify(msg));
  }
}


class MessageHandler {
  constructor(
    private userService: UserService,
    private changeScoreCallback: changeScoreCallback | undefined = undefined,
    private authenticateCallback: authenticateCallback | undefined = undefined,
    private usersCallback: usersCallback | undefined = undefined,
  ) { }

  private handleUsers(msg: UsersMessageSchema): void {
    for (const user of msg.data.users)
      this.userService.create(user.name, user.score);
    if (this.usersCallback != undefined)
      this.usersCallback(msg.data.users);
  }

  private handleChangeScore(msg: ChangeScoreMessageSchema): void {
    if (msg.data.username != null) {
      this.userService.addScore(msg.data.username, msg.data.amount);
      if (this.changeScoreCallback != null)
        this.changeScoreCallback(msg.data.username, msg.data.amount);
    }
  }

  private handleAuthenticateResponse(msg: SuccessfulAuthMessageSchema): void {
    this.userService.create(msg.data.name, msg.data.score);
    if (this.authenticateCallback != undefined)
      this.authenticateCallback(msg.data.name, msg.data.score);
  }

  public handle(raw: string): void {
    let msg: any = UsersMessageSchema.fromObject(raw);
    if (msg !== null)
      return this.handleUsers(msg as UsersMessageSchema);

    msg = ChangeScoreMessageSchema.fromObject(raw);
    if (msg !== null)
      return this.handleChangeScore(msg as ChangeScoreMessageSchema);

    msg = SuccessfulAuthMessageSchema.fromObject(raw);
    if (msg !== null)
      return this.handleAuthenticateResponse(msg as SuccessfulAuthMessageSchema);
  }
}
