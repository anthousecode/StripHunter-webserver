import { Client } from 'pg';
import { ENV_TYPE } from '../server';

export class Pg
{
  public static stripDbConfigString(): string
  {
    return ENV_TYPE === 'dev'
      ? 'postgres://postgres:Parol@localhost:5432/strip'
      : 'postgres://postgres:NA70Zt7R0ExYkbg9@localhost:5432/strip';
  }

  public static stripDbConfigObject(): any
  {
    return ENV_TYPE === 'dev'
      ? {
        user    : 'postgres',
        host    : 'localhost',
        database: 'strip',
        password: 'Parol',
        port    : 5432
      }
      : {
        user    : 'postgres',
        host    : 'localhost',
        database: 'strip',
        password: 'NA70Zt7R0ExYkbg9',
        port    : 5432
      };
  }

  constructor()
  {
  }

  get client(): Client
  {
    const client = new Client(Pg.stripDbConfigObject());
    client.connect();
    return client;
  }
}
