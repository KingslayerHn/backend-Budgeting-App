import { Server } from './server';
import { connect } from './config/db';

connect();
const server = new Server();
server.start();
