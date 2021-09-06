import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import http from 'http';
import cors from 'cors';
import path from 'path';
import keys from './config/keys';

// routes
import userRoutes from './routes/user.route';

dotenv.config();

class Server {
  public app: express.Application;
  public server: http.Server;

  constructor() {
    this.app = express();
    this.server = new http.Server(this.app);
    this.config();
    this.routes();
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

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public/index.html'));
    });
  }

  public start(): void {
    const { server, app } = this;
    server.listen(app.get('port'), () => {
      console.log(`Server start http://localhost:${app.get('port')}`);
    });
  }
}

export { Server };