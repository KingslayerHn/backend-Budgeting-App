import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import http from 'http';
import cors from 'cors';
import path from 'path';
import keys from './config/keys';
import { Socket, Server as SocketServer } from 'socket.io';
import SocketIntance from './sockets/sockets';

// routes
import userRoutes from './routes/user.route';
import accountRoutes from './routes/accounts.route';
import expenseRoutes from './routes/expenses.route';
import incomeRoutes from './routes/income.route';
import transferencesRoutes from './routes/transferences.route';
import avatarRoutes from './routes/profile.image.route';
import friendsRoutes from './routes/friends.route';

dotenv.config();

class Server {
  public app: express.Application;
  public server: http.Server;
  public io: SocketServer;

  constructor() {
    this.app = express();
    this.server = new http.Server(this.app);
    // socket server
    this.io = new SocketServer(this.server);
    this.config();
    this.routes();
    this.socketConfig();
  }

  public config(): void {
    const { app, server } = this;
    app.set('port', keys.PORT);
    app.use(morgan(keys.MORGAN_DEV));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.static(path.join(__dirname, 'public')));
  }

  public routes(): void {
    const { app } = this;

    // user routes
    app.use('/api/users/', userRoutes);
    app.use('/api/accounts/', accountRoutes);
    app.use('/api/expenses/', expenseRoutes);
    app.use('/api/incomes/', incomeRoutes);
    app.use('/api/transferences/', transferencesRoutes);
    app.use('/api/friends/', friendsRoutes);

    // imagen profile routes
    app.use('/api/image/profile/', avatarRoutes);

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public/index.html'));
    });
  }

  public socketConfig(): void {
    new SocketIntance(this.io);
  }

  public start(): void {
    const { server, app } = this;
    server.listen(app.get('port'), () => {
      console.log(`Server start http://localhost:${app.get('port')}`);
    });
  }
}

export { Server };
