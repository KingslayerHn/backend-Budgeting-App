import { Socket, Server as SocketServer } from 'socket.io';
class Sockets {
  public io: SocketServer;
  constructor(io: SocketServer) {
    this.io = io;
    this.notificationEvents();
  }

  notificationEvents(): void {
    this.io.on('connection', (client: Socket) => {
      console.log('user connected!!', { client });
    });
  }
}

export default Sockets;
