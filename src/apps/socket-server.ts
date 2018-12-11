import { createServer as createSecureServer, Server as SecureServer } from 'https';
import express from 'express';
import socketIo from 'socket.io';
import { Ssl } from '../config/ssl';
import { PgListener } from './database-notify-server';

export class SocketServer
{
  public static readonly PORT: number = 5203;
  private app: express.Application;
  private server: SecureServer;
  private io: SocketIO.Server;
  private port: string | number;

  constructor()
  {
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
  }

  private createApp(): void
  {
    this.app = express();
  }

  private createServer(): void
  {
    this.server = createSecureServer(Ssl.stripHunterOptions(), this.app);
  }

  private config(): void
  {
    this.port = SocketServer.PORT;
  }

  private sockets(): void
  {
    this.io = socketIo(this.server);
  }

  private listen(): void
  {
    this.server.listen(this.port, () =>
    {
      console.log('Running socket server on port %s', this.port);
    });

    this.io.on('connect', (socket: any) =>
    {
      console.log('Connected client on port %s.', this.port);

      PgListener.on('pg-listen', (value: any) =>
      {
        this.io.emit('message', {value});
      });

      socket.on('disconnect', () =>
      {
        console.log('Client disconnected');
      });
    });
  }

  public getApp(): express.Application
  {
    return this.app;
  }
}