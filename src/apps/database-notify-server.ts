import { Pg } from '../config/pg-client-settings';
import { Client } from 'pg';
import { EventEmitter } from 'events';
import { PgListenWorker } from '../controllers/pg-listen-worker';

export const PgListener = new EventEmitter();

export class DatabaseNotifyServer
{
  public static readonly channels: string[] = ['table_update'];
  private app: any;
  private worker: PgListenWorker;

  constructor()
  {
    this.worker = new PgListenWorker();
    this.createApp();
    this.connect();
  }

  private createApp(): void
  {
    this.app = new Client(Pg.stripDbConfigString());
  }

  private connect(): void
  {
    this.app.connect((err: Error) =>
    {
      if (err)
      {
        console.log(err.message);
      }
      this.app.on('notification', (msg: any) =>
      {
        this.emit(msg);
      });

      for (const e of DatabaseNotifyServer.channels)
      {
        this.app.query('LISTEN ' + e);
      }
    });
  }

  private emit(msg: any): void
  {
    if (msg && msg.hasOwnProperty('channel'))
    {
      if (typeof msg.payload !== 'string' || !msg.payload)
      {
        return undefined;
      }

      const object = JSON.parse(msg.payload) || {row: {}};

      this.worker.handleMessage(object);
      // Emit data
      // PgListener.emit('pg-listen', object);
    }
  }

  public getApp(): any
  {
    return this.app;
  }
}